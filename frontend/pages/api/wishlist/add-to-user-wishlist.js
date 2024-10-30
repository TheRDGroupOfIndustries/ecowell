import { connectToMongoDB } from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
  const { query, method, body } = req;
  const { userId, productId } = body;
  if (method === "POST") {
    try {
      await connectToMongoDB();
      const user = await Wishlist.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }

      // Check if the product is already in the wishlist
      if (!user.wishlist_products.includes(productId)) {
        user.wishlist_products.push(productId);
        await user.save();
        return res.status(200).json({
          message: "Product added to wishlist",
          wishlist: user.wishlist_products,
        });
      } else {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error adding to wishlist", error: error.message });
    }
  }
}
