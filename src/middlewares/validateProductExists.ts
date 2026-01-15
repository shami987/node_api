import { Request, Response, NextFunction } from "express";
import { Product } from "../models/Product";

export const validateProductExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(400).json({
      message: "Invalid productId. Product does not exist"
    });
    return;
  }

  next();
};
