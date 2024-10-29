import { connectToMongoDB } from "../../../utils/db";
import Cart from "../../../models/Cart";
import Product from "../../../models/Products";

export default async function handler(req, res) {
    try {
        await connectToMongoDB();

        const { userId, item, quantity } = req.body;

        if (!userId || !item) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = await Product.findById(item._id);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        let cart = await Cart.findOne({ userId, status: 'active' });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            cartItem => cartItem.product.toString() === item._id
        );

        const price = product.sale ?
            product.price * (1 - product.discount / 100) :
            product.price;

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].price = price;
        } else {
            cart.items.push({
                product: item._id,
                quantity,
                price
            });
        }

        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'title price sale discount stock images'
        });

        const transformedItems = cart.items.map(cartItem => ({
            id: cartItem._id,
            product: cartItem.product,
            quantity: cartItem.quantity,
            price: cartItem.price,
            total: cartItem.price * cartItem.quantity,
            stock: cartItem.product.stock
        }));

        return res.status(200).json({
            message: "Item added to cart successfully",
            items: transformedItems,
            total: cart.total
        });
    } catch (error) {
        console.error("Cart operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}