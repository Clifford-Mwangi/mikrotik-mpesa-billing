// controllers/adminController.js
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Plan from "../models/Plan.js";
import Invoice from "../models/Invoice.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalInvoices = await Invoice.countDocuments();
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    res.json({ totalUsers, totalPayments, totalInvoices, revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v").lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email phone")
      .populate("plan", "name price durationHours")
      .sort({ createdAt: -1 })
      .lean();
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const listInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("user", "name email")
      .populate("plan", "name")
      .populate("payment", "transactionId")
      .sort({ issuedAt: -1 })
      .lean();
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// send invoice PDF file
export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      console.log("❌ Invoice not found in DB:", id);
      return res.status(404).json({ message: "Invoice not found in DB" });
    }

    // ✅ IMPORTANT FIX: use PAYMENT ID (not invoice ID)
    const paymentId = invoice.payment;
    const fileName = `invoice-${paymentId}.pdf`;

    const filePath = path.join(process.cwd(), "invoices", fileName);

    console.log("📂 Looking for invoice at:", filePath);

    if (!fs.existsSync(filePath)) {
      console.log("❌ Invoice file not found on disk:", filePath);
      return res.status(404).json({ message: "Invoice file not found" });
    }

    return res.sendFile(filePath);
  } catch (err) {
    console.error("❌ Download invoice error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
