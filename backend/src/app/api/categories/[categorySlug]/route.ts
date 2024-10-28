import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Product from "@/models/Products";

// GET: Retrieve all categories
export const GET = async (request: NextRequest, { params }:{
  params: {
      categorySlug: string;
  }
}) => {
  const { categorySlug } = params;
  try {
    await connectToMongoDB();

    const categoryProducts = await Product.find({ "category.slug": categorySlug });

    return NextResponse.json(categoryProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};