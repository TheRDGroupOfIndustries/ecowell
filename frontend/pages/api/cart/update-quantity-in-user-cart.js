import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
    const { method } = req;

    if (method === "PATCH") {
        try {
            const { userId, itemId, newQuantity } = req.body;

            if (!userId || !itemId || newQuantity === undefined) {
                return res.status(400).json({ message: "userId, itemId, and newQuantity are required." });
            }

            await connectToMongoDB();

            // Find the user's cart
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found for this user." });
            }

            // Find the item in the cart
            const item = cart.items.find((item) => item._id.toString() === itemId);

            if (!item) {
                return res.status(404).json({ message: "Item not found in cart." });
            }

            // Update the quantity and total
            item.quantity = newQuantity;
            item.total = item.quantity * item.price;

            // Save the updated cart
            await cart.save();

            return res.status(200).json({ message: "Item quantity updated.", cart });
        } catch (error) {
            console.error("Updating quantity error:", error);
            return res.status(500).json({ error: "Failed to update item quantity." });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed." });
    }
}
