import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { sendOrderConfirmation } from "../services/emailService";

type OrderLine = {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
};

/** Build lines from request body; prices always come from DB (ignore client price). */
async function orderItemsFromRequestBody(bodyItems: unknown): Promise<OrderLine[] | null> {
  if (!Array.isArray(bodyItems) || bodyItems.length === 0) {
    return null;
  }
  const orderItems: OrderLine[] = [];
  for (const row of bodyItems as { product?: unknown; productId?: unknown; quantity?: unknown }[]) {
    const pid = row.product ?? row.productId;
    if (pid == null || pid === "") {
      return null;
    }
    const product = await Product.findById(String(pid)).select("name price");
    if (!product) {
      return null;
    }
    const qty = Math.max(1, Math.floor(Number(row.quantity) || 1));
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: qty
    });
  }
  return orderItems;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { shippingAddress, items: bodyItems } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.product");

    let orderItems: OrderLine[];

    if (cart && cart.items.length > 0) {
      orderItems = cart.items.map(item => {
        const product: any = item.product;
        if (!product?._id) {
          throw new Error("INVALID_CART_PRODUCT");
        }
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        };
      });
    } else {
      const fromBody = await orderItemsFromRequestBody(bodyItems);
      if (!fromBody) {
        return res.status(400).json({
          message: "Cart is empty",
          hint: "Your account has no saved cart on the server. Add products while logged in, then try checkout again."
        });
      }
      orderItems = fromBody;
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = 5;
    const tax = 0;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      userId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      totalAmount: total,
      shippingAddress,
      paymentStatus: "pending"
    });

    res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "INVALID_CART_PRODUCT") {
      return res.status(400).json({ message: "Cart contains invalid or removed products" });
    }
    console.error("createOrder:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// GET all orders (logged-in user)
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ userId: req.user!._id })
    .sort({ createdAt: -1 });

  res.json(orders);
};

// GET single order (ownership)
export const getOrderById = async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId.toString() !== req.user!._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(order);
};

// CANCEL order (pending only)
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId.toString() !== req.user!._id.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (order.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Only pending orders can be cancelled" });
  }

  order.status = "cancelled";
  await order.save();

  res.json({ message: "Order cancelled", order });
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const userId = req.user!._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Update order with payment information
    order.paymentStatus = "paid";
    order.paymentIntentId = paymentIntentId;
    order.status = "confirmed";
    await order.save();

    // Clear the cart after successful payment
    await Cart.findOneAndDelete({ userId });

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        orderId: order._id.toString(),
        email: req.body.email,
        customerName: order.shippingAddress?.name || 'Customer',
        orderDetails: {
          items: order.items,
          total: order.total,
          subtotal: order.subtotal,
          shipping: order.shipping,
          shippingAddress: order.shippingAddress
        }
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the response if email fails
    }

    res.json({
      message: "Payment confirmed and order completed",
      order
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};

export const sendConfirmationEmail = async (req: AuthRequest, res: Response) => {
  try {
    await sendOrderConfirmation(req.body);
    res.json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};
