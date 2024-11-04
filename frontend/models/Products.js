// import { Schema, model, Types } from 'mongoose';

// const VariantSchema = new Schema({
//   flavor: { type: String, required: true },
//   images: { type: [String], required: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, required: true },
//   form: { type: String, enum: ['tablet', 'powder', 'liquid'], required: true },
//   netQuantity: { type: Number, required: true },
//   nutritionFacts: { type: [String], required: true }, // E.g., ["Calories: 150", "Protein: 30g"]
//   allergens: { type: [String], required: false }, // E.g., ["Peanuts", "Soy"]
//   servingSize: { type: String, required: true }, // E.g., "30g scoop"
// });

// const FaqSchema = new Schema({
//   question: { type: String, required: true },
//   answer: { type: String, required: true },
// });

// const AdditionalInfoSchema = new Schema({
//   manufacturedBy: { type: String, required: true },
//   countryOfOrigin: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true },
// });

// const ProductSchema = new Schema({
//   _id: { type: String, required: true }, // Unique identifier for the product
//   sku: { type: String, required: true }, // Stock Keeping Unit identifier
//   title: { type: String, required: true }, // Title of the product
//   description: { type: String, required: true }, // Description of the product
//   category: { 
//     title: { type: String, required: true }, 
//     slug: { type: String, required: true } 
//   }, // Category of the product
//   brand: { type: String, required: true }, // Brand of the product
//   price: { type: Number, required: true }, // Price of the product
//   salePrice: { type: Number, required: true }, // Sale price
//   discount: { type: Number, required: false }, // Discount details for the product
//   sell_on_google_quantity: { type: Number, required: true }, // Quantity available for Google Shopping
//   new: { type: Boolean, default: false }, // Indicates if the product is new
//   variants: [VariantSchema], // Array of variants
//   bestBefore: { type: Date, required: true }, // Best before date
//   directions: { type: [String], required: true }, // Directions for use
//   ingredients: { type: [String], required: true }, // Ingredients list
//   benefits: { type: [String], required: true }, // List of product benefits
//   faqs: [FaqSchema], // List of FAQs (Question/Answer)
//   additionalInfo: AdditionalInfoSchema, // Additional Information about the product
//   ratings: { type: Number, default: 0 }, // Average product rating
//   reviews_number: { type: Number, default: 0 }, // Number of reviews
// }, { timestamps: true });

// const Product = model('Product', ProductSchema);

// export default Product;







import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  sku: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  image_id: { type: String }
});

const ImageSchema = new mongoose.Schema({
  image_id: { type: String, required: true },
  id: { type: String, required: true },
  alt: { type: String },
  src: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Electronics", "Apparel", "Beauty", "Furniture"], required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  new: { type: Boolean, default: false },
  stock: { type: Number, required: true },
  sale: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  variants: [VariantSchema],
  images: [ImageSchema]
}, { timestamps: true });

// Check if the model is already defined to avoid OverwriteModelError
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
