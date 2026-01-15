import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
    name: string;
    description?: string;
}

const CategorySchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model<CategoryDocument>(
    "Category",
    CategorySchema
);

