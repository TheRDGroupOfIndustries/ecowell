import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container, Row, Col, Table } from "reactstrap";
import { WishlistContext } from "../../../../helpers/wishlist/WishlistContext";
import CartContext from "../../../../helpers/cart/index";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";

const WishlistPage = () => {
  const router = useRouter();
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;

  const context = useContext(WishlistContext);
  const cartContext = useContext(CartContext);

  const wishlist = context.wishlistItems;
  // console.log("wishlist:", wishlist);
  const removeFromWish = context.removeFromWish;
  const addCart = cartContext.addToCart;

  const checkOut = () => {
    router.push("/page/account/checkout");
  };
  return (
    <>
      <section className="wishlist-section section-b-space">
        {wishlist.length > 0 ? (
          <Container>
            <Row>
              <Col sm="12">
                <Table className="table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">Image</th>
                      <th scope="col">Product name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Availability</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  {wishlist.map((item, i) => (
                    <tbody key={i}>
                      <tr className="table-body">
                        <td>
                          <Link href={`/page/product/${item.sku}`}>
                            <img src={item.variants[0].images[0]} alt="" />
                          </Link>
                        </td>
                        <td>
                          <Link href={`/page/product/${item.sku}`}>
                            {item.title}
                          </Link>
                          <Row className="mobile-cart-content">
                            <div className="col-xs-3">
                              <p>
                                {item.variants[0].stock > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </p>
                            </div>
                            <div className="col-xs-3">
                              <p className="td-colo">
                                {symbol}
                                {item.price}
                              </p>
                            </div>
                            <div className="col-xs-3">
                              <h2 className="td-color">
                                <button
                                  onClick={() => removeFromWish(item)}
                                  className="icon me-1"
                                  style={{ border: "none" }}
                                >
                                  <i className="fa fa-close"></i>
                                </button>
                                <button
                                  onClick={() =>
                                    addCart(item, 1, item.variants[0])
                                  }
                                  className="cart"
                                  style={{ border: "none" }}
                                >
                                  <i className="fa fa-shopping-cart"></i>
                                </button>
                              </h2>
                            </div>
                          </Row>
                        </td>
                        <td>
                          <p>
                            {symbol}
                            {item.price}
                          </p>
                        </td>
                        <td>
                          <p>
                            {item.variants[0].stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </p>
                        </td>
                        <td>
                          <button
                            onClick={() => removeFromWish(item)}
                            className="icon me-3"
                            style={{ border: "none" }}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                          <button
                            onClick={() => addCart(item)}
                            className="cart"
                            style={{ border: "none" }}
                          >
                            <i className="fa fa-shopping-cart"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </Col>
            </Row>
            <Row className="wishlist-buttons">
              <Col sm="12">
                <Link href="/" className="btn btn-solid">
                  continue shopping
                </Link>
                <button className="btn btn-solid" onClick={checkOut}>
                  check out
                </button>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container>No wishlist products found!</Container>
        )}
      </section>
    </>
  );
};

export default WishlistPage;
