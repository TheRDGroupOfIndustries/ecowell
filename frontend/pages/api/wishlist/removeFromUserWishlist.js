import connectToMongoDB from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
    await connectToMongoDB();

    if (req.method === 'DELETE') {
        const { userId, productId } = req.body;

        try {
            const wishlist = await Wishlist.findOne({ userId });

            if (!wishlist) {
                return res.status(404).json({ message: "Wishlist not found for this user." });
            }

            // Remove product from wishlist
            wishlist.products = wishlist.products.filter(
                (product) => product.toString() !== productId
            );

            await wishlist.save();
            res.status(200).json({ message: "Product removed from wishlist", wishlist });
        } catch (error) {
            res.status(500).json({ error: "Failed to remove product from wishlist." });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
