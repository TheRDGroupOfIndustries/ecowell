import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "DELETE") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  const { userId, productId } = body;

  try {
    await connectToMongoDB();

    // Convert productId to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);
    console.log("productObjectId:", productObjectId);
    // Use $pull to remove the item with the matching productId
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: productObjectId } } },
      { new: true }
    ).populate("items.productId", "_id title price salePrice variants sku");
    console.log("cart:", cart);
    if (!cart) {
      return res.status(404).json({ message: "User cart not found" });
    }

    // Ensure totalQuantity is updated correctly
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

    // Ensure totalPrice is updated correctly
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * (item.productId.salePrice ? item.productId.salePrice : item.productId.price),
      0
    );

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
}