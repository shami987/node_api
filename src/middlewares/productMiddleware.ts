import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateProductBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { name, price, categoryId, inStock, quantity } = req.body;

  // Required fields
  if (
    !name ||
    price === undefined ||
    !categoryId ||
    inStock === undefined ||
    quantity === undefined
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  // Cast types (CRITICAL)
  price = Number(price);
  quantity = Number(quantity);
  inStock = inStock === "true" || inStock === true;

  // Put back casted values
  req.body.price = price;
  req.body.quantity = quantity;
  req.body.inStock = inStock;

  // Validate
  if (typeof name !== "string") {
    res.status(400).json({ message: "Name must be a string" });
    return;
  }

  if (isNaN(price) || price < 0) {
    res.status(400).json({ message: "Price must be a positive number" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400).json({ message: "Invalid categoryId format" });
    return;
  }

  if (typeof inStock !== "boolean") {
    res.status(400).json({ message: "inStock must be boolean" });
    return;
  }

  if (isNaN(quantity) || quantity < 0) {
    res.status(400).json({ message: "Quantity must be positive" });
    return;
  }

  next();
};
