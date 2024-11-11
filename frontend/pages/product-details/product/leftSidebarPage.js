import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Slider from "react-slick";
import { Container, Row, Col, Media } from "reactstrap";
import ProductTab from "../common/product-tab";
import Service from "../common/service";
import NewProduct from "../../shop/common/newProduct";
import ImageZoom from "../common/image-zoom";
import DetailsWithPrice from "../common/detail-price";
import Filter from "../common/filter";

const LeftSidebarPage = ({
  selectedProduct: data,
  wholeProduct,
  setSelectedProduct,
}) => {
  const { data: session } = useSession();

  var products = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    fade: true,
  };

  const sliderNav = {
    slidesToShow: data?.images?.length,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    adaptiveHeight: true,
    focusOnSelect: true,
  };

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, review_descr: "" });

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, [slider1, slider2]);

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
    fetchReviews();
  }, [wholeProduct]);

  const filterClick = () => {
    document.getElementById("filter").style.left = "-15px";
  };

  const changeColorVar = (variantIndex) => {
    // console.log("Changing color variant to:", wholeProduct.variants[variantIndex]);
    setSelectedProduct(wholeProduct.variants[variantIndex]);
    slider2.current?.slickGoTo(0);
  };

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

  if (!data) {
    return <p>Loading...</p>;
  }

  const selectedVariant = data || wholeProduct.variants[0];

  return (
    <section className="">
      <div className="collection-wrapper">
        <Container>
          <Row>
            <Col sm="3" className="collection-filter" id="filter">
              <Filter />
              <Service />
              <NewProduct />
            </Col>
            <Col lg="9" sm="12" xs="12">
              <Container fluid={true}>
                <Row>
                  <Col xl="12" className="filter-col">
                    <div className="filter-main-btn mb-2">
                      <span onClick={filterClick} className="filter-btn">
                        <i className="fa fa-filter"></i> filter
                      </span>
                    </div>
                  </Col>
                </Row>
                {!data ? (
                  "loading"
                ) : (
                  <Row>
                    <Col lg="6" className="product-thumbnail">
                      <Slider
                        {...products}
                        asNavFor={nav2}
                        ref={(slider) => setSlider1(slider)}
                        className="product-slick"
                      >
                        {selectedVariant.images.map((vari, index) => (
                          <div key={index}>
                            <ImageZoom image={vari} />
                          </div>
                        ))}
                      </Slider>
                      {selectedVariant.images.length > 1 && (
                        <Slider
                          className="slider-nav"
                          {...sliderNav}
                          asNavFor={nav1}
                          ref={(slider) => setSlider2(slider)}
                        >
                          {selectedVariant.images.map((item, i) => (
                            <div key={i}>
                              <Media
                                src={item}
                                key={i}
                                alt={`variant-${i}`}
                                className="img-fluid"
                              />
                            </div>
                          ))}
                        </Slider>
                      )}
                    </Col>
                    <Col lg="6" className="rtl-text product-ps">
                      <DetailsWithPrice
                        item={wholeProduct}
                        selectedVariantProduct={selectedVariant}
                        changeColorVar={changeColorVar}
                      />
                    </Col>
                  </Row>
                )}
              </Container>
              <ProductTab wholeProduct={wholeProduct} />

              <div className="reviews-section mt-4">
                <h5>Product Reviews</h5>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="review-card mb-3 p-3 border"
                    >
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
                                review.rating > index
                                  ? "text-warning"
                                  : "text-white"
                              }`}
                            ></i>
                          ))}
                          {/* {[...Array(5 - review.rating)].map((_, index) => (
                            <i
                              key={index + review.rating}
                              className="fa fa-star text-white"
                            ></i>
                          ))} */}
                        </span>
                      </div>
                      <p className="mt-2">{review.review_descr}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews available.</p>
                )}
              </div>

              <div className="review-input mt-4">
                <h5>Leave a Review</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa fa-star ${
                            newReview.rating >= star
                              ? "text-warning"
                              : "text-white"
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default LeftSidebarPage;
