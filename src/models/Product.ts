import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document { // Define the Product document interface
  name: string;
  price: number;
  description?: string;
  category: mongoose.Types.ObjectId;
  inStock: boolean;
  quantity: number; 
}

const ProductSchema: Schema = new Schema( // Define the Product schema
    {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    inStock: {
      type: Boolean,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model<ProductDocument>( // Export the Product model
    "Product",
    ProductSchema
)
