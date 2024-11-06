import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Container, Media } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import Slider from "react-slick";
import ProductItems from "../product-box/ProductBox1";
import CartContext from "../../../helpers/cart";
import PostLoader from "../PostLoader";

const TopCollection = ({
  title,
  subtitle,
  designClass,
  noSlider,
  cartClass,
  productSlider,
  titleClass,
  noTitle,
  innerClass,
  inner,
  backImage,
  loading,
  data,
}) => {
  const context = useContext(CartContext);
  const contextWishlist = useContext(WishlistContext);
  const comapreList = useContext(CompareContext);
  const quantity = context.quantity;
  const [delayProduct, setDelayProduct] = useState(true);
  // console.log("ProductItems product:", data);

  useEffect(() => {
    if (data === undefined) {
      noSlider === false;
    } else {
      noSlider === true;
    }
    setTimeout(() => {
      setDelayProduct(false);
    }, 1);
  }, [delayProduct]);

  return (
    <>
      <section className={designClass}>
        {noSlider ? (
          <Container>
            <Row>
              <Col>
                {noTitle === "null" ? (
                  ""
                ) : (
                  <div className={innerClass}>
                    {subtitle ? <h4>{subtitle}</h4> : ""}
                    <h2 className={inner}>{title}</h2>
                    {titleClass ? (
                      <hr role="tournament6" />
                    ) : (
                      <div className="line">
                        <span></span>
                      </div>
                    )}
                  </div>
                )}

                {delayProduct ? (
                  <div className="row mx-0 margin-default">
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                  </div>
                ) : (
                  <Slider {...productSlider} className="product-m no-arrow">
                    {data &&
                      data.map((product, i) => (
                        <div key={i}>
                          <ProductItems
                            product={product}
                            title={title}
                            addWishlist={() =>
                              contextWishlist.addToWish(product)
                            }
                            addCart={() =>context.addToCart(product, quantity, product.variants[0])}
                            addCompare={() => comapreList.addToCompare(product)}
                            cartClass={cartClass}
                            backImage={backImage}
                          />
                        </div>
                      ))}
                  </Slider>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <>
            {title ? (
              <div className="title1 title-gradient  section-t-space">
                <h4>{subtitle}</h4>
                <h2 className="title-inner1">{title}</h2>
                <hr role="tournament6" />
              </div>
            ) : (
              ""
            )}
            <Container>
              <Row className="margin-default">
                {!data ||
                !data.products ||
                !data.products.items ||
                !data.products.items.length === 0 ||
                loading ? (
                  <div className="row margin-default">
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                  </div>
                ) : (
                  data &&
                  data.slice(0, 8).map((product, index) => (
                    <Col xl="3" sm="6" key={index}>
                      <div>
                        <ProductItems
                          product={product}
                          backImage={backImage}
                          addCompare={() => comapreList.addToCompare(product)}
                          addWishlist={() => contextWishlist.addToWish(product)}
                          title={title}
                          cartClass={cartClass}
                          addCart={() =>context.addToCart(product, quantity, product.variants[0])}
                          key={index}
                        />
                      </div>
                    </Col>
                  ))
                )}
              </Row>
            </Container>
          </>
        )}
      </section>
    </>
  );
};

export default TopCollection;
