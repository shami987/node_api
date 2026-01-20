import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../models/User";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export const uploadProfileImage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploaded = await uploadToCloudinary(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { image: uploaded.secure_url },
      { new: true }
    );

    res.json({
      message: "Profile image updated successfully",
      image: user?.image
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile image upload failed" });
  }
};

// Delete profile image
export const deleteProfileImage = async (
  req: AuthRequest,
  res: Response
) => {
  await User.findByIdAndUpdate(req.user!._id, { image: null });
  res.json({ message: "Profile image removed" });
};