import connectToMongoDB from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
    await connectToMongoDB();

    if (req.method === 'POST') {
        const { userId, productId } = req.body;

        try {
            let wishlist = await Wishlist.findOne({ userId });

            // If no wishlist exists, create a new one for the user
            if (!wishlist) {
                wishlist = new Wishlist({ userId, products: [] });
            }

            // Check if product is already in the wishlist
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
            } else {
                return res.status(400).json({ message: "Product already in wishlist." });
            }

            await wishlist.save();
            res.status(200).json({ message: "Product added to wishlist", wishlist });
        } catch (error) {
            res.status(500).json({ error: "Failed to add product to wishlist." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
