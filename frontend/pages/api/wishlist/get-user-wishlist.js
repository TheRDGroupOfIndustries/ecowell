import { connectToMongoDB } from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
  console.log("Connect to mongodb: ", connectToMongoDB);
  const { method, query } = req;
  console.log("wishlist req:", method, query);
  if (method === "GET") {
    try {
      const { userId } = query;

      if (!userId) {
        return res.status(400).json({ message: "userId is required." });
      }

      await connectToMongoDB();

      const wishlist = await Wishlist.findOne({ userId }).populate(
        "products",
        "name price description image"
      );
      if (wishlist) return res.status(200).json(wishlist);

      // return res.status(404).json({ message: "Wishlist not found for this user." });
    } catch (error) {
      console.error("Fetching wishlist error:", error);
      return res.status(500).json({ error: "Failed to fetch wishlist." });
    }
  }
}
