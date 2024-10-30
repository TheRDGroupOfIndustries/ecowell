import connectToMongoDB from "./connectToMongoDB"; // Make sure to import your MongoDB connection function
import User from "./models/User"; // Import the User model

// Import your specific actions
import getUserWishlist from "./getUserWishlist"; // Function to get user's wishlist
import addToUserWishlist from "./addToUserWishlist"; // Function to add item to wishlist
import removeFromUserWishlist from "./removeFromUserWishlist"; // Function to remove item from wishlist

export default async function handler(req, res) {
    const { method, query: { action } } = req;

    try {
        await connectToMongoDB();

        switch (action) {
            case "getWishlist":
                return await getUserWishlist(req, res);
            case "addToWishlist":
                return await addToUserWishlist(req, res);
            case "removeFromWishlist":
                return await removeFromUserWishlist(req, res);
            default:
                res.status(405).json({ message: `Action ${action} is not allowed` });
        }
    } catch (error) {
        console.error("Wishlist operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}