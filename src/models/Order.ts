import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = // Define possible order statuses
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem { // Define the structure of an order item
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDocument extends Document { // Define the Order document interface
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}

const OrderItemSchema = new Schema( // Define the OrderItem schema
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    quantity: Number
  },
  { _id: false }
);

const OrderSchema = new Schema( // Define the Order schema
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>("Order", OrderSchema); // Export the Order model
