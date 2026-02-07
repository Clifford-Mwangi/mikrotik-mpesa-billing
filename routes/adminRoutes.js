// routes/adminRoutes.js
import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getStats,
  listUsers,
  listPayments,
  listInvoices,
  downloadInvoice,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes protected by token
router.use(adminAuth);

router.get("/stats", getStats);
router.get("/users", listUsers);
router.get("/payments", listPayments);
router.get("/invoices", listInvoices);
router.get("/invoices/download/:id", downloadInvoice);

export default router;
