import React, { useState, useContext } from "react";
import Link from "next/link";
import CartContext from "../../../../helpers/cart";
import { Container, Row, Col, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import cart from "../../../../public/assets/images/icon-empty-cart.png";

const CartPage = () => {
  const context = useContext(CartContext);
  const cartItems = context.state;
  const cartTotal = context.cartTotal;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const removeFromCart = context.removeFromCart;
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState(false);
  const [stockStatus, setStockStatus] = useState("InStock");
  const updateQty = context.updateQty;

  const handleQtyUpdate = (item, quantity, currentStock) => {
    if (quantity >= 1) {
      setQuantityError(false);
      updateQty(item, quantity, currentStock);
    } else {
      setQuantityError(true);
    }
  };

  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const minusQty = () => {
    if (quantity > 1) {
      setStockStatus("InStock");
      setQty(quantity - 1);
    }
  };

  const plusQty = (product) => {
    if (product.variant.stock >= quantity) {
      setQuantity(quantity + 1);
    } else {
      setStockStatus("Out of Stock !");
    }
  };

  return (
    <div>
      {cartItems && cartItems.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-tabl table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">Image</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Action</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  {cartItems.map((item, index) => {
                    // console.log("item index: ", item.productId.variants)
                    console.log("item: ", item);
                    const currentVariant = item.productId.variants.find(
                      (variant) => variant.flavor === item.variant.flavor
                    );
                    const currentStock = currentVariant
                      ? currentVariant.stock
                      : 0;

                    return (
                      <tbody key={index}>
                        <tr>
                          <td>
                            <Link href={`/product-details/${item.productId.sku}`}>
                              <Media src={item.variant.image_link} alt="" />
                            </Link>
                          </td>
                          <td>
                            <Link href={`/product-details/${item.productId.sku}`}>
                              {item?.productId?.title}
                            </Link>
                            <div className="mobile-cart-content row">
                              <div className="col-xs-3">
                                <div className="qty-box">
                                  <div className="input-group">
                                    <input
                                      type="number"
                                      name="quantity"
                                      onChange={(e) =>
                                        handleQtyUpdate(item, e.target.value)
                                      }
                                      className="form-control input-number"
                                      value={item.quantity}
                                      style={{
                                        borderColor: quantityError && "red",
                                      }}
                                    />
                                  </div>
                                </div>
                                {item.quantity >= currentStock
                                  ? "out of Stock"
                                  : ""}
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  {symbol}
                                  {item.productId.salePrice ? item.productId.salePrice : item.productId.price}
                                </h2>
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  <a href="#" className="icon">
                                    <i
                                      className="fa fa-times"
                                      onClick={() => removeFromCart(item)}
                                    ></i>
                                  </a>
                                </h2>
                              </div>
                            </div>
                          </td>
                          <td>
                            <h2>
                              {symbol}
                              {item.productId.salePrice ? item.productId.salePrice : item.productId.price}
                            </h2>
                          </td>
                          <td>
                            <div className="qty-box">
                              <div className="input-group">
                                <input
                                  type="number"
                                  name="quantity"
                                  onChange={(e) =>
                                    handleQtyUpdate(
                                      item,
                                      e.target.value,
                                      currentStock
                                    )
                                  }
                                  className="form-control input-number"
                                  value={item.quantity}
                                  style={{
                                    borderColor: quantityError && "red",
                                  }}
                                />
                              </div>
                            </div>
                            {item.quantity >= currentStock
                              ? "out of Stock"
                              : ""}
                          </td>
                          <td>
                            <i
                              className="fa fa-times"
                              onClick={() => removeFromCart(item)}
                            ></i>
                          </td>
                          <td>
                            <h2 className="td-color">
                              {symbol}
                              {item.productId.salePrice ? item.productId.salePrice * item.quantity : item.productId.price * item.quantity}
                            </h2>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>Total Price :</td>
                      <td>
                        <h2>
                          {symbol}
                          {cartTotal}
                        </h2>
                      </td>
                      ₹
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
            <Row className="cart-buttons">
              <Col xs="6">
                <Link href={`/shop/left_sidebar`} className="btn btn-solid">
                  continue shopping
                </Link>
              </Col>
              <Col xs="6">
                <Link href={`/page/account/checkout`} className="btn btn-solid">
                  check out
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div>
                  <div className="col-sm-12 empty-cart-cls text-center">
                    <Media
                      src={cart}
                      className="img-fluid mb-4 mx-auto"
                      alt=""
                    />
                    <h3>
                      <strong>Your Cart is Empty</strong>
                    </h3>
                    <h4>Explore more shortlist some items.</h4>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default CartPage;
