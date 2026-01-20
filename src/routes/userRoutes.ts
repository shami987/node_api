import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";
import {
  uploadProfileImage,
  deleteProfileImage
} from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * /api/users/profile/image:
 *   put:
 *     summary: Upload or update user profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile image updated successfully
 *                 image:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/avatar.jpg
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

/**
 * @swagger
 * /api/users/profile/image:
 *   delete:
 *     summary: Delete user profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile image deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No profile image found
 */

router.delete("/profile/image", protect, deleteProfileImage);

export default router;


