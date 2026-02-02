import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController";
import { validateCategory } from "../middlewares/validateCategory";

const router = Router();

router.use(protect, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: AdminCategories
 *   description: Admin category management
 */

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories (Admin only)
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All categories retrieved successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a category (Admin only)
 *     tags: [AdminCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Devices and accessories
 *     responses:
 *       201:
 *         description: Category created successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.post("/categories", validateCategory, createCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [AdminCategories]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.put("/categories/:id", validateCategory, updateCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [AdminCategories]
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
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.delete("/categories/:id", deleteCategory);

export default router;