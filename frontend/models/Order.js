import { Schema, model, models } from "mongoose";

const productSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Products" },
  variant_flavor: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderInfoSchema = new Schema({
  order_id: { type: String, required: true },
  payment_method: {
    type: String,
    required: true,
    enum: ["online", "cash-on-delivery"],
  },
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

const orderDetailsSchema = new Schema({
  order_info: orderInfoSchema,
  products: [productSchema],
});

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  user_name: { type: String, required: true },
  orders: [orderDetailsSchema],
});

module.exports = models.Orders || model("Orders", orderSchema);
