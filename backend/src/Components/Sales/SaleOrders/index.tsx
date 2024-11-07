"use client";

import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { sampleOrders } from "@/Data/Order";
// import { SaleOrdersData } from "@/Data/Sales";
import { capitalizeHeader, formatTimestamp } from "@/lib/utils";
import { Fragment, useState } from "react";
import { Badge, Card, CardBody, Col, Container, Row } from "reactstrap";

const SalesOrders = () => {
  const coloumns = [
    "order_id",
    "user",
    "products",
    "total_price",
    "order_date",
    "status",
  ];

  const allOrders = sampleOrders
    .flatMap((user) =>
      user.orders.map((order) => {
        const [status, setStatus] = useState(order.order_info.status);
        const [isEditing, setIsEditing] = useState(false);

        const statusColor = {
          pending: "warning",
          processing: "secondary",
          shipped: "primary",
          delivered: "success",
          cancelled: "danger",
        }[status];

        const orderIndex = user.orders.indexOf(order);

        return {
          order_id: order.order_info.order_id,
          user: user.user_name,
          products: order.products.length.toString(),
          total_price: "₹" + order.order_info.total_price,
          order_date: formatTimestamp(order.order_info.order_date.toString()),
          status: (
            <div style={{ position: "relative", userSelect: "none" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Badge
                  title={capitalizeHeader(status)}
                  color={statusColor}
                  onClick={() => setIsEditing(!isEditing)}
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  {capitalizeHeader(status)}
                </Badge>
                <span
                  style={{
                    cursor: "pointer",
                    transform: isEditing ? "rotate(180deg)" : "",
                  }}
                >
                  &#9660;
                </span>
              </div>
              {isEditing && (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "2px gray solid",
                    padding: "4px",
                    position: "absolute",
                    top: orderIndex < 3 ? "110%" : undefined,
                    bottom: orderIndex >= 3 ? "110%" : undefined,
                    display: "grid",
                    gap: "1px",
                    left: "0",
                    zIndex: 1,
                  }}
                >
                  <Badge
                    title="Pending"
                    color="warning"
                    onClick={() => {
                      setStatus("pending");
                      setIsEditing(!isEditing);
                    }}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                  >
                    Pending
                  </Badge>
                  <Badge
                    title="Processing"
                    color="secondary"
                    onClick={() => {
                      setStatus("processing");
                      setIsEditing(!isEditing);
                    }}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                  >
                    Processing
                  </Badge>
                  <Badge
                    title="Shipped"
                    color="primary"
                    onClick={() => {
                      setStatus("shipped");
                      setIsEditing(!isEditing);
                    }}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                  >
                    Shipped
                  </Badge>
                  <Badge
                    title="Delivered"
                    color="success"
                    onClick={() => {
                      setStatus("delivered");
                      setIsEditing(!isEditing);
                    }}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                  >
                    Delivered
                  </Badge>
                  <Badge
                    title="Cancelled"
                    color="danger"
                    onClick={() => {
                      setStatus("cancelled");
                      setIsEditing(!isEditing);
                    }}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                  >
                    Cancelled
                  </Badge>
                </div>
              )}
            </div>
          ),
        };
      })
    )
    .sort(
      (a, b) =>
        new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
    );

  return (
    <Fragment>
      <CommonBreadcrumb title="Orders" parent="Sales" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Manage Order" />
              <CardBody className="order-datatable">
                <Datatable
                  multiSelectOption={false}
                  myData={allOrders}
                  pageSize={10}
                  pagination={true}
                  class="-striped -highlight"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default SalesOrders;
