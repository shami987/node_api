import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Stripe from "stripe";

type StripeClient = InstanceType<typeof Stripe>;
let stripeClient: StripeClient | null = null;

function getStripe(): StripeClient | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        message: "Stripe is not configured (missing STRIPE_SECRET_KEY on the server)",
      });
    }

    const { amount } = req.body; // dollars from client; converted to cents below

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user!._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ message: "Stripe is not configured" });
    }

    const { paymentIntentId, orderId } = req.body;

    // Retrieve the PaymentIntent to confirm it was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Here you would update your order status in the database
    // This is handled in the order controller for now

    res.json({
      message: "Payment confirmed successfully",
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};
