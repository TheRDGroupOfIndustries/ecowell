import { connectToMongoDB } from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
  const { query, method, body } = req;
  const { userId, productId } = body;

  // console.log("add wishlist Ids:", userId, productId);

  if (method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  try {
    await connectToMongoDB();
    let user = await Wishlist.findOne({ userId });

    if (!user) {
      user = new Wishlist({ userId, products: [productId] });
      await user.save();
      const wishlist = await Wishlist.findOne({ userId }).populate(
        "products",
        "_id sku title price description images"
      );
      return res.status(200).json({
        message: "Product added to wishlist",
        wishlist: wishlist.products,
      });
    }

    if (!user.products.includes(productId)) {
      const updatedProducts = [...user.products, productId];
      user.products = updatedProducts;
      await user.save();
      const wishlist = await Wishlist.findOne({ userId }).populate(
        "products",
        "_id sku title price description images"
      );
      return res.status(200).json({
        message: "Product added to wishlist",
        wishlist: wishlist.products,
      });
    } else {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res
      .status(500)
      .json({ message: "Error adding to wishlist", error: error.message });
  }
}
