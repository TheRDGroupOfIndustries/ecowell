import { Schema, model, models, Document, Types } from "mongoose";

interface Product {
  product_id: Types.ObjectId;
  variant_flavor: string;
  quantity: number;
}

interface OrderInfo {
  order_id: string;
  total_price: number;
  order_date: Date;
  delivery_date?: Date;
  shipping_date?: Date;
  cancelled_date?: Date;
  phone_number: string;
  shipping_address: string;
  zip_code: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

interface OrderDetails {
  order_info: OrderInfo;
  products: Product[];
}

export interface Order extends Document {
  user_id: Types.ObjectId;
  orders: OrderDetails[];
}

const productSchema = new Schema<Product>({
  product_id: { type: Schema.Types.ObjectId, ref: "Products" },
  variant_flavor: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderInfoSchema = new Schema<OrderInfo>({
  order_id: { type: String, required: true },
  total_price: { type: Number, required: true },
  order_date: { type: Date, required: true },
  delivery_date: { type: Date },
  shipping_date: { type: Date },
  cancelled_date: { type: Date },
  phone_number: { type: String, required: true },
  shipping_address: { type: String, required: true },
  zip_code: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
});

const orderDetailsSchema = new Schema<OrderDetails>({
  order_info: orderInfoSchema,
  products: [productSchema],
});

const orderSchema = new Schema<Order>({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  orders: [orderDetailsSchema],
});

export default models.Order || model<Order>("Order", orderSchema);
