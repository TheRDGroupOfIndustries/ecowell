import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductReviews = ({ wholeProduct }) => {
  const { data: session } = useSession();

  const [reviews, setReviews] = useState([]); //   console.log(reviews);
  const [newReview, setNewReview] = useState({ rating: 1, review_descr: "" });
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      if (wholeProduct) {
        const response = await fetch(
          `/api/products/reviews/${wholeProduct._id}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const result = await response.json();
        setReviews(result.reviews || []);
      }
    };
    const fetchIsUserOrderThisProduct = async () => {
      if (wholeProduct && session?.user) {
        const response = await fetch(`/api/products/check-product-in-orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: session?.user?._id,
            product_id: wholeProduct._id,
          }),
        });
        const result = await response.json();
        setHasOrdered(result.hasOrdered);
      }
    };
    fetchReviews();
    fetchIsUserOrderThisProduct();
  }, [wholeProduct, session?.user]);

  const handleStarClick = (star) => {
    setNewReview((prev) => ({ ...prev, rating: star }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _id, first_name, last_name, profile_image } = session.user;
    const { rating, review_descr } = newReview;

    try {
      const res = await fetch(`/api/products/reviews/${wholeProduct._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: _id,
          username: first_name + last_name,
          user_avatar: profile_image,
          rating,
          review_descr,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("post", result);

        setReviews(result.reviews || []);
        setNewReview({ rating: 1, review_descr: "" });
        toast.success(result.message);
      } else {
        toast.error(
          result.error || result.message || "Failed to submit review."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred while submitting your review, please try again"
      );
    }
  };

  const handleDeleteReview = async (review_id) => {
    // console.log("review_id: ", review_id);

    try {
      const res = await fetch(`/api/products/reviews/${wholeProduct._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id }),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("delete", result);

        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== review_id)
        );
        toast.success(result.message);
      } else {
        toast.error(
          result.error || result.message || "Failed to delete review."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="reviews-section mt-4">
        <h5>Product Reviews</h5>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card mb-3 p-3 shadow">
              <div className="d-flex align-items-center">
                <img
                  src={review.user_avatar}
                  alt={review.username}
                  className="rounded-circle me-2"
                  width="40"
                />
                <h6 className="mb-0">{review.username}</h6>
                <span className="ms-auto">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`fa fa-star ${
                        review.rating > index ? "text-warning" : "text-white"
                      }`}
                    ></i>
                  ))}
                </span>
              </div>
              <p className="mt-2">{review.review_descr}</p>
              {hasOrdered && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    cursor: "pointer",
                  }}
                >
                  <i
                    title="Delete your review"
                    onClick={() => {
                      console.log(review);

                      handleDeleteReview(review._id);
                    }}
                    className="fa fa-trash"
                    style={{ color: "red" }}
                  ></i>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      <div className="review-input mt-4">
        <h5>Leave a Review</h5>
        {hasOrdered ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa fa-star ${
                      newReview.rating >= star ? "text-warning" : "text-white"
                    }`}
                    onClick={() => handleStarClick(star)}
                    style={{ cursor: "pointer", marginRight: "4px" }}
                  ></i>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <textarea
                name="review_descr"
                value={newReview.review_descr}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
                placeholder="Write your review here..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        ) : (
          <p>You must purchase this product to leave a review.</p>
        )}
      </div>
    </>
  );
};

export default ProductReviews;
