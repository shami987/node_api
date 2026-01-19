import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Cart } from "../models/Cart";


export const getCartByUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!._id; // 🔥 get user from token

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


// ==============================
// ADD item to cart
// ==============================
export const addItemToCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const item = cart.items.find(
    i => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(201).json({ message: "Item added to cart", cart });
};


// ==============================
// UPDATE cart item quantity
// ==============================
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { quantity } = req.body;
    const { userId, id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      message: "Cart item updated",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ==============================
// DELETE cart item
// ==============================
export const deleteCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId, id } = req.params;
    const itemId = Array.isArray(id) ? id[0] : id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.deleteOne();
    await cart.save();

    res.json({
      message: "Item removed from cart",
      cart
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ==============================
// CLEAR cart
// ==============================
export const clearCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await Cart.findOneAndDelete({
     userId: req.user!._id

    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
