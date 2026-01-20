import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "vendor" | "client";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    resetPasswordToken?: string; // optional because not always set 
    resetPasswordExpire?: Date; // optional because not always set
    image?: string; // optional profile image
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true}, 
        password: { type: String, required: true},
        role: { type: String, enum: ["admin", "vendor", "client"], default: "client"},

        // 🔑 Forgot password fields
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date },
        image: { type: String } // profile image URL
    },
    { timestamps: true }
  
);

export const User = mongoose.model<IUser>("User", userSchema); 
