import mongoose from "mongoose";

// Assuming User schema is defined elsewhere and imported
// import User from './User '; // Uncomment this line if you have a User schema

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }, // Minimum quantity of 1
    variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" } // Optional, if the product has variants
}, { _id: false }); // We don't need an _id for items in the cart

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true, unique: true },
    items: [CartItemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

// Check if the model is already defined to avoid OverwriteModelError
const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;