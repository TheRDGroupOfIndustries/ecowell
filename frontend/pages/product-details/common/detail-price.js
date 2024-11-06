import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import sizeChart from "../../../public/assets/images/size-chart.jpg";
import { Modal, ModalBody, ModalHeader, Media, Input } from "reactstrap";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import CartContext from "../../../helpers/cart";
import CountdownComponent from "../../../components/common/widgets/countdownComponent";
import MasterSocial from "./master_social";

const DetailsWithPrice = ({
  item,
  stickyClass,
  selectedVariantProduct,
  changeColorVar,
}) => {
  // console.log("selectedVariantProduct: ", selectedVariantProduct);
  const [modal, setModal] = useState(false);
  const CurContect = useContext(CurrencyContext);
  const symbol = CurContect.state.symbol;
  const toggle = () => setModal(!modal);
  const [product, setProduct] = useState(item);
  useEffect(() => {
    setProduct(item);
  }, [item]);
  const context = useContext(CartContext);
  const stock = context.stock;
  const plusQty = context.plusQty;
  const minusQty = context.minusQty;
  const quantity = context.quantity;
  const uniqueFlavors = [];

  const changeQty = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  if (!product || !product.variants) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2> {product.title} </h2>
        <h4>
          <del>
            {/* ruppees entitu */}
            {symbol}|{product.price}
          </del>
          <span>
            {product.discount ? Number(product?.discount).toFixed(2) : "90"}%
            off
          </span>
        </h4>
        <h3>
          {symbol}
          {(product.price - (product.price * product.discount) / 100).toFixed(
            2
          )}
        </h3>
        {product.variants.map((vari) => {
          var findItem = uniqueFlavors.find((x) => x.flavor === vari.flavor);
          if (!findItem) uniqueFlavors.push(vari);
        })}
        {changeColorVar === undefined ? (
          <>
            {uniqueFlavors.some((vari) => vari.flavor) ? (
              <ul>
                {uniqueFlavors.map((vari, i) => {
                  return (
                    <li
                      className={vari.flavor}
                      key={i}
                      title={vari.flavor}
                      style={{
                        padding: "10px",
                        border: "1px solid #fff",
                        marginRight: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {vari.flavor}
                    </li>
                  );
                })}
              </ul>
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {uniqueFlavors.some((vari) => vari.flavor) ? (
              <ul>
                {uniqueFlavors.map((vari, i) => {
                  return (
                    <li
                      className={vari.flavor}
                      key={i}
                      title={vari.flavor}
                      onClick={() => changeColorVar(i)}
                      style={{
                        padding: "10px",
                        border: "1px solid #fff",
                        marginRight: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {vari.flavor}
                    </li>
                  );
                })}
              </ul>
            ) : (
              ""
            )}
          </>
        )}
        <div className="product-description border-product">
          {/* {product.variants ? (
            <div>
              {uniqueFlavors.some((flavor) => flavor) ? (
                <>
                  <h6 className="product-title size-text">
                    select flavor
                    <span>
                      <a href={null} data-toggle="modal" data-target="#sizemodal" onClick={toggle}>
                        size chart
                      </a>
                    </span>
                  </h6>
                  <Modal isOpen={modal} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>Sheer Straight Kurta</ModalHeader>
                    <ModalBody>
                      <Media src={sizeChart.src} alt="size" className="img-fluid" />
                    </ModalBody>
                  </Modal>
                  <div className="size-box">
                    <ul>
                      {uniqueFlavors.map((data, i) => {
                        return (
                          <li key={i}>
                            <a href={null}>{data.flavor}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )} */}
          <span className="instock-cls">{stock}</span>
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
              <Input
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
          <a
            href={null}
            className="btn btn-solid"
            onClick={() => {
              if (context.productExistsInCart(product._id)) {
                context.removeFromCart(product);
              } else {
                context.addToCart(product, quantity, selectedVariantProduct);
              }
            }}
          >
            {context.productExistsInCart(product._id)
              ? "remove from cart"
              : "add to cart"}
          </a>
          <Link
            href={`/page/account/checkout`}
            className="btn btn-solid"
            onClick={() =>
              context.addToCart(product, quantity, selectedVariantProduct)
            }
          >
            buy now
          </Link>
        </div>
        <div className="border-product">
          <h6 className="product-title">product details</h6>
          <p>{product.description}</p>
        </div>
        <div className="border-product">
          {/* <h6 className="product-title">share it</h6>
          <div className="product-icon">
            <MasterSocial />
          </div> */}
        </div>
        {/* <div className="border-product">
          <h6 className="product-title">Time Reminder</h6>
          <CountdownComponent />
        </div> */}
      </div>
    </>
  );
};

export default DetailsWithPrice;
