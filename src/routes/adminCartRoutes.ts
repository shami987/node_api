import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import {
  getAllCarts,
  getUserCart,
  addItemToUserCart,
  updateUserCartItem,
  deleteUserCartItem,
  clearUserCart,
  deleteCart
} from "../controllers/adminCartController";

const router = Router();

router.use(protect, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: AdminCart
 *   description: Admin cart management
 */

/**
 * @swagger
 * /api/admin/carts:
 *   get:
 *     summary: Get all user carts (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All carts retrieved successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/carts", getAllCarts);

/**
 * @swagger
 * /api/admin/carts/{userId}:
 *   get:
 *     summary: Get specific user's cart (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User cart retrieved successfully
 *       404:
 *         description: Cart not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/carts/:userId", getUserCart);

/**
 * @swagger
 * /api/admin/carts/{userId}:
 *   post:
 *     summary: Add item to user's cart (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: Item added to user cart
 *       403:
 *         description: Forbidden - Admin access only
 */
router.post("/carts/:userId", addItemToUserCart);

/**
 * @swagger
 * /api/admin/carts/{userId}/{productId}:
 *   put:
 *     summary: Update user's cart item (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *         description: Cart item updated successfully
 *       404:
 *         description: Cart or item not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.put("/carts/:userId/:productId", updateUserCartItem);

/**
 * @swagger
 * /api/admin/carts/{userId}/{productId}:
 *   delete:
 *     summary: Remove item from user's cart (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Item removed from user cart
 *       404:
 *         description: Cart or item not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.delete("/carts/:userId/:productId", deleteUserCartItem);

/**
 * @swagger
 * /api/admin/carts/{cartId}:
 *   delete:
 *     summary: Delete a cart by cart ID (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.delete("/carts/:cartId", deleteCart);

/**
 * @swagger
 * /api/admin/carts/user/{userId}:
 *   delete:
 *     summary: Clear user's cart (Admin only)
 *     tags: [AdminCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User cart cleared successfully
 *       404:
 *         description: Cart not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.delete("/carts/user/:userId", clearUserCart);

export default router;