import { connectToMongoDB } from "../../../../utils/db";
import Product from "../../../../models/Products";

export default async function handler(req, res) {
    const { method, query: { productId } } = req;

    if (method !== "GET") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    try {
        if (!productId) {
            return res.status(400).json({ message: "productId is required." });
        }

        await connectToMongoDB();

        // Fetch the product details
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Return the product details
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Fetching product error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product details.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
