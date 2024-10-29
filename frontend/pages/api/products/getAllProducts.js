import connectToMongoDB from "../../../utils/db";
import Product from "../../../models/Products";

export default async function handler(req, res) {
    await connectToMongoDB(); // Connect to MongoDB

    if (req.method === 'GET') {
        try {
            // Fetch all products from the database
            const products = await Product.find({});
            res.status(200).json(products);
        } catch (error) {
            // Handle any errors during the fetching process
            res.status(500).json({ error: "Failed to retrieve products." });
        }
    } else {
        // Respond with 405 Method Not Allowed for other methods
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
