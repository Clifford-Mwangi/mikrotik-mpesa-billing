import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import invoiceRoutes from "./routes/invoiceRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { createDefaultPlans } from "./controllers/planController.js";

dotenv.config();

const app = express();

/* ----------------- MIDDLEWARE ----------------- */
app.use(cors());
app.use(express.json());

/* ----------------- PATH SETUP ----------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------------- FRONTEND ----------------- */
// Serve everything inside /public
app.use(express.static(path.join(__dirname, "public")));

// Hotspot entry page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "buy.html"));
});

/* ----------------- API ROUTES ----------------- */
app.use("/api/invoices", invoiceRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

/* ----------------- DATABASE + SERVER ----------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    await createDefaultPlans();
    console.log("✅ Default plans ready");

    // IMPORTANT FIX — allow LAN & WiFi access
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on all interfaces on port ${PORT}`);
      console.log(`🌐 Hotspot URL: http://192.168.88.10:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

//"userId": "690e980b64d8b3f60f79e673",
//"planId": "690d15acbfdfd25003fd5824"
