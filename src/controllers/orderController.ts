import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";

export const createOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  const cart = await Cart.findOne({ userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = cart.items.map(item => {
    const product: any = item.product;
    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    };
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const shipping = 5; // Fixed shipping cost
  const tax = 0; // No tax
  const total = subtotal + shipping + tax;

  const order = await Order.create({
    userId,
    items: orderItems,
    subtotal,
    shipping,
    tax,
    total,
    totalAmount: total // Keep this if your schema also has totalAmount
  });

  await Cart.findOneAndDelete({ userId });

  res.status(201).json({
    message: "Order placed successfully",
    order
  });
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
