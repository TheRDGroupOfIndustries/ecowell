import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";

const generateSequentialSkus = async (numberOfProducts: number) => {
  const productCount = await Products.countDocuments(); // Get current product count
  const skus = [];

  for (let i = 0; i < numberOfProducts; i++) {
    const sku = (productCount + i + 1).toString().padStart(8, "0"); // Increment and pad to 8 digits
    skus.push(sku);
  }

  return skus;
};

export const POST = async (request: NextRequest) => {
  try {
    const products = await request.json(); // Expecting an array of product objects

    await connectToMongoDB();

    const skus = await generateSequentialSkus(products.length); // Generate SKUs based on product count

    const newProducts = products.map((product:any, index:any) => {
      const { title, description, category, brand, price, salePrice, discount, isNew, variants, bestBefore, directions, ingredients, benefits, faqs, additionalInfo } = product;

      let sell_on_google_quantity = 0; // Default value
      variants.map((variant:any) => {
        sell_on_google_quantity += Number(variant.stock);
      });
      const slug = generateSlug(category.title);
      return new Products({
        sku: skus[index],
        title,
        description,
        category: {
          title: category.title,
          slug: `${slug}-${skus[index]}`, // Add SKU to the slug to ensure uniqueness
        },
        brand,
        price,
        salePrice,
        discount,
        sell_on_google_quantity,
        new: isNew,
        variants,
        bestBefore,
        directions,
        ingredients,
        benefits,
        faqs,
        additionalInfo,
        ratings: 0, // Default value
        reviews_number: 0, // Default value
      });
    });

    const savedProducts = await Products.insertMany(newProducts); // Save all products at once

    return NextResponse.json(
      {
        message: `${savedProducts.length} products created successfully!`,
        products: savedProducts,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    );
  }
};
