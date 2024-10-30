import {connectToMongoDB} from "../../../utils/db";
import Wishlist from "../../../models/Wishlist";

export default async function handler(req, res) {
    console.log("Connect to mongodb: ", connectToMongoDB);
    try {
        await connectToMongoDB();

        if (req.method === 'GET') {
            const { userId } = req.query; // Assuming userId is passed as a query parameter

            if(!userId) {
                return res.status(400).json({ message: "userId is required." });
            }
            try {
                const wishlist = await Wishlist.findOne({ userId }).populate("products", "name price description image"); // Customize fields as needed

                if (!wishlist) {
                    return res.status(404).json({ message: "Wishlist not found for this user." });
                }

                res.status(200).json(wishlist);
            } catch (error) {
                console.error('Error retrieving wishlist:', error);
                res.status(500).json({ error: "Failed to retrieve wishlist." });
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