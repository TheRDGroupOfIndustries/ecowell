import { connectToMongoDB } from "../../../../utils/db";
import Product from "../../../../models/Products";
import Review from "../../../../models/Reviews";

export default async function handler(req, res) {
  const { method, query, body } = req;
  console.log("req:", method, query, body);

  if (method === "POST") {
    try {
      const {
        product_id,
        rating,
        review_descr,
        username,
        user_avatar,
        user_id,
      } = await body;

      if (
        !product_id ||
        !rating ||
        !review_descr ||
        !username ||
        !user_avatar ||
        !user_id
      ) {
        return res.status(400).json({
          error:
            "product_id, rating, review_descr,username, user_id, user_avatar are required",
        });
      }
      await connectToMongoDB();
      const product = await Product.findOne({ _id: product_id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const review = await createReview(
        product_id,
        rating,
        review_descr,
        username,
        user_avatar,
        user_id
      );

      return res.status(200).json(review);
    } catch (error) {
      return res.status(500).json({ error: "error creating" });
    }
  }
}

async function createReview(
  product_id,
  rating,
  review_descr,
  username,
  user_avatar,
  user_id
) {
  if (
    !product_id ||
    !rating ||
    !review_descr ||
    !username ||
    !user_avatar ||
    !user_id
  ) {
    throw new Error("Invalid input");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  try {
    // check if any reviews exist for the product_id
    const existingReview = await Review.findOne({ product_id: product_id });

    let review = {
      user_id: user_id,
      username,
      user_avatar: user_avatar,
      rating,
      review_descr,
    };

    if (existingReview) {
      existingReview.reviews.push(review);
      const savedExistingReview = await existingReview.save();
      return savedExistingReview;
    } else {
      const newProductReview = Review({
        product_id: product_id,
        reviews: [review],
      });
      await newProductReview.save();
      return newProductReview;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Error creating review");
  }
}
