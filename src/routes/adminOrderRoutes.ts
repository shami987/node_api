import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles  } from "../middlewares/roleMiddleware";
import {
  getAllOrders,
  updateOrderStatus
} from "../controllers/adminOrderController";

const router = Router();

router.use(protect, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: AdminOrders
 *   description: Admin order management
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved
 *       403:
 *         description: Forbidden
 */
router.get("/orders", getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [AdminOrders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Invalid status
 */
router.patch("/orders/:id/status", updateOrderStatus);

export default router;
