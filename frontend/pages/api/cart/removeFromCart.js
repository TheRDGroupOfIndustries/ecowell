import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import Product from '../../../models/Products';

export default async function handler(req, res) {
    const { method, body } = req;
    const { userId, productId } = body; // Expecting userId and productId in the request body

    if (method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
    }

    try {
        await connectToMongoDB();

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the item index in the cart
        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Recalculate cart totals
        cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        cart.totalPrice = await calculateTotalPrice(cart.items);

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        return res.status(200).json({
            success: true,
            message: "Product removed from cart successfully",
            cart: {
                items: cart.items,
                totalQuantity: cart.totalQuantity,
                totalPrice: cart.totalPrice
            }
        });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({
            success: false,
            message: "Error removing product from cart",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Helper function to calculate total price
const calculateTotalPrice = async (items) => {
    if (items.length === 0) return 0;

    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    return items.reduce((total, item) => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        return total + (product ? (product.salePrice ? product.salePrice : product.price) * item.quantity : 0);
    }, 0);
};