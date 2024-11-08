import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Media, Modal, ModalBody } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import { useRouter } from "next/router";
import ProductItem from "../../../components/common/product-box/ProductBox1";

const ProductSection = ({
  product,
  selectedVariantProduct,
  setSelectedVariantProduct,
}) => {
  const router = useRouter();
  const curContext = useContext(CurrencyContext);
  const context = useContext(CartContext);
  const contextWishlist = useContext(WishlistContext);
  const comapreList = useContext(CompareContext);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const currency = curContext.state;
  const cartCtx = useContext(CartContext);
  // const addToCart = cartCtx.addToCart;
  const quantity = cartCtx.quantity;
  const plusQty = cartCtx.plusQty;
  const minusQty = cartCtx.minusQty;
  const setQuantity = cartCtx.setQuantity;
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const uniqueTags = [];
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/categories/getProductsCategory/${product.category.slug}`);
        const data = await response.json();
        setCategoryProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [product]);
  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

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
          {!categoryProducts ? (
            "loading"
          ) : (
            <>
              {categoryProducts.map((product, index) => {
                return (
                  <Col xl="2" md="4" sm="6" key={index}>
                  {/* <ProductItem */}
                  <ProductItem
                    product={product}
                    title={product.title}
                    addWishlist={() =>
                      contextWishlist.addToWish(product)
                    }
                    addCart={() =>context.addToCart(product, quantity, product.variants[0])}
                    addCompare={() => comapreList.addToCompare(product)}
                    cartClass={"cart-info cart-wrap"}
                    backImage={true}
                  />
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
