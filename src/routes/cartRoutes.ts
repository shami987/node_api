import { Router } from "express";
import {
  getCartByUser,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../controllers/cartControllers";

import { validateCartItemBody } from "../middlewares/cartMiddleware";
import { isCartOwnerOrAdmin } from "../middlewares/cartOwnerMiddle";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getCartByUser);

/**
 * @swagger
 * /api/cart/{userId}/items:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 65abc12345
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *       404:
 *         description: Product not found
 */

// ADD item to cart (only owner or admin)
router.post("/:userId/items", protect, isCartOwnerOrAdmin, validateCartItemBody, addItemToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:     
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */

// UPDATE cart item (only owner or admin)
router.put("/:userId/items/:id", protect, isCartOwnerOrAdmin, validateCartItemBody, updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 */

router.delete("/:userId/items/:id", deleteCartItem);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */

// CLEAR cart (only owner or admin)
router.delete("/:userId", protect, isCartOwnerOrAdmin, clearCart);

export default router;
