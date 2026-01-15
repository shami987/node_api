import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateCartItemBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    res.status(400).json({ message: "productId and quantity are required" });
    return;
  }

  if (typeof productId !== "string") {
    res.status(400).json({ message: "productId must be a UUID string" });
    return;
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    res.status(400).json({ message: "quantity must be a positive number" });
    return;
  }

  next();
};
