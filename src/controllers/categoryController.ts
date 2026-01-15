import { Request, Response } from "express";
import { Category } from "../models/Category";

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
};

// GET category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
};

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await Category.create({
    name,
    description,
  });

  res.status(201).json({
    message: "Category created successfully",
    category,
  });
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({
    message: "Category updated successfully",
    category,
  });
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Category deleted successfully" });
};
