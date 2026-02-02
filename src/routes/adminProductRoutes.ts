import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController";
import { validateProductBody } from "../middlewares/productMiddleware";
import { validateCategoryExists } from "../middlewares/validateCategoryExists";
import { upload } from "../config/multer";

const router = Router();

router.use(protect, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: AdminProducts
 *   description: Admin product management
 */

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (Admin only)
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products retrieved successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.get("/products", getAllProducts);

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create a product (Admin only)
 *     tags: [AdminProducts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 1200
 *               description:
 *                 type: string
 *                 example: Latest Apple phone
 *               categoryId:
 *                 type: string
 *                 example: 65abc123456
 *               inStock:
 *                 type: boolean
 *                 example: true
 *               quantity:
 *                 type: number
 *                 example: 20
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         description: Forbidden - Admin access only
 */
router.post(
  "/products",
  upload.single("image"),
  validateProductBody,
  validateCategoryExists,
  createProduct
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [AdminProducts]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *               quantity:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.put(
  "/products/:id",
  upload.single("image"),
  validateProductBody,
  validateCategoryExists,
  updateProduct
);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [AdminProducts]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Forbidden - Admin access only
 */
router.delete("/products/:id", deleteProduct);

export default router;