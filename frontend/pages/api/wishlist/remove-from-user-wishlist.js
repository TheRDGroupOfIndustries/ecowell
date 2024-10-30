import { connectToMongoDB } from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
  const { query, method, body } = req;
  if (method === "DELETE") {
    const { userId, productId } = body;

    try {
      await connectToMongoDB();
      const user = await Wishlist.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }

      // Remove the product from the wishlist
      user.wishlist_products = user.wishlist_products.filter(
        (id) => id.toString() !== productId
      );
      await user.save();
      return res.status(200).json({
        message: "Product removed from wishlist",
        wishlist: user.wishlist_products,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error removing from wishlist",
        error: error.message,
      });
    }
  }
}
