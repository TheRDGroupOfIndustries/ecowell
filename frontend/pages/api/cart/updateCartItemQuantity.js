import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import Product from "../../../models/Products";

export default async function handler(req, res) {
    try {
        await connectToMongoDB();

        const { userId, itemId, quantity } = req.body;

        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const cart = await Cart.findOne({ userId, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const product = await Product.findById(cart.items[itemIndex].product);
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'title price sale discount stock images'
        });

        const transformedItems = cart.items.map(item => ({
            id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            stock: item.product.stock
        }));

        return res.status(200).json({
            message: "Cart updated successfully",
            items: transformedItems,
            total: cart.total
        });
    } catch (error) {
        console.error("Cart operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}