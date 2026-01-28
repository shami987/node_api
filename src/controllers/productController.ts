import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Product } from "../models/Product";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// GET all products (with category populated)
export const getProducts = async (req: AuthRequest, res: Response) => { // Fetch all products with category populated
  const { search } = req.query;

  let query: any ={};

  //🔍 Text search (uses MongoDB text index)
 if (search) {
    query = { $text: { $search: search as string } };
  }
  const products = await Product.find(query).populate("category");
  res.json({ products });
};

// GET product by ID
export const getProductById = async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

// CREATE product
export const createProduct = async (req: AuthRequest, res: Response) => {
  // console.log("Request body:", req.body); // Debugging line
  // console.log("Request file:", req.file); // Debugging line
  const { name, price, description, categoryId, inStock, quantity } = req.body;

  let image: string | undefined;

  if (req.file) {
    
    const uploaded = await uploadToCloudinary(req.file.buffer);
    image = uploaded.secure_url;
  }

  const product = await Product.create({
    name,
    price,
    description,
    category: categoryId,
    inStock,
    quantity,
    image,
    createdBy: req.user!._id
  });

  res.status(201).json({
    message: "Product created successfully",
    product
  });
};


// UPDATE product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  // console.log("Request body:", req.body); // Debugging line
  const { name, price, description, categoryId, inStock, quantity, image } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      price,
      description,
      category: categoryId,
      inStock,
      quantity,
      image
    },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    message: "Product updated successfully",
    product
  });
};

// DELETE product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Product deleted successfully" });
};
