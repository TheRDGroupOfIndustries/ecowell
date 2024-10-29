import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
    try {
        await connectToMongoDB();

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const cart = await Cart.findOne({ userId, status: 'active' })
            .populate({
                path: 'items.product',
                select: 'title price sale discount stock images'
            });

        if (!cart) {
            return res.status(200).json({ items: [], total: 0 });
        }

        const transformedItems = cart.items.map(item => ({
            id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            stock: item.product.stock
        }));

        return res.status(200).json({
            items: transformedItems,
            total: cart.total
        });
    } catch (error) {
        console.log("Cart operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}