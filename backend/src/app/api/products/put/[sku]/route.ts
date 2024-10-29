import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";

const generateUniqueSlug = async (slug: string) => {
    let uniqueSlug = slug;
    let slugExists = await Products.findOne({ "category.slug": uniqueSlug });
  
    let counter = 1;
    while (slugExists) {
      uniqueSlug = `${slug}-${counter}`;
      slugExists = await Products.findOne({ "category.slug": uniqueSlug });
      counter++;
    }
  
    return uniqueSlug;
  };
// PUT: Update a product by SKU
export const PUT = async (request: NextRequest, { params }: { params: { sku: string } }) => {
    const { sku } = params;
    try {
      const {
        title,
        description,
        category,
        brand,
        price,
        salePrice,
        discount,
        sell_on_google_quantity,
        isNew,
        variants,
        bestBefore,
        directions,
        ingredients,
        benefits,
        faqs,
        additionalInfo,
      }: {
        title?: string;
        description?: string;
        category?: { title: string; slug: string };
        brand?: string;
        price?: number;
        salePrice?: number;
        discount?: number;
        sell_on_google_quantity?: number;
        isNew?: boolean;
        variants?: [{
          flavor: string;
          images: string[];
          stock: number;
          form: "tablet" | "powder" | "liquid";
          netQuantity: number;
          nutritionFacts: string[];
          allergens?: string[];
          servingSize: string;
        }];
        bestBefore?: Date;
        directions?: string[];
        ingredients?: string[];
        benefits?: string[];
        faqs?: { question: string; answer: string }[];
        additionalInfo?: {
          manufacturedBy: string;
          countryOfOrigin: string;
          phone: string;
          email: string;
        };
      } = await request.json();
  
      await connectToMongoDB();
  
      const product = await Products.findOne({ sku });
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
  
      if (category && category.title !== product.category.title) {
        const slugTemp = generateSlug(category.title);
        const uniqueSlug = await generateUniqueSlug(slugTemp);
        product.category.slug = uniqueSlug;
        product.category.title = category.title;
      }
  
      if (title) product.title = title;
      if (description) product.description = description;
      if (brand) product.brand = brand;
      if (price) product.price = price;
      if (salePrice) product.salePrice = salePrice;
      if (discount) product.discount = discount;
      if (sell_on_google_quantity) product.sell_on_google_quantity = sell_on_google_quantity;
      if (isNew !== undefined) product.new = isNew;
      if (variants) product.variants = variants;
      if (bestBefore) product.bestBefore = bestBefore;
      if (directions) product.directions = directions;
      if (ingredients) product.ingredients = ingredients;
      if (benefits) product.benefits = benefits;
      if (faqs) product.faqs = faqs;
      if (additionalInfo) product.additionalInfo = additionalInfo;
  
      await product.save();
  
      return NextResponse.json(
        { message: "Product updated successfully!", product },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }
  };
  