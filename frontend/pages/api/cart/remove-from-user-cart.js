import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "DELETE") {
    try {
      const { userId, itemId } = req.query;

      if (!userId || !itemId) {
        return res.status(400).json({ message: "userId and itemId are required." });
      }

      await connectToMongoDB();

      // Find the user's cart
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found for this user." });
      }

      // Find the item index in the cart
      const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart." });
      }

      // Remove the item from the cart
      cart.items.splice(itemIndex, 1);

      // Save the updated cart
      await cart.save();

      return res.status(200).json({ message: "Item removed from cart.", cart });
    } catch (error) {
      console.error("Removing from cart error:", error);
      return res.status(500).json({ error: "Failed to remove item from cart." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
