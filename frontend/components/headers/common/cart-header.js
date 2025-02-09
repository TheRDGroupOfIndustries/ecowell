import React, { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import CartContext from "../../../helpers/cart";
import { Media } from "reactstrap";

const CartHeader = ({ item, symbol }) => {
  const context = useContext(CartContext);
  const cartList = context.state;
  // const [productDetails, setProductDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // console.log("item:",item)
  // console.log("productDetails:",productDetails)

  // useEffect(() => {
  //   const fetchProductDetails = async () => {
  //     if (!item?.product) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       // Updated API endpoint
  //       const response = await fetch(
  //         `/api/products/getProductById/${item.product._id}`
  //       );

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(
  //           errorData.message || "Failed to fetch product details"
  //         );
  //       }

  //       const data = await response.json();
  //       // console.log("data:", data);
  //       setProductDetails(data);
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (item.product) {
  //     fetchProductDetails();
  //   }
  // }, [item?.product, cartList]);

  // if (loading) {
  //   return (
  //     <li className="loading">
  //       <div className="media">
  //         <div>Loading product details...</div>
  //       </div>
  //     </li>
  //   );
  // }

  // if (error) {
  //   return (
  //     <li className="error">
  //       <div className="media">
  //         <div>Error: {error}</div>
  //       </div>
  //     </li>
  //   );
  // }

  return (
    <Fragment>
      <li>
        <div className="media">
          <Link href={"/product-details/" + item?.productId._id}>
            {/* <a> */}
            <Media
              alt=""
              className="me-3"
              src={`${item?.variant?.image_link}`}
            />
            {/* </a> */}
          </Link>
          <div className="media-body">
            <Link href={"/product-details/" + item.productId._id}>
              {/* <a> */}
              <h6>{item.productId.title}</h6>
              {/* </a> */}
            </Link>

            <h4>
              <span>
                {item?.quantity} x {symbol}
                {(
                  (item?.productId.salePrice) 
                ).toFixed(2)}
              </span>
            </h4>
          </div>
        </div>
        <div className="close-circle">
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={() => context.removeFromCart(item)}></i>
        </div>
      </li>
    </Fragment>
  );
};

export default CartHeader;
