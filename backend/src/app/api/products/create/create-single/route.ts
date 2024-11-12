import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";

// const generateUniqueSlug = async (slug: string) => {
//   let uniqueSlug = slug;
//   let slugExists = await Products.findOne({ "category.slug": uniqueSlug });

//   let counter = 1;
//   while (slugExists) {
//     uniqueSlug = `${slug}-${counter}`;
//     slugExists = await Products.findOne({ "category.slug": uniqueSlug });
//     counter++;
//   }

//   return uniqueSlug;
// };

// Generate a simple 8-digit SKU based on the product count in the database
const generateSequentialSku = async () => {
  const productCount = await Products.countDocuments(); // Get the count of all products
  const skuNumber = (productCount + 1).toString().padStart(8, "0"); // Increment and pad to 8 digits
  return skuNumber;
};

export const POST = async (request: NextRequest) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      discount,
      isNew,
      variants,
      bestBefore,
      directions,
      ingredients,
      benefits,
      faqs,
      additionalInfo,
    }: {
      title: string;
      description: string;
      category: { title: string; slug: string };
      brand: string;
      price: number;
      salePrice: number;
      discount?: number;
      isNew?: boolean;
      variants: [{
        flavor: string;
        images: string[];
        stock: number;
        form: "tablet" | "powder" | "liquid";
        netQuantity: string;
        nutritionFacts: string[];
        allergens?: string[];
        servingSize: string;
      }];
      bestBefore: Date;
      directions: string[];
      ingredients: string[];
      benefits: string[];
      faqs: { question: string; answer: string }[];
      additionalInfo: {
        manufacturedBy: string;
        countryOfOrigin: string;
        phone: string;
        email: string;
      };
    } = await request.json();

    await connectToMongoDB();

    const slug = generateSlug(category.title);
    // const uniqueSlug = await generateUniqueSlug(slug);

    const sku = await generateSequentialSku(); // Use the sequential SKU
let sell_on_google_quantity = 0;
variants.map((variant) => {
  sell_on_google_quantity += Number(variant.stock);
} );
    const newProduct = new Products({
      sku,
      title,
      description,
      category: {
        title: category.title,
        slug: category.slug
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

    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        message: `${savedProduct.title} product created successfully!`,
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
};
