import { Request, Response } from "express";
import { Order } from "../models/Order";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email') // Populate user data
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });

    // Transform the data to include user info
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      id: order._id,
      user: {
        email: (order.userId as any)?.email,
        name: (order.userId as any)?.name
      },
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: (order as any).createdAt,
      updatedAt: (order as any).updatedAt
    }));

    res.json(transformedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
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
