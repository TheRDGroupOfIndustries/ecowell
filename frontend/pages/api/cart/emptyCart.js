import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId } = body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  try {
    await connectToMongoDB(); // Connect to MongoDB

    // Find the cart for the user and empty it
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalQuantity: 0, totalPrice: 0 } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    // Return the updated cart details
    return res.status(200).json({
      message: "Cart emptied successfully",
      cart,
    });
  } catch (error) {
    console.error("Error emptying cart:", error);
    return res.status(500).json({ message: "Failed to empty cart", error: error.message });
  }
}