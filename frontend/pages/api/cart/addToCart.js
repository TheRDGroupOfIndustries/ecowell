import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import Product from "../../../models/Products";

export default async function handler(req, res) {
  const { method, body } = req;
  console.log("body:", body);

  if (method !== "POST") {
    return res.status(400).json({ message: "Invalid request method" });
  }

  const { userId, productId, quantity, variant } = body;

  console.log("variant:", variant);

  try {
    await connectToMongoDB();

    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    // If no cart exists for the user, create a new one
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity, variant }],
        totalQuantity: quantity,
        totalPrice: 0, // This will be calculated later
      });
    } else {
      // Check if the product already exists in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Product exists, update the quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Product does not exist, add to cart
        cart.items.push({ product: productId, quantity, variant });
      }
    }

    // Calculate total quantity and total price
    cart.totalQuantity = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cart.totalPrice = await calculateTotalPrice(cart.items); // Call the function to calculate total price

    await cart.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
}

// Helper function to calculate total price
const calculateTotalPrice = async (items) => {
  const productIds = items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }); // Fetch product details from the database

  let total = 0;
  items.forEach((item) => {
    const product = products.find(
      (p) => p._id.toString() === item.product.toString()
    );
    if (product) {
      total += product.price * item.quantity; // Assuming product has a price field
    }
  });

  return total;
};
