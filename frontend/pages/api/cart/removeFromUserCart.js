import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
    try {
        await connectToMongoDB();

        const { userId, id } = req.body;

        if (!userId || !id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const cart = await Cart.findOne({ userId, status: 'active' });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== id);
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
            message: "Item removed from cart successfully",
            items: transformedItems,
            total: cart.total
        });
    } catch (error) {
        console.error("Cart operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}