import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { User } from "../models/User";
import jwt, { SignOptions } from "jsonwebtoken";
import { AuthRequest } from "../middlewares/authMiddleware";
import crypto from "crypto";

const generateToken = (id: string) => {
  console.log("JWT SECRET USED TO SIGN:", process.env.JWT_SECRET)
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", options);
};




// REGISTER
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user._id.toString()),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    token: generateToken(user._id.toString()),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

// Get profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

//Logout
export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Logged out successfully" });
};

//Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password incorrect" });
  }

  user.password = newPassword; // auto-hashed if model middleware exists
  await user.save();

  res.json({ message: "Password changed successfully" });
};

//Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  console.log(
    `Reset password: http://localhost:3000/api/auth/reset-password/${resetToken}`
  );

  res.json({ message: "Reset link sent" });
};