import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Media, Modal, ModalBody } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import { useRouter } from "next/router";

const ProductSection = ({
  product,
  selectedVariantProduct,
  setSelectedVariantProduct,
}) => {
  const router = useRouter();
  const curContext = useContext(CurrencyContext);
  const wishlistContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const symbol = curContext.state.symbol;
  const currency = curContext.state;
  const cartCtx = useContext(CartContext);
  // const addToCart = cartCtx.addToCart;
  const quantity = cartCtx.quantity;
  const plusQty = cartCtx.plusQty;
  const minusQty = cartCtx.minusQty;
  const setQuantity = cartCtx.setQuantity;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const uniqueTags = [];

  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  useEffect(() => {
    // console.log("product: ", product);
  }, [product]);

  const clickProductDetail = () => {
    // console.log("product: ", product);
    router.push(`/product-details/${product.sku}`);
  };

  const getSelectedProduct = (item) => {
    setSelectedVariantProduct(item);
    toggle();
  };

  return (
    <section className="section-b-space ratio_asos">
      <Container>
        <Row>
          <Col className="product-related">
            <h2>related products</h2>
          </Col>
        </Row>
        <Row className="search-product">
          {!product || !product.variants ? (
            "loading"
          ) : (
            <>
              {product?.variants?.map((variant, index) => {
                return (
                  <Col xl="2" md="4" sm="6" key={index}>
                    <div className="product-box">
                      <div className="img-wrapper">
                        <div className="front">
                          <a href={null}>
                            <Media
                              onClick={() => clickProductDetail()}
                              src={variant.images[0]}
                              className="img-fluid blur-up lazyload bg-img"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="back">
                          <a href={null}>
                            <Media
                              src={variant.images[1]}
                              className="img-fluid blur-up lazyload bg-img"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="cart-info cart-wrap">
                          <button
                            data-toggle="modal"
                            data-target="#addtocart"
                            title="Add to cart"
                            onClick={() =>
                              cartCtx.addToCart(
                                product,
                                quantity,
                                selectedVariantProduct
                              )
                            }
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </button>
                          <a
                            href="#"
                            onClick={() => wishlistContext.addToWish(product)}
                            title="Add to Wishlist"
                          >
                            <i className="fa fa-heart" aria-hidden="true"></i>
                          </a>
                          <a
                            href="#"
                            onClick={() => setSelectedVariantProduct(variant)}
                            data-toggle="modal"
                            data-target="#quick-view"
                            title="Quick View"
                          >
                            <i className="fa fa-search" aria-hidden="true"></i>
                          </a>
                          <a
                            href="#"
                            onClick={() => compareContext.addToCompare(product)}
                            title="Compare"
                          >
                            <i className="fa fa-refresh" aria-hidden="true"></i>
                          </a>
                        </div>
                      </div>
                      <div className="product-detail">
                        <div className="rating">
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>
                        </div>
                        <a href={null}>
                          <h6>{product.title}</h6>
                        </a>
                        <h4>
                          {symbol}
                          {product.price}
                        </h4>
                        <ul className="color-variant">
                          <li className="bg-light0"></li>
                          <li className="bg-light1"></li>
                          <li className="bg-light2"></li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </>
          )}
        </Row>
        {product ? (
          <Modal
            isOpen={modal}
            toggle={toggle}
            className="modal-lg quickview-modal"
            centered
          >
            <ModalBody>
              <Row>
                <Col lg="6" xs="12">
                  <div className="quick-view-img">
                    <Media
                      src={`${product.variants[0].images[0]}`}
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                </Col>
                <Col lg="6" className="rtl-text">
                  <div className="product-right">
                    <h2> {product.title} </h2>
                    <h3>
                      {currency.symbol}
                      {(product.price * currency.value).toFixed(2)}
                    </h3>
                    {product.variants ? (
                      <ul className="color-variant">
                        {product?.variants?.map((variant, i) => (
                          <li
                            key={i}
                            title={variant.flavor}
                            onClick={() => setSelectedVariantProduct(variant)}
                          >
                            {variant.flavor}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                    <div className="border-product">
                      <h6 className="product-title">product details</h6>
                      <p>{product.description}</p>
                    </div>
                    <div className="product-description border-product">
                      {product.size ? (
                        <div className="size-box">
                          <ul>
                            {product.size.map((size, i) => {
                              return (
                                <li key={i}>
                                  <a href={null}>{size}</a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        ""
                      )}
                      <h6 className="product-title">quantity</h6>
                      <div className="qty-box">
                        <div className="input-group">
                          <span className="input-group-prepend">
                            <button
                              type="button"
                              className="btn quantity-left-minus"
                              onClick={minusQty}
                              data-type="minus"
                              data-field=""
                            >
                              <i className="fa fa-angle-left"></i>
                            </button>
                          </span>
                          <input
                            type="text"
                            name="quantity"
                            value={quantity}
                            onChange={changeQty}
                            className="form-control input-number"
                          />
                          <span className="input-group-prepend">
                            <button
                              type="button"
                              className="btn quantity-right-plus"
                              onClick={() => plusQty(product)}
                              data-type="plus"
                              data-field=""
                            >
                              <i className="fa fa-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="product-buttons">
                      <button
                        className="btn btn-solid"
                        onClick={() =>
                          cartCtx.addToCart(
                            product,
                            quantity,
                            selectedVariantProduct
                          )
                        }
                      >
                        add to cart
                      </button>
                      <button
                        className="btn btn-solid"
                        onClick={() => clickProductDetail(product)}
                      >
                        View detail
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        ) : (
          ""
        )}
      </Container>
    </section>
  );
};

export default ProductSection;
