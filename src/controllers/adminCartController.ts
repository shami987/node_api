import { Request, Response } from "express";
import { Cart } from "../models/Cart";

export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find()
      .populate("userId", "name email")
      .populate("items.product");
    
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    
    const cart = await Cart.findOne({ userId })
      .populate("items.product");
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addItemToUserCart = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    const item = cart.items.find(i => i.product.toString() === productId);
    
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    res.status(201).json({ message: "Item added to user cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserCartItem = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    res.json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteUserCartItem = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    res.json({ message: "Item removed from user cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const clearUserCart = async (req: Request, res: Response) => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    res.json({ message: "User cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const cartId = Array.isArray(req.params.cartId) ? req.params.cartId[0] : req.params.cartId;
    
    const cart = await Cart.findByIdAndDelete(cartId);
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};