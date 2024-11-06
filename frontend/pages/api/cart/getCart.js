import { connectToMongoDB } from "../../../utils/db"; // Adjust the import path if necessary
import Cart from "../../../models/Cart"; // Import the Cart model
import Product from "../../../models/Products"; // Import the Product model

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
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "_id title price variants",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    // Update the variant stock in the cart items
    cart.items.forEach((item) => {
      const productVariant = item.productId.variants.find(
        (variant) => variant.flavor === item.variant.flavor
      );
      if (productVariant) {
        item.variant.stock = productVariant.stock;
      }
    });

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
