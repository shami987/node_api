// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: string;
}
console.log(process.env.JWT_SECRET);

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  //  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

    const token = authHeader.split(" ")[1];
  // console.log("token  s.,....",token);
  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
// console.log("decoded id:", decoded.id); 
    req.user = { id: decoded.id }; // ✅ FIX
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid", error });
  }
};
