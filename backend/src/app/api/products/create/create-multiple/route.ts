import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Products from "@/models/Products";
import { generateSlug } from "@/lib/utils";

const generateSequentialSku = async () => {
  const productCount = await Products.countDocuments();
  const skuNumber = (productCount + 1).toString().padStart(8, "0");
  return skuNumber;
};

const validateProductData = (product: any) => {
  const requiredFields = {
    title: "Title",
    description: "Description",
    category: {
      title: "Category Title",
      slug: "Category Slug",
    },
    brand: "Brand",
    price: "Price",
    salePrice: "Sale Price",
    variants: [
      {
        flavor: "Variant Flavor",
        images: "Variant Images",
        stock: "Variant Stock",
        form: "Variant Form",
        netQuantity: "Net Quantity",
        nutritionFacts: "Nutrition Facts",
        servingSize: "Serving Size",
      },
    ],
    bestBefore: "Best Before Date",
    directions: "Directions",
    ingredients: "Ingredients",
    benefits: "Benefits",
    additionalInfo: {
      manufacturedBy: "Manufacturer",
      countryOfOrigin: "Country of Origin",
      phone: "Phone",
      email: "Email",
    },
  };

  const missingFields = [];

  // Validate top-level fields
  for (const [key, value] of Object.entries(requiredFields)) {
    if (key === "category") {
      if (!product.category?.title) missingFields.push("Category Title");
      if (!product.category?.slug) missingFields.push("Category Slug");
    } else if (key === "additionalInfo") {
      if (!product.additionalInfo?.manufacturedBy) missingFields.push("Manufacturer");
      if (!product.additionalInfo?.countryOfOrigin) missingFields.push("Country of Origin");
      if (!product.additionalInfo?.phone) missingFields.push("Phone");
      if (!product.additionalInfo?.email) missingFields.push("Email");
    } else if (key === "variants") {
      if (!Array.isArray(product.variants) || product.variants.length === 0) {
        missingFields.push("Variants");
      } else {
        product.variants.forEach((variant: any, index: number) => {
          if (!variant.flavor) missingFields.push(`Variant ${index + 1} Flavor`);
          if (!Array.isArray(variant.images) || variant.images.length === 0)
            missingFields.push(`Variant ${index + 1} Images`);
          if (typeof variant.stock !== "number")
            missingFields.push(`Variant ${index + 1} Stock`);
          if (!variant.form) missingFields.push(`Variant ${index + 1} Form`);
          if (!variant.netQuantity) missingFields.push(`Variant ${index + 1} Net Quantity`);
          if (!Array.isArray(variant.nutritionFacts) || variant.nutritionFacts.length === 0)
            missingFields.push(`Variant ${index + 1} Nutrition Facts`);
          if (!variant.servingSize) missingFields.push(`Variant ${index + 1} Serving Size`);
        });
      }
    } else if (!product[key]) {
      missingFields.push(value);
    }
  }

  return missingFields;
};

export const POST = async (request: NextRequest) => {
  try {
    const products = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Invalid input: Expected an array of products" },
        { status: 400 }
      );
    }

    await connectToMongoDB();
    // Replace this part in the POST function:
    const savedProducts = [];
    const errors = [];

    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      // Validate product data
      const missingFields = validateProductData(product);
      if (missingFields.length > 0) {
        errors.push({
          productIndex: index,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
        continue;
      }

      try {
        const sku = await generateSequentialSku();
        let sell_on_google_quantity = 0;
        product.variants.forEach((variant: any) => {
          sell_on_google_quantity += Number(variant.stock);
        });

        const newProduct = new Products({
          sku,
          title: product.title,
          description: product.description,
          category: {
            title: product.category.title,
            slug: product.category.slug,
          },
          brand: product.brand,
          price: product.price,
          salePrice: product.salePrice,
          discount: product.discount,
          sell_on_google_quantity,
          new: product.isNew || false,
          variants: product.variants,
          bestBefore: product.bestBefore,
          directions: product.directions,
          ingredients: product.ingredients,
          benefits: product.benefits,
          faqs: product.faqs || [],
          additionalInfo: {
            manufacturedBy: product.additionalInfo.manufacturedBy,
            countryOfOrigin: product.additionalInfo.countryOfOrigin,
            phone: product.additionalInfo.phone,
            email: product.additionalInfo.email,
          },
          ratings: 0,
          reviews_number: 0,
        });

        const savedProduct = await newProduct.save();
        savedProducts.push(savedProduct);
      } catch (error: any) {
        errors.push({
          productIndex: index,
          error: error.message || "Failed to save product",
        });
      }
    }

    if (errors.length > 0) {
      console.log(errors);
      return NextResponse.json({
        message: "Some products failed to save",
        savedProducts,
        errors,
      }, { status: 404 }); // 207 Multi-Status
    }

    return NextResponse.json(
      {
        message: `${savedProducts.length} products created successfully!`,
        products: savedProducts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create products" },
      { status: 500 }
    );
  }
};