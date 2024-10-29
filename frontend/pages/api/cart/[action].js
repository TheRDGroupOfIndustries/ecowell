import getAllCartItems from "./getAllCartItems";
import addToUserCart from "./addToUserCart";
import removeFromUserCart from "./removeFromUserCart";
import updateCartItemQuantity from "./updateCartItemQuantity";

export default async function handler(req, res) {
    const { method, query: { action } } = req;

    try {
        await connectToMongoDB();

        switch (action) {
            case "getAllCartItems":
                return await getAllCartItems(req, res);
            case "addToUserCart":
                return await addToUserCart(req, res);
            case "removeFromUserCart":
                return await removeFromUserCart(req, res);
            case "updateCartItemQuantity":
                return await updateCartItemQuantity(req, res);
            default:
                res.status(405).json({ message: `Action ${action} is not allowed` });
        }
    } catch (error) {
        console.error("Cart operation error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}