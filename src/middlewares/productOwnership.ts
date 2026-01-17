import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { Product } from "../models/Product";

export const isProductOwnerOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Check if user exists
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // Admin can do anything
  if (req.user.role === "admin") {
    return next();
  }

  // Vendor can modify only own products
  if (
    req.user.role === "vendor" &&
    product.createdBy.toString() === req.user._id
  ) {
    return next();
  }

  return res.status(403).json({ message: "Not allowed to modify this product" });
};
