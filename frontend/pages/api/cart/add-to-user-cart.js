import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    try {
      const { userId, item } = req.body;

      if (!userId || !item) {
        return res.status(400).json({ message: "userId and item are required." });
      }

      await connectToMongoDB();

      let cart = await Cart.findOne({ userId });

      // If the cart doesn't exist, create a new one
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Check if the item already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItemIndex > -1) {
        // If item exists, update quantity and total
        cart.items[existingItemIndex].quantity += item.quantity;
        cart.items[existingItemIndex].total =
          cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
      } else {
        // If item does not exist, add it to the cart
        cart.items.push({
          image: item.image,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.quantity * item.price,
        });
      }

      // Save the updated cart
      await cart.save();

      return res.status(200).json(cart);
    } catch (error) {
      console.error("Adding to cart error:", error);
      return res.status(500).json({ error: "Failed to add item to cart." });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}
