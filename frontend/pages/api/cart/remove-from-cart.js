import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method, body } = req;
  //   console.log("body:", body);

  if (method !== "DELETE") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  const { userId, productId } = body;

  try {
    await connectToMongoDB();

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "User cart not found" });
    }

    // Debugging: Log the initial state of the cart
    console.log("Initial cart items:", cart.items);

    cart.items = cart.items.filter(
      (item) =>
        !item.productId.equals(
          new mongoose.Types.ObjectId(productId.toString())
        )
    );

    // Debugging: Log the state of the cart after filtering
    console.log("Filtered cart items:", cart.items);

    // Ensure totalQuantity is updated correctly
    cart.totalQuantity =
      cart.items.length > 0
        ? cart.items.reduce((total, item) => total + item.quantity, 0)
        : 0;

    // Debugging: Log the total quantity
    console.log("Total quantity after update:", cart.totalQuantity);

    try {
      const updatedCartSave = await cart.save();
      console.log("updatedCartSave:", updatedCartSave.items);
    } catch (saveError) {
      console.error("Error saving cart:", saveError);
      return res
        .status(500)
        .json({ message: "Error saving cart", error: saveError.message });
    }

    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "_id title price"
    );
    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
}
