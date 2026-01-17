// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

interface JwtPayload {
  id: string;
  role: "admin" | "vendor" | "client";
}

interface CustomUser {
  _id: string;
  role: "admin" | "vendor" | "client";
  email: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

export interface AuthRequest extends Request {
  user?: CustomUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

console.log("Auth header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // console.log("Verifying token:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    // console.log("Decoded user:", user);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = {
      _id: user._id.toString(), // ✅ FIXED
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
