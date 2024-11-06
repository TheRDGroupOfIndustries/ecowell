import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Link from "next/link";
import { Badge, Button, Card, CardBody, Col, Table } from "reactstrap";
import { sampleOrders } from "@/Data/Order";
import { formatTimestamp } from "@/lib/utils";
import { capitalizeHeader } from "@/lib/utils";

const LatestOrders = () => {
  const allOrders = sampleOrders
    .flatMap((user) =>
      user.orders.map((order) => ({
        order_id: order.order_info.order_id,
        user: user.user_name,
        payment_method: order.order_info.payment_method,
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
    <Col xl="6 xl-100">
      <Card>
        <CommonCardHeader title="Latest Orders" />
        <CardBody>
          <div className="user-status table-responsive latest-order-table">
            <Table borderless>
              <thead>
                <tr>
                  <th scope="col">Order ID</th>
                  <th scope="col">Order Total</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.slice(0, 5).map((order, index) => (
                  <tr key={index}>
                    <td>{order.order_id}</td>
                    <td className="digits">{order.total_price}</td>
                    <td className="font-danger">{order.payment_method}</td>
                    <td className="digits">{order.order_date}</td>
                    <td className="digits">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Link href="/en/sales/orders">
              <Button color="primary">View All Orders</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default LatestOrders;
