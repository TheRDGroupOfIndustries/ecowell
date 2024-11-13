import React, { useContext, useState, useEffect } from "react";
import { Media, Container, Form, Row, Col } from "reactstrap";
import CartContext from "../../../../helpers/cart";
import paypal from "../../../../public/assets/images/paypal.png";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CurrencyContext } from "../../../../helpers/Currency/CurrencyContext";
import { useSession } from "next-auth/react";
import { set } from "mongoose";

const CheckoutPage = () => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const cartTotal = cartContext.cartTotal;
  const setCartItems = cartContext.setCartItems;
  const setCurrentOrderDetails = cartContext.setCurrentOrderDetails;
  const setCurrentDiscount = cartContext.setCurrentDiscount;
  const currentDiscount = cartContext.currentDiscount;
  const selectedCoupons = cartContext.selectedCoupons;
  const setSelectedCoupons = cartContext.setSelectedCoupons;
  const setOrderedItems = cartContext.setOrderedItems;
  const curContext = useContext(CurrencyContext);
  const symbol = curContext.state.symbol;
  const [payment, setPayment] = useState("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState([]);
  const userId = session?.user?._id;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm(); // initialise the hook
  const router = useRouter();

  const [billingDetails, setBillingDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    country: "India",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons/getAllCoupons", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Coupons:", result.coupons);
          setCoupons(result.coupons);
        } else {
          console.error("Failed to fetch coupons");
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
    if (!cartItems || cartItems.length === 0) {
      router.push("/page/account/cart");
    } else {
      setOrderedItems(cartItems);
    }
  }, []);
useEffect(() => {
  console.log("Selected Coupons:", selectedCoupons);

  const calculateDiscount = () => {
    let discount = 0;

    selectedCoupons.forEach((coupon) => {
      if (coupon.discountType === "fixed") {
        discount += coupon.discountValue;
      } else if (coupon.discountType === "percent") {
        let percentDiscount = (cartTotal * coupon.discountValue) / 100;
        if (percentDiscount > coupon.maxSpend) {
          percentDiscount = coupon.maxSpend;
        }
        discount += percentDiscount;
      }
    });

    const finalPrice = cartTotal - discount;
    console.log("Final Price after discount:", finalPrice);
    setCurrentDiscount(discount);
    // setCartTotal(finalPrice);
    // setFinalPrice(finalPrice > 0 ? finalPrice : 0);
  };

  calculateDiscount();
}, [selectedCoupons, cartTotal]);
  const checkhandle = (value) => {
    setPayment(value);
  };

  const onSubmit = async (data) => {
    console.log("Data:", data);
    if (data !== "") {
      console.log("Billing Details:", billingDetails);
      console.log("Cart Items:", cartItems);
      console.log("cart payment:", payment);
      console.log("cart total:", cartTotal);

      // Create order
      try {
        setPlacingOrder(true);
        const orderResponse = await fetch("/api/order/create/user-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            order_info: {
              payment_method: payment,
              first_name: billingDetails.first_name,
              last_name: billingDetails.last_name,
              total_price: cartTotal-currentDiscount>0? cartTotal-currentDiscount:0,
              order_date: new Date().toISOString(),
              phone: billingDetails.phone,
              email: billingDetails.email,
              address: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              country: billingDetails.country,
              pincode: billingDetails.pincode,
              status: "pending",
            },
            products: cartItems.map((item) => ({
              product_id: item.productId._id,
              variant_flavor: item.variant.flavor,
              quantity: item.quantity,
            })),
          }),
        });

        if (orderResponse.ok) {
          const orderResult = await orderResponse.json();
          console.log(orderResult.message);

          // Empty the cart
          const response = await fetch("/api/cart/emptyCart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            setCartItems([]); // Clear the cart items in the context
            console.log("Ordered Details:", orderResult.order);
            setCurrentOrderDetails(orderResult.order); 
          } else {
            console.error("Failed to empty cart");
          }

          router.push({
            pathname: "/page/order-success",
            state: { items: cartItems, orderTotal: 
              cartTotal-currentDiscount>0? cartTotal-currentDiscount:0,symbol: symbol },
          });
        } else {
          console.error("Failed to create order");
        }
      } catch (error) {
        console.error("Error creating order:", error);
      } finally {
        setPlacingOrder(false);
      }
    } else {
      errors.showMessages();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setValue(name, value); // Update the value in React Hook Form
    trigger(name); // Trigger validation for the field
  };

  // Use useEffect to set the initial values for the form fields
  useEffect(() => {
    Object.keys(billingDetails).forEach((key) => {
      setValue(key, billingDetails[key]);
      trigger(key); // Trigger validation for each field
    });
  }, [billingDetails, setValue, trigger]);

  return (
    <section className="section-b-space">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg="6" sm="12" xs="12">
                  <div className="checkout-title">
                    <h3>Billing Details</h3>
                  </div>
                  <div className="row check-out">
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">First Name</div>
                      <input
                        type="text"
                        className={`${errors.first_name ? "error_border" : ""}`}
                        name="first_name"
                        {...register("first_name", { required: true })}
                        value={billingDetails.first_name}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.first_name && "First name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Last Name</div>
                      <input
                        type="text"
                        className={`${errors.last_name ? "error_border" : ""}`}
                        name="last_name"
                        {...register("last_name", { required: true })}
                        value={billingDetails.last_name}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.last_name && "Last name is required"}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Phone</div>
                      <input
                        type="text"
                        name="phone"
                        className={`${errors.phone ? "error_border" : ""}`}
                        {...register("phone", { pattern: /\d+/ })}
                        value={billingDetails.phone}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.phone && "Please enter number for phone."}
                      </span>
                    </div>
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">
                      <div className="field-label">Email Address</div>
                      <input
                        className={`${errors.email ? "error_border" : ""}`}
                        type="text"
                        name="email"
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                        value={billingDetails.email}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.email && "Please enter proper email address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Country</div>
                      <select
                        name="country"
                        {...register("country", { required: true })}
                        value={billingDetails.country}
                        onChange={handleInputChange}
                      >
                        <option>India</option>
                        <option>South Africa</option>
                        <option>United State</option>
                        <option>Australia</option>
                      </select>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Address</div>
                      <input
                        className={`${errors.address ? "error_border" : ""}`}
                        type="text"
                        name="address"
                        {...register("address", {
                          required: true,
                        })}
                        value={billingDetails.address}
                        onChange={handleInputChange}
                        placeholder="Street address"
                      />
                      <span className="error-message">
                        {errors.address && "Please write your address ."}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-12 col-xs-12">
                      <div className="field-label">Town/City</div>
                      <input
                        type="text"
                        className={`${errors.city ? "error_border" : ""}`}
                        name="city"
                        {...register("city", { required: true })}
                        value={billingDetails.city}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.city && "Select one city"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">State / County</div>
                      <input
                        type="text"
                        className={`${errors.state ? "error_border" : ""}`}
                        name="state"
                        {...register("state", { required: true })}
                        value={billingDetails.state}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.state && "Select one state"}
                      </span>
                    </div>
                    <div className="form-group col-md-12 col-sm-6 col-xs-12">
                      <div className="field-label">Postal Code</div>
                      <input
                        type="text"
                        name="pincode"
                        className={`${errors.pincode ? "error_border" : ""}`}
                        {...register("pincode", { pattern: /\d+/ })}
                        value={billingDetails.pincode}
                        onChange={handleInputChange}
                      />
                      <span className="error-message">
                        {errors.pincode && "Required integer"}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col lg="6" sm="12" xs="12">
                {/* Add a coupon are here which will show all the fetched coupons... with checkboxes... */}

                <div className="coupons-container">
                  <h3>Available Coupons</h3>
                  <div className="coupons-list">
                    {coupons.map((coupon, index) => (
                      <div key={index} className="coupon-card">
                        <input
                          type="checkbox"
                          id={`coupon-${index}`}
                          name="coupon"
                          value={coupon.code}
                          className="coupon-checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCoupons([...selectedCoupons, coupon]);
                            } else {
                              setSelectedCoupons(
                                selectedCoupons.filter((selectedCoupon) => selectedCoupon.code !== coupon.code)
                              );
                            }
                          }
                          }
                        />
                        <label htmlFor={`coupon-${index}`} className="coupon-label">
                          <div className="coupon-code">{coupon.code}</div>
                          <div className="coupon-details">
                            <p className="coupon-description">
                              Save ₹{coupon.discountValue} - {coupon.description}
                            </p>
                            <p className="coupon-discount">
                              {coupon.discountType === "fixed"
                                ? `₹${coupon.discountValue} off`
                                : `${coupon.discountValue}% off`}{" "}
                              on minimum purchase of Rs. {coupon.minSpend}
                            </p>
                            {coupon.discountType==='percent' && coupon.maxSpend > 0 && (
                              <p className="coupon-discount">
                                Maximum discount: ₹{coupon.maxSpend}
                              </p>
                            )}

                            <p className="coupon-expiry">
                              Expires on: {new Date(coupon.endDate).toLocaleDateString()} |{" "}
                              {new Date(coupon.endDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>


                  {cartItems && cartItems.length > 0 ? (
                    <div className="checkout-details">
                      <div className="order-box">
                        <div className="title-box">
                          <div>
                            Product <span>Total</span>
                          </div>
                        </div>
                        <ul className="qty">
                          {cartItems.map((item, index) => (
                            <li key={index} className="d-flex flex-row justify-content-between gap-2">
                              <span style={{ width: "75%" }}>
                                {item.productId.title} × {item.quantity}{" "}
                              </span>
                              <span style={{ width: "25%", textAlign: "right" }}>
                                {symbol}
                                {item.productId.price * item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <ul className="sub-total">
                          <li className="d-flex flex-row justify-content-between gap-2 count">
                            <span style={{ width: "75%" }}>Subtotal</span>
                            <span style={{ width: "25%", textAlign: "right" }} className="count">
                              {symbol}
                              {cartTotal}
                            </span>
                          </li>
                          <li className="d-flex flex-row justify-content-between gap-2">
                            <span style={{ width: "75%" }}>Discount</span>
                            <span style={{ width: "25%", textAlign: "right" }}>
                              - {symbol} {currentDiscount}
                            </span>
                          </li>
                        </ul>
                        <ul className="sub-total">
                          <li className="d-flex flex-row justify-content-between gap-2 count">
                            <span style={{ width: "75%" }}>Total</span>
                            <span style={{ width: "25%", textAlign: "right" }} className="count">
                              {symbol}
                              {
                                cartTotal - currentDiscount > 0 ? cartTotal - currentDiscount : 0
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="payment-box">
                        <div className="upper-box">
                          <div className="payment-options">
                            <ul>
                              <li>
                                <div className="radio-option stripe">
                                  <input type="radio" name="payment-group" id="payment-2" defaultChecked={true} onClick={() => checkhandle("cod")} />
                                  <label htmlFor="payment-2">COD</label>
                                </div>
                              </li>
                              {/* <li>
                                <div className="radio-option paypal">
                                  <input type="radio" name="payment-group" id="payment-1" onClick={() => checkhandle("paypal")} />
                                  <label htmlFor="payment-1">
                                    PayPal
                                    <span className="image">
                                      <Media src={paypal.src} alt="" />
                                    </span>
                                  </label>
                                </div>
                              </li> */}
                            </ul>
                          </div>
                        </div>
                        {cartTotal !== 0 ? (
                          <div className="text-end">
                            {payment === "cod" ? (
                              <button type="submit"
                              disabled={placingOrder}
                               className="btn-solid btn">
                                Place Order {placingOrder ? "..." : ""}
                              </button>
                            ) : (
                              <PayPalScriptProvider options={{ clientId: "test" }}>
                                <PayPalButtons
                                  createOrder={(data, actions) => {
                                    return actions.order.create({
                                      purchase_units: [
                                        {
                                          amount: {
                                            value: "1.99",
                                          },
                                        },
                                      ],
                                    });
                                  }}
                                  onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                      const name = details.payer.name.given_name;
                                      alert(`Transaction completed by ${name}`);
                                    });
                                  }}
                                />
                              </PayPalScriptProvider>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CheckoutPage;