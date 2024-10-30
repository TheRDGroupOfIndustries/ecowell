import connectToMongoDB from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
    try {
        await connectToMongoDB();

        if (req.method === 'GET') {
            const { userId } = req.query;

            try {
                const user = await User.findById(userId)
                    .populate('wishlist_products', 'name price description image'); // Customize fields as needed

                if (!user) {
                    return res.status(404).json({ message: "User not found." });
                }

                // Return only the wishlist products array
                res.status(200).json({
                    wishlist_products: user.wishlist_products || []
                });
            } catch (error) {
                console.error('Error retrieving wishlist products:', error);
                res.status(500).json({ error: "Failed to retrieve wishlist products." });
            }
        } else {
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: "Failed to connect to MongoDB." });
    }
}