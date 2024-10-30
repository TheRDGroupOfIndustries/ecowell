import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { method, query } = req;
  // console.log("wishlist req:", method, query);

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { userId } = query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    await connectToMongoDB();

    const cart = await Cart.find({ userId })

    console.log("cart:", cart);
    if (cart) return res.status(200).json(cart.products);

    // return res.status(404).json({ message: "Wishlist not found for this user." });
  } catch (error) {
    console.error("Fetching wishlist error:", error);
    return res.status(500).json({ error: "Failed to fetch wishlist." });
  }
}
