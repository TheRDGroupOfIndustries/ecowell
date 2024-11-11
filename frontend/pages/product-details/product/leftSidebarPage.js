import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Container, Row, Col, Media } from "reactstrap";
import ProductTab from "../common/product-tab";
import Service from "../common/service";
import NewProduct from "../../shop/common/newProduct";
import ImageZoom from "../common/image-zoom";
import DetailsWithPrice from "../common/detail-price";
import Filter from "../common/filter";
import ProductReviews from "./product_reviews";

const LeftSidebarPage = ({
  selectedProduct: data,
  wholeProduct,
  setSelectedProduct,
}) => {
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

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, [slider1, slider2]);

  const filterClick = () => {
    document.getElementById("filter").style.left = "-15px";
  };

  const changeColorVar = (variantIndex) => {
    // console.log("Changing color variant to:", wholeProduct.variants[variantIndex]);
    setSelectedProduct(wholeProduct.variants[variantIndex]);
    slider2.current?.slickGoTo(0);
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
              <ProductReviews wholeProduct={wholeProduct} />
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default LeftSidebarPage;
