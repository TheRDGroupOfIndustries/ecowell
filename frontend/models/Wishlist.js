// const mongoose = require("mongoose");

// const WishlistSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
// }, { timestamps: true });

// const Wishlist = mongoose.model("Wishlist", WishlistSchema);

// module.exports = Wishlist;

// import mongoose from "mongoose";

// const WishlistSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Wishlist =
//   mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);

// module.exports = Wishlist;

// name: String,
// price: Number,
// description: String,
// image: String,

import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

module.exports =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
