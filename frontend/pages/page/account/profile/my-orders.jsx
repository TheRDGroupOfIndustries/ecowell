"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Container } from "reactstrap";
import CommonLayout from "../../../../components/shop/common-layout";
import OrderIcon  from "../../../../public/assets/images/pro2/orderIcon.png";
import Link from "next/link";
// import { capitalizeFirstLetter } from "../../../../lib/utils";

const MyOrders = () => {
  return (
    <CommonLayout parent="home" title="My Orders">
      <section className="my-orders-page section-b-space">
        <Container>
          <UserOrders />
        </Container>
      </section>
    </CommonLayout>
  );
};

export default MyOrders;

const UserOrders = () => {
  const { data: session } = useSession();
  const [isNoUserOrders, setIsNoUserOrders] = useState(false);
  const [userOrders, setUserOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-orders");
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const fetchUserOrder = async () => {
      try {
        const response = await fetch(`/api/order/get/${session?.user?._id}`);
        const data = await response.json();
        if (data.status === 404) setIsNoUserOrders(true);
        else setUserOrders(data.orders);
        console.log("User Orders:", data.orders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchUserOrder();
  }, [session]);

  const handleTabChange = (tab) => setActiveTab(tab);
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const filteredOrders =
    userOrders?.filter((order) =>
      activeTab === "all-orders" ? true : order.order_info.status === activeTab
    ) || [];

  const handleCopy = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success("Copied Order ID!");
  };

  if (loading) return <div>Loading...</div>;
  if (isNoUserOrders) return <div>No orders found.</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Order History</h2>

      {/* Tab Navigation */}
      <ul className="nav nav-pills mb-4">
        {[
          "all-orders",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
              style={{
                backgroundColor: activeTab === tab ? "#399b2e" : "",
                color: activeTab === tab ? "#ffffff" : "#399b2e",
              }}
            >
              {capitalizeHeader(tab)}
            </button>
          </li>
        ))}
      </ul>

      {/* Orders List */}
      {filteredOrders.length > 0
        ? filteredOrders.map((order) => (
            <div key={order.order_info.order_id} className="card mb-3">
              <div
                className="card-header d-flex justify-content-between align-items-center"
                onClick={() => toggleOrderDetails(order.order_info.order_id)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center flex-row gap-3">
                  <img
                    src={OrderIcon.src}
                    alt="Order Icon"
                    style={{ width: "50px" }}
                  />
                  <div>
                    <p className="mb-2">
                      <span style={{ color: "#399b2e", fontWeight: "bold" }}>
                        Total:
                      </span>{" "}
                      ₹{order.order_info.total_price.toFixed(2)}
                    </p>
                    <p className="mb-0">
                      <span style={{ color: "#399b2e", fontWeight: "bold" }}>
                        Order Placed at:
                      </span>{" "}
                      {new Date(order.order_info.order_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    className={`badge ${
                      order.order_info.status === "delivered"
                        ? "bg-success"
                        : order.order_info.status === "shipped"
                        ? "bg-primary"
                        : order.order_info.status === "pending"
                        ? "bg-warning"
                        : "bg-danger"
                    } me-3`}
                  >
                    {capitalizeHeader(order.order_info.status)}
                  </span>
                  <span
                    className={`bi ${
                      expandedOrders[order.order_info.order_id]
                        ? "bi-chevron-up"
                        : "bi-chevron-down"
                    }`}
                  ></span>
                </div>
              </div>

              {expandedOrders[order.order_info.order_id] && (
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <p>
                      <span style={{ color: "#399b2e", fontWeight: "bold" }}>
                        Order ID:
                      </span>{" "}
                      {order.order_info.order_id}
                      <button
                        className="btn btn-link text-decoration-none"
                        onClick={() => handleCopy(order.order_info.order_id)}
                        style={{ color: "white" }}
                      >
                        copy
                      </button>
                    </p>
                  </div>
                  <h5>Products:</h5>
                  <ul className="list-group list-group-flush">
                    {order.products.map((product) => (
                      <li
                        key={product.product_id._id}
                        className="list-group-item d-flex align-items-center border-0"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <img
                          src={product.product_id.variants[0].images[0]}
                          alt={product.product_id.title}
                          className="img-thumbnail me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="d-flex flex-col gap-1 flex-column">
                          <Link style={{
                            color: "#0d6efd",
                            textDecoration: "underline",
                          }} href={`/product-details/${product.product_id.sku}`}>
                          <strong>{product.product_id.title}</strong>
                          </Link>
                          <p className="mb-1">
                            Flavor: {product.variant_flavor}
                          </p>
                          <p className="mb-1">Quantity: {product.quantity}</p>
                          <p className="mb-0">Price: ₹{product.product_id.price}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {order.order_info.status === "pending" && (
                    <button className="btn btn-outline-danger mt-3">
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        : `No orders are in ${capitalizeHeader(activeTab)}`}
    </div>
  );
};

export const capitalizeHeader = (str) => {
  return str
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
