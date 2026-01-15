import { Router } from "express";
import { register, login, logout, getProfile, changePassword } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
router.post("/logout", protect, logout);
router.put("/change-password", protect, changePassword);



export default router;