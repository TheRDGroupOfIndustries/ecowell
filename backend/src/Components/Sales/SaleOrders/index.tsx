"use client";

import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { sampleOrders } from "@/Data/Order";
import { SaleOrdersData } from "@/Data/Sales";
import { capitalizeHeader, formatTimestamp } from "@/lib/utils";
import { Fragment } from "react";
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
      user.orders.map((order) => ({
        order_id: order.order_info.order_id,
        user: user.user_name,
        products: order.products.length.toString(),
        total_price: "₹" + order.order_info.total_price,
        order_date: formatTimestamp(order.order_info.order_date.toString()),
        status: (
          <Badge
            color={
              order.order_info.status === "shipped"
                ? "primary"
                : order.order_info.status === "processing"
                ? "warning"
                : order.order_info.status === "delivered"
                ? "success"
                : "danger"
            }
          >
            {capitalizeHeader(order.order_info.status)}
          </Badge>
        ),
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.order_date).getTime() - new Date(a.order_date).getTime() // Sorting by order_date (latest first)
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
