import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartItemDocument extends Types.Subdocument {
  product: Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: string;
  items: Types.DocumentArray<CartItemDocument>;
  createdAt?: Date;
  updatedAt?: Date;
}

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: true }
);

const CartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    items: [CartItemSchema]
  },
  { timestamps: true }
);

export const Cart = mongoose.model<CartDocument>("Cart", CartSchema);
