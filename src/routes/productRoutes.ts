import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController";
import { validateProductBody } from "../middlewares/productMiddleware";
import { validateCategoryExists } from "../middlewares/validateCategoryExists";
import { protect } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { isProductOwnerOrAdmin } from "../middlewares/productOwnership";
import { upload } from "../config/multer";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
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
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", protect, getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
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
 */
// Admin + Vendor – Create product with image
router.post(
  "/",
  protect,
  upload.single("image"),
  authorizeRoles("admin", "vendor"),
  validateProductBody,
  validateCategoryExists,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 */
// Admin + Vendor (ownership enforced) – Update product with optional image
router.put(
  "/:id",
  protect,
  upload.single("image"),
  authorizeRoles("admin", "vendor"),
  validateProductBody,
  validateCategoryExists,
  isProductOwnerOrAdmin,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 */
// Admin + Vendor (ownership enforced)
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "vendor"),
  isProductOwnerOrAdmin,
  deleteProduct
);

export default router;
