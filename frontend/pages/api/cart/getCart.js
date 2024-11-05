import { connectToMongoDB } from "../../../utils/db"; // Adjust the import path if necessary
import Cart from "../../../models/Cart"; // Import the Cart model

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { userId } = query; // Get userId from the query parameters

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    await connectToMongoDB(); // Connect to MongoDB

    // Fetch the cart for the user
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "_id title price"
    ); // Populate product details

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    // Return the cart details
    return res.status(200).json({
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Fetching cart error:", error);
    return res.status(500).json({ error: "Failed to fetch cart." });
  }
}
