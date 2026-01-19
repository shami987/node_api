import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { Cart } from "../models/Cart";

export const isCartOwnerOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Admins can access any cart
  if (user.role === "admin") {
    return next();
  }

  // Customers can only access their own cart
  const cart = await Cart.findOne({ userId: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  if (cart.userId.toString() !== user._id) {
    return res.status(403).json({ message: "Access denied: not your cart" });
  }

  next();
};
