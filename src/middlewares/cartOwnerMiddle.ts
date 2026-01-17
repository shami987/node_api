// middlewares/cartOwnerMiddleware.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const isCartOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  const { userId } = req.params;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Admin can manage any cart
  if (user.role === "admin") {
    return next();
  }

  // Only the owner of the cart can access
  if (user._id !== userId) {
    return res.status(403).json({ message: "Access denied: not your cart" });
  }

  next();
};
