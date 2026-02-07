import express from "express";
import Invoice from "../models/Invoice.js";
import { protect } from "../middlewares/authMiddleware.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Get ALL invoices
router.get("/", async (req, res) => {
  const invoices = await Invoice.find()
    .populate("user")
    .populate("plan")
    .populate("payment")
    .sort({ createdAt: -1 });

  res.json(invoices);
});

// Get invoices by user
router.get("/user/:userId", async (req, res) => {
  const invoices = await Invoice.find({ user: req.params.userId })
    .populate("plan")
    .populate("payment")
    .sort({ createdAt: -1 });

  res.json(invoices);
});

// ✅ USER: Get only their invoices
router.get("/my", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ USER DOWNLOAD OWN PDF
router.get("/download/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice)
      return res.status(404).json({ message: "Invoice not found" });

    if (invoice.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.join(
      process.cwd(),
      "invoices",
      `invoice-${invoice._id}.pdf`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice file not found" });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
