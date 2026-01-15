import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    resetPasswordToken?: string; // optional because not always set 
    resetPasswordExpire?: Date; // optional because not always set
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true}, 
        password: { type: String, required: true},

        // 🔑 Forgot password fields
        resetPasswordToken: { type: String },
        resetPasswordExpire: { type: Date }
    },
    { timestamps: true }
  
);

export const User = mongoose.model<IUser>("USER", userSchema); 