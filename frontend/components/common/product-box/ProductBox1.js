import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Row, Col, Media, Modal, ModalBody, ModalHeader } from "reactstrap";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";

const ProductItem = ({
  product,
  addCart,
  backImage,
  des,
  addWishlist,
  cartClass,
  productDetail,
  addCompare,
  title,
}) => {
  const router = useRouter();
  const wishlistContext = useContext(WishlistContext);
  const cartContext = useContext(CartContext);
  // console.log("cartContext:", cartContext, product);

  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const plusQty = cartContext.plusQty;
  const minusQty = cartContext.minusQty;
  const quantity = cartContext.quantity;
  const setQuantity = cartContext.setQuantity;

  const [image, setImage] = useState(
    (product.variants &&
      product.variants[0].images &&
      product.variants[0].images[0]) ??
      ""
  );

  useEffect(() => {
    setImage(product.variants[0].images[0]);
  }, [product]);

  const [modal, setModal] = useState(false);
  const [modalCompare, setModalCompare] = useState(false);
  const toggleCompare = () => setModalCompare(!modalCompare);
  const toggle = () => setModal(!modal);
  const uniqueTags = [];

  const onClickHandle = (img) => {
    setImage(img);
  };

  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const clickProductDetail = () => {
    console.log("product: ", product);
    router.push(`/product-details/${product.sku}`);
  };

  const variantChangeByFlavor = (flavor) => {
    const selectedVariant = product.variants.find(
      (variant) => variant.flavor === flavor
    );
    if (selectedVariant) {
      setImage(selectedVariant.images[0]);
    }
  };

  if (!product.variants || !product.variants[0].images) {
    return null;
  }

  return (
    <div className="product-box product-wrap">
      <div
        className="img-wrapper"
        style={{
          cursor: "pointer",
        }}
      >
        <div className="lable-block">
          {product.new === true ? <span className="lable3">new</span> : ""}
          {product.sale === true ? <span className="lable4">on sale</span> : ""}
        </div>
        <div className="front" onClick={clickProductDetail}>
          <Media src={image} className="img-fluid" alt="" />
        </div>
        {backImage ? (
          product.variants[0].images[1] === "undefined" ? (
            "false"
          ) : (
            <div className="back" onClick={clickProductDetail}>
              <Media src={image} className="img-fluid m-auto" alt="" />
            </div>
          )
        ) : (
          ""
        )}

        <div className={cartClass}>
          <button
            title="Add to cart"
            onClick={() => {
              if (cartContext.productExistsInCart(product._id)) {
                cartContext.removeFromCart(product);
              } else {
                cartContext.addToCart(product, 1, product.variants[0]);
              }
            }}
          >
            <i
              className="fa fa-shopping-cart"
              style={{
                color:
                  cartContext.productExistsInCart(product._id) && "#399B2E",
              }}
              aria-hidden="true"
            ></i>
          </button>
          <a
            href={null}
            title="Add to Wishlist"
            onClick={() => {
              if (wishlistContext.productExistsInWishlist(product._id)) {
                wishlistContext.removeFromWish(product);
              } else {
                addWishlist(product);
              }
            }}
          >
            <i
              className="fa fa-heart"
              style={{
                color:
                  wishlistContext.productExistsInWishlist(product._id) &&
                  "#399B2E",
              }}
              aria-hidden="true"
            ></i>
          </a>
          <a href={null} title="Quick View" onClick={toggle}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </a>
          <a href={null} title="Compare" onClick={toggleCompare}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </a>
          <Modal
            isOpen={modalCompare}
            toggle={toggleCompare}
            size="lg"
            centered
          >
            <ModalBody>
              <Row className="compare-modal">
                <Col lg="12">
                  <div className="media">
                    <Media src={image} alt="" className="img-fluid" />
                    <div className="media-body align-self-center text-center">
                      <h5>
                        <i className="fa fa-check"></i>Item{" "}
                        <span>{product.title} </span>
                        <span> successfully added to your Compare list</span>
                      </h5>
                      <div className="buttons d-flex justify-content-center">
                        <Link href="/page/compare">
                          <button
                            className="btn-sm btn-solid"
                            onClick={addCompare}
                          >
                            View Compare list
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
        {product.variants ? (
          <ul className="product-thumb-list">
            {product.variants.map((variant, i) => (
              <li
                className={`grid_thumb_img ${
                  variant.images[0] === image ? "active" : ""
                }`}
                key={i}
              >
                <a
                  href={null}
                  title={variant.flavor}
                  onClick={() => variantChangeByFlavor(variant.flavor)}
                >
                  <Media src={variant.images[0]} alt={variant.flavor} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
      <MasterProductDetail
        product={product}
        productDetail={productDetail}
        currency={currency}
        uniqueTags={uniqueTags}
        title={title}
        des={des}
        variantChangeByFlavor={variantChangeByFlavor}
      />
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
                <Media src={image} alt="" className="img-fluid" />
              </div>
            </Col>
            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <button
                  type="button"
                  data-dismiss="modal"
                  className="btn-close btn btn-secondary"
                  aria-label="Close"
                  onClick={toggle}
                ></button>
                <h2> {product.title} </h2>
                <h3>
                  {currency.symbol}
                  {(product.price * currency.value).toFixed(2)}
                </h3>
                {product.variants ? (
                  <ul className="color-variant">
                    {product.variants.map((variant, i) => (
                      <li
                        key={i}
                        title={variant.flavor}
                        onClick={() => variantChangeByFlavor(variant.flavor)}
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
                    onClick={() => {
                      if (cartContext.productExistsInCart(product._id)) {
                        cartContext.removeFromCart(product);
                      } else {
                        cartContext.addToCart(product, 1, product.variants[0]);
                      }
                    }}
                  >
                    {cartContext.productExistsInCart(product._id)
                      ? "remove from cart"
                      : "add to cart"}
                  </button>
                  <button
                    className="btn btn-solid"
                    onClick={clickProductDetail}
                  >
                    View detail
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductItem;
