import { connectToMongoDB } from "../../../../utils/db";
import Product from "../../../../models/Products";

export default async function handler(req, res) {
    const { method, query } = req;
    console.log("Query: ", query);

    if (method !== "GET") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    try {
        const { productSku } = query;

        if (!productSku) {
            return res.status(400).json({ message: "productSku is required." });
        }

        await connectToMongoDB();

        // Fetch the product details by SKU
        const product = await Product.findOne({ sku: productSku });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Return the product details
        return res.status(200).json({
            success: true,
            product: product
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