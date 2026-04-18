import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { createPaymentIntent, confirmPayment } from "../controllers/paymentController";

const router = Router();

// All payment routes require authentication
router.use(protect);

// Create payment intent
router.post("/create-payment-intent", createPaymentIntent);

// Confirm payment
router.post("/confirm-payment", confirmPayment);

export default router;
