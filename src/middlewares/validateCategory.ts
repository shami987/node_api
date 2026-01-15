import { Request, Response, NextFunction } from "express";

export const validateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description } = req.body;

  // Name validation (required for POST, optional for PUT)
  if (req.method === "POST") {
    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({
        message: "Category name is required and must be a non-empty string"
      });
      return;
    }
  }

  // If name is provided (PUT), validate it
  if (name !== undefined && typeof name !== "string") {
    res.status(400).json({
      message: "Category name must be a string"
    });
    return;
  }

  // Description is optional but must be string if provided
  if (description !== undefined && typeof description !== "string") {
    res.status(400).json({
      message: "Description must be a string"
    });
    return;
  }

  next();
};

