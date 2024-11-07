"use client";

import { OrderValues, User as UserType } from "@/Types/Layout";
import { Settings, ShoppingCart, User } from "react-feather";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import DeactivateAccount from "./DeactivateAccount";
import DeleteAccount from "./DeleteAccount";
import Notifications from "./Notifications";
import TabTable from "./TabTable";
import { capitalizeHeader, formatTimestamp } from "@/lib/utils";
import { Badge, CardBody } from "reactstrap";
import Datatable from "@/CommonComponents/DataTable";
import { useEffect, useState } from "react";

const TabProfile = ({ user_id, user }: { user_id: string; user: UserType }) => {
  // console.log("tab", user_id);
  return (
    <div>
      <Tabs>
        <TabList className="nav nav-tabs tab-coupon">
          <Tab className="nav-link">
            <User className="me-2" />
            Profile
          </Tab>
          <Tab className="nav-link">
            <ShoppingCart className="me-2" />
            Orders
          </Tab>
        </TabList>
        <TabPanel>
          <TabTable user={user} />
        </TabPanel>
        <TabPanel>
          Orders
          <UserOrders user_id={user_id} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabProfile;

const UserOrders = ({ user_id }: { user_id?: string }) => {
  // console.log("order", user_id);
  const [isNoUserOrders, setIsNoUserOrders] = useState(false);
  const [userOrders, setUserOrders] = useState<OrderValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchUserOrder = async () => {
      try {
        const response = await fetch(`/api/order/get/user/${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.status === 404) {
          setIsNoUserOrders(true);
          // console.log(data, "isNoUserOrders", isNoUserOrders);
        } else {
          setUserOrders(data);
          setIsNoUserOrders(false);
          setLoading(false);
        }
        // console.log("user orders",data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUserOrder();
  }, []);

  // console.log(isNoUserOrders);

  const coloumns = [
    "order_id",
    "products",
    "total_price",
    "order_date",
    "status",
  ];

  const updateOrderStatus = async (
    user_id: string,
    order_id: string,
    new_status: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/order/update/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          order_id,
          updated_status: new_status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      // console.log("Order status updated successfully:", updatedOrder);
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  };

  const allUserOrders =
    userOrders &&
    userOrders?.orders
      ?.map((order) => {
        const orderId = order.order_info.order_id;
        const userId = userOrders?.user_id;
        const status = orderStatuses[orderId] || order?.order_info?.status;

        const statusColor = {
          pending: "warning",
          processing: "secondary",
          shipped: "primary",
          delivered: "success",
          cancelled: "danger",
        }[status];

        return {
          order_id: orderId,
          products: order.products.length.toString(),
          total_price: "₹" + order.order_info.total_price,
          order_date: formatTimestamp(order.order_info.order_date.toString()),
          status: (
            <div style={{ position: "relative", userSelect: "none" }}>
              <div
                onClick={async () => {
                  const newStatus = prompt("Enter new status:", status);
                  if (newStatus) {
                    // calling the API to update the status in the database
                    const isUpdated = await updateOrderStatus(
                      userId.toString(),
                      orderId.toString(),
                      newStatus
                    );

                    if (isUpdated) {
                      setOrderStatuses((prev) => ({
                        ...prev,
                        [orderId]: newStatus,
                      }));
                    }
                  }
                }}
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
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  {capitalizeHeader(status)}
                </Badge>
                <i className="fa fa-pencil"></i>
              </div>
            </div>
          ),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      );

  return (
    <CardBody className="order-datatable">
      {isNoUserOrders ? (
        "No Orders are made by this user!"
      ) : userOrders && allUserOrders ? (
        <Datatable
          loading={loading}
          multiSelectOption={false}
          myData={allUserOrders}
          pageSize={10}
          pagination={true}
          class="-striped -highlight"
        />
      ) : (
        "Loading..."
      )}
    </CardBody>
  );
};
