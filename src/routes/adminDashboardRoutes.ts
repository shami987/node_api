import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import {
  getDashboardStats,
  getRevenueData,
  getTopProducts,
  getRecentOrders,
  getAnalytics
} from "../controllers/adminDashboardController";

const router = Router();

router.use(protect, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: AdminDashboard
 *   description: Admin dashboard analytics
 */

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [AdminDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                 totalOrders:
 *                   type: number
 *                 totalCustomers:
 *                   type: number
 *                 growthRate:
 *                   type: number
 *                 revenueChange:
 *                   type: string
 *                 ordersChange:
 *                   type: string
 *                 customersChange:
 *                   type: string
 *                 growthChange:
 *                   type: string
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/dashboard/stats", getDashboardStats);

/**
 * @swagger
 * /api/admin/dashboard/revenue:
 *   get:
 *     summary: Get revenue data by month (Admin only)
 *     tags: [AdminDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   revenue:
 *                     type: number
 *                   orders:
 *                     type: number
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/dashboard/revenue", getRevenueData);

/**
 * @swagger
 * /api/admin/dashboard/top-products:
 *   get:
 *     summary: Get top selling products (Admin only)
 *     tags: [AdminDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   sales:
 *                     type: number
 *                   revenue:
 *                     type: number
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/dashboard/top-products", getTopProducts);

/**
 * @swagger
 * /api/admin/dashboard/recent-orders:
 *   get:
 *     summary: Get recent orders (Admin only)
 *     tags: [AdminDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/dashboard/recent-orders", getRecentOrders);

/**
 * @swagger
 * /api/admin/dashboard/analytics:
 *   get:
 *     summary: Get analytics data (Admin only)
 *     tags: [AdminDashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/dashboard/analytics", getAnalytics);

export default router;