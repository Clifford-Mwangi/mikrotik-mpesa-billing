import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure your email settings
const transporter = nodemailer.createTransport({
  service: "gmail", // or SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// FUNCTION: send email with PDF attachment
export const sendInvoiceEmail = async (toEmail, pdfFilePath) => {
  try {
    const mailOptions = {
      from: `"MikroTik Billing" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Invoice",
      text: "Attached is your invoice. Thank you for your payment.",
      attachments: [
        {
          filename: path.basename(pdfFilePath),
          path: pdfFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    console.log("📧 Invoice email sent to:", toEmail);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
