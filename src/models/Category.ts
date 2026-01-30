import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
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
    image: {
      type: String,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<CategoryDocument>("Category", CategorySchema);
