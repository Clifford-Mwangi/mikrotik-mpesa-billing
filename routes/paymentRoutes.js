import express from "express";
import { makePayment, payForPlan } from "../controllers/paymentController.js";
import { mpesaCallback } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/test", makePayment); // test route
router.post("/pay", payForPlan); // mpesa route

router.post("/callback", mpesaCallback);

export default router;
