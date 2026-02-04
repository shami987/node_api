import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createOrder, 
  getMyOrders,
  getOrderById,
  cancelOrder,
  sendConfirmationEmail
} from "../controllers/orderController";

const router = Router();

router.use(protect); // 🔐 all routes protected

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 */
router.post("/", createOrder); // POST /api/orders

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getMyOrders);          // GET /api/orders
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get("/:id", getOrderById);      // GET /api/orders/:id

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel a pending order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Only pending orders can be cancelled
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.patch("/:id/cancel", cancelOrder); // PATCH /api/orders/:id/cancel

/**
 * @swagger
 * /api/orders/send-confirmation:
 *   post:
 *     summary: Send order confirmation email
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               customerName:
 *                 type: string
 *               orderId:
 *                 type: string
 *               orderDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Confirmation email sent
 *       500:
 *         description: Failed to send email
 */
router.post("/send-confirmation", sendConfirmationEmail);

export default router;
