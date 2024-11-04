import React, { useEffect, useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import CheckoutPage from "./common/checkout-page";
import Login from "./login";

const Checkout = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setCurrentUser(user);
  }, []);

  return (
    <>
      {currentUser !== null ? (
        <CommonLayout parent="home" title="checkout">
          <CheckoutPage />
        </CommonLayout>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Checkout;
