// removeFromUser Wishlist.js
import User from "./models/User";

export default async function removeFromUserWishlist(req, res) {
    const { userId, productId } = req.body; // Assuming you send userId and productId in the body

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Remove the product from the wishlist
        user.wishlist_products = user.wishlist_products.filter(id => id.toString() !== productId);
        await user.save();
        return res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist_products });
    } catch (error) {
        return res.status(500).json({ message: "Error removing from wishlist", error: error.message });
    }
}