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
  // console.log("Adding item to cart for user:", req.user!._id);
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
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user!._id;

  try {
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      // Update existing item
      existingItem.quantity = quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ==============================
// DELETE cart item
// ==============================
export const deleteCartItem = async (
  req: AuthRequest,
  res: Response
) => {
  const { productId } = req.params;
  const userId = req.user!._id;

  try {
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove item from cart (don't throw error if item doesn't exist)
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
    }
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ==============================
// GET ALL CARTS (Admin)
// ==============================
export const getAllCarts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const carts = await Cart.find()
      .populate('userId', 'name email')
      .populate('items.product', 'name price image')
      .sort({ updatedAt: -1 });

    const transformedCarts = carts.map(cart => ({
      _id: cart._id,
      userId: (cart.userId as any)._id || cart.userId,
      user: {
        name: (cart.userId as any).name,
        email: (cart.userId as any).email
      },
      items: cart.items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    }));

    res.json(transformedCarts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ==============================
// DELETE CART (Admin)
// ==============================
export const deleteCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { cartId } = req.params;
    
    const cart = await Cart.findByIdAndDelete(cartId);
    
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
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
