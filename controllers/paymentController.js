import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Plan from "../models/Plan.js";
import { initiateSTKPush } from "../services/mpesaService.js";
import Invoice from "../models/Invoice.js";
import { generateInvoice } from "../services/invoiceService.js";
import { sendInvoiceEmail } from "../services/emailService.js";

/* ============================================================
   1️⃣ MANUAL TEST PAYMENT (No Mpesa)
============================================================ */
export const makePayment = async (req, res) => {
  try {
    const { userId, planId, amount } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const payment = new Payment({
      user: userId,
      plan: planId,
      amount,
      status: "success",
      transactionId: "TEST-" + Date.now(),
    });

    await payment.save();
    await User.findByIdAndUpdate(userId, { activePlan: planId });

    res.json({ message: "Payment recorded", payment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   2️⃣ START MPESA STK PUSH
   (Auto-create user if phone not registered)
============================================================ */
export const payForPlan = async (req, res) => {
  try {
    const { phone, amount, planName, planId } = req.body;

    if (!phone || !planId || !amount || !planName)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    // Check if user exists, otherwise create
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        username: phone,
        macAddress: phone, // temporary placeholder
      });
      console.log("⚡ New user created for phone:", phone);
    }

    // Initiate STK Push
    const response = await initiateSTKPush(
      phone,
      amount,
      planName,
      `Payment for ${planName}`
    );

    // Save pending payment
    const payment = new Payment({
      user: user._id,
      plan: planId,
      amount,
      status: "pending",
      transactionId: response.CheckoutRequestID || "STK-" + Date.now(),
    });

    await payment.save();

    res.json({
      success: true,
      message: "STK Push initiated",
      data: response,
      paymentId: payment._id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Payment initiation failed" });
  }
};

/* ============================================================
   3️⃣ MPESA CALLBACK
   (Activate user plan, create invoice PDF, send email)
============================================================ */
export const mpesaCallback = async (req, res) => {
  console.log("🔥 M-PESA CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const callback = req.body.Body.stkCallback;
    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    const payment = await Payment.findOne({ transactionId: checkoutRequestId });
    if (!payment) {
      console.log("⚠️ No payment found for callback");
      return res.json({ success: true });
    }

    if (resultCode === 0) {
      // ✅ Payment successful
      const data = callback.CallbackMetadata.Item;

      const amount = data.find((i) => i.Name === "Amount")?.Value;
      const receipt = data.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
      const date = data.find((i) => i.Name === "TransactionDate")?.Value;
      const phone = data.find((i) => i.Name === "PhoneNumber")?.Value;

      payment.status = "success";
      payment.amount = amount;
      payment.transactionId = receipt;
      payment.phone = phone;
      payment.transactionDate = date;
      await payment.save();

      // Activate user plan
      const user = await User.findById(payment.user);
      const plan = await Plan.findById(payment.plan);
      if (user) {
        user.activePlan = payment.plan;
        user.planActivatedAt = new Date();
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();
        console.log("🎉 User plan activated successfully!");
      }

      // Create invoice record
      const invoice = await Invoice.create({
        user: payment.user,
        plan: payment.plan,
        payment: payment._id,
        amount: payment.amount,
        status: "paid",
        issuedAt: new Date(),
      });
      console.log("🧾 Invoice created:", invoice._id);

      // Generate PDF
      let pdfFilePath = null;
      if (user && plan) {
        pdfFilePath = await generateInvoice(payment, user, plan);
        console.log("🧾 Invoice PDF generated:", pdfFilePath);
      }

      // Send email
      try {
        if (user && user.email && pdfFilePath) {
          await sendInvoiceEmail(user.email, pdfFilePath);
          console.log("📧 Invoice email sent");
        } else {
          console.log("⚠️ Missing email or PDF path — not sent");
        }
      } catch (emailErr) {
        console.error("❌ Failed to send invoice email:", emailErr);
      }
    } else {
      // ❌ Payment failed
      payment.status = "failed";
      await payment.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Callback Error:", err);
    return res.status(500).json({ success: false });
  }
};
