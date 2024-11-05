import { Schema, model, models } from "mongoose";

const VariantSchema = new Schema({
  flavor: { type: String, required: true },
  image_link: { type: String, required: true },
  stock: { type: Number, required: true },
});

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  variant: VariantSchema,
});

const CartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User ",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Check if the model is already defined to avoid OverwriteModelError
const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
