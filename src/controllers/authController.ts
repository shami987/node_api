import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import jwt, { SignOptions } from "jsonwebtoken";
import { AuthRequest } from "../middlewares/authMiddleware";
import crypto from "crypto";
import {sendEmail} from "../utils/sendEmail";

const generateToken = (user: any) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET || "default_secret",
    options
  );
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

  //send welcome email
  await sendEmail({
    to: user.email,
    subject: "Welcome to Our App!",
    html: `<h1>Hello ${user.name},</h1><p>Thank you for registering at our app.</p>`
  });

  res.status(201).json({
    message: "User registered successfully",
    token: generateToken(user),
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
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

// Get profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?._id).select("-password");

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

  const user = await User.findById(req.user?._id);
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
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔐 Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // ⏱ Token expires in 10 minutes
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  // 🔗 Reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // 📧 Send reset email
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });
  } catch (error) {
    // rollback token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(500).json({
      message: "Email could not be sent"
    });
  }

  res.json({ message: "Password reset link sent to email" });
};


// Reset password using token from email
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  // Hash the token exactly like when generating it
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Send confirmation email
  await sendEmail({
    to: user.email,
    subject: "Password Changed Successfully",
    html: `
      <p>Your password was changed successfully.</p>
      <p>If this was not you, contact support immediately.</p>
    `,
  });

  res.json({ message: "Password reset successful" });
};

