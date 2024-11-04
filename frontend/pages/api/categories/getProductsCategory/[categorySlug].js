import { connectToMongoDB } from "../../../../utils/db";
import Product from "../../../../models/Products";

export default async function handler(req, res) {
    const { method, query } = req;

    if (method !== "GET") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    try {
        const { categorySlug } = query;
      console.log("Category Slug provided: ",categorySlug)
        if (!categorySlug) {
            return res.status(400).json({ message: "categorySlug is required." });
        }

        await connectToMongoDB();

        // Fetch the products in the category
        const categoryProducts = await Product.find({ "category.slug": categorySlug });

        if (!categoryProducts || categoryProducts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in this category."
            });
        }

        // Return the products in the category
        return res.status(200).json({
            success: true,
            products: categoryProducts
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}