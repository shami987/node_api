import mongoose, { Schema, Document } from "mongoose";

export interface ProductDocument extends Document { // Define the Product document interface
  name: string;
  price: number;
  description?: string;
  category: mongoose.Types.ObjectId;
  inStock: boolean;
  quantity: number; 
  image?: string;   
  createdBy: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema( // Define the Product schema
    {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
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
      required: true,
      index: true
    },
    inStock: {
      type: Boolean,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
   // ✅ ADD THIS
    image: {
      type: String
    },
    
    // ✅ OWNER
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Create text index for search functionality
ProductSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 5, description: 1 } }
);

// ✅ Add category and price indexes here ProductSchema.index({ category: 1 }); ProductSchema.index({ price: 1 });

export const Product = mongoose.model<ProductDocument>( // Export the Product model
    "Product",
    ProductSchema
)
