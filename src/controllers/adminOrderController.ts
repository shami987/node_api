import { Request, Response } from "express";
import { Order } from "../models/Order";

export const getAllOrders = async (_: Request, res: Response) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.product", "name")
    .sort({ createdAt: -1 });

  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email")
    .populate("items.product", "name");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;

  const allowed = ["confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "delivered") {
    return res
      .status(400)
      .json({ message: "Delivered orders cannot be modified" });
  }

  order.status = status;
  await order.save();

  res.json({ message: "Order status updated", order });
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted successfully" });
};
