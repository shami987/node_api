import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category";

export const validateCategoryExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoryId } = req.body;

  if (!categoryId) {
    res.status(400).json({ message: "categoryId is required" });
    return;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    res.status(400).json({
      message: "Invalid categoryId. Category does not exist",
      categoryIdSent: categoryId
    });
    return;
  }

  next();
};
