import { connectToMongoDB } from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
  const { query, method, body } = req;

  if (method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const { userId, productId } = body;
  // console.log("remove wishlist Ids:", userId, productId);

  try {
    await connectToMongoDB();
    const user = await Wishlist.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.products = user.products.filter((id) => id.toString() !== productId);
    await user.save();

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products",
      "_id sku title price description image_link variants"
    );

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: wishlist.products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
}
