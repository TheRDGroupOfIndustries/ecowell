import { connectToMongoDB } from "../../../utils/db"; // Adjust the import path if necessary
import Cart from "../../../models/Cart"; // Import the Cart model

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const { userId, productId, quantity } = body; // Get data from the request body

    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connectToMongoDB(); // Connect to MongoDB

    // Find the cart for the user
    const cart = await Cart.findOne({ userId }).populate("items.productId", "price");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Recalculate the total quantity and total price
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => {
      const itemPrice = item.productId.price;
      const itemQuantity = item.quantity;
      return total + (isNaN(itemPrice) || isNaN(itemQuantity) ? 0 : itemPrice * itemQuantity);
    }, 0);

    // Save the updated cart
    await cart.save();

    // Return the updated cart details
    return res.status(200).json({
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Updating cart quantity error:", error);
    return res.status(500).json({ error: "Failed to update cart quantity." });
  }
}