// addToUser Wishlist.js
import User from "./models/User";

export default async function addToUserWishlist(req, res) {
    const { userId, productId } = req.body; // Assuming you send userId and productId in the body

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Check if the product is already in the wishlist
        if (!user.wishlist_products.includes(productId)) {
            user.wishlist_products.push(productId);
            await user.save();
            return res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist_products });
        } else {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error adding to wishlist", error: error.message });
    }
}