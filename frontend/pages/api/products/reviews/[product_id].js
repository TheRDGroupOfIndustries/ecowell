import { connectToMongoDB } from "../../../../utils/db";
import Product from "../../../../models/Products";
import Review from "../../../../models/Reviews";

export default async function handler(req, res) {
  const { method, query, body } = req;
  console.log("review req:", method, query, body);
  const { product_id } = query;

  if (!product_id) {
    return res.status(400).json({ error: "product id is required" });
  }

  if (method === "GET") {
    try {
      await connectToMongoDB();
      const productReviews = await Review.findOne({ product_id });
      if (!productReviews) {
        return res
          .status(404)
          .json({ message: "This Product have now review(s)!" });
      }
      return res.status(200).json({
        message: "This Product have now review(s)!",
        reviews: productReviews.reviews,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (method === "POST") {
    try {
      const {
        // product_id,
        rating,
        review_descr,
        username,
        user_avatar,
        user_id,
      } = await body;

      if (!rating || !review_descr || !username || !user_avatar || !user_id) {
        return res.status(400).json({
          error:
            "rating, review_descr,username, user_id, user_avatar are required",
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

      const updatedReviews = await Review.findOne({ product_id });
      return res.status(200).json({
        reviews: updatedReviews.reviews,
        message: "Review written successfullly!",
      });
    } catch (error) {
      return res.status(500).json({ error: "error creating" });
    }
  }

  if (method === "PUT") {
    try {
      const { user_id, rating, review_descr, username, user_avatar } = body;

      await connectToMongoDB();

      const productReviews = await Review.findOne({ product_id });
      if (!productReviews) {
        return res
          .status(404)
          .json({ message: "This Product have now review(s)!" });
      }

      const reviewIndex = productReviews.reviews.findIndex(
        (review) => review.user_id === user_id
      );
      if (reviewIndex === -1) {
        return res
          .status(404)
          .json({ message: "Review not found for this user." });
      }

      // Update the review only if values have changed
      const existingReview = productReviews.reviews[reviewIndex];

      if (existingReview.rating !== rating) {
        existingReview.rating = rating;
      }
      if (existingReview.review_descr !== review_descr) {
        existingReview.review_descr = review_descr;
      }
      if (existingReview.username !== username) {
        existingReview.username = username;
      }
      if (existingReview.user_avatar !== user_avatar) {
        existingReview.user_avatar = user_avatar;
      }

      const savedProductReviews = await productReviews.save();

      return res.status(200).json({
        success: true,
        message: "Your Product review is edited successfully!",
        reviews: savedProductReviews.reviews,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (method === "DELETE") {
    try {
      const { user_id } = body;

      await connectToMongoDB();

      const productReviews = await Review.findOne({ product_id });
      if (!productReviews) {
        return res
          .status(404)
          .json({ message: "This Product have now review(s)!" });
      }

      const reviewIndex = productReviews.reviews.findIndex(
        (review) => review.user_id === user_id
      );
      if (reviewIndex === -1) {
        return res
          .status(404)
          .json({ message: "Review not found for this user." });
      }

      productReviews.reviews.splice(reviewIndex, 1);
      await productReviews.save();

      return res.status(200).json({
        success: true,
        message: "Your Product review is deleted successfully!",
      });
    } catch (error) {
      console.log(error);
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
    await connectToMongoDB();

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
