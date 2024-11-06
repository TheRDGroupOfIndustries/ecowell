import { connectToMongoDB } from "../../../utils/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    user_id,
    user_name,
    order_info: {
      order_id,
      payment_method,
      total_price,
      order_date,
      delivery_date,
      shipping_date,
      cancelled_date,
      phone_number,
      shipping_address,
      zip_code,
      status,
    },
    products,
  } = req.body;

  try {
    // validating and creating order details as new order
    const newOrder = {
      order_info: {
        order_id,
        payment_method,
        total_price,
        order_date: new Date(order_date),
        delivery_date: delivery_date ? new Date(delivery_date) : null,
        shipping_date: shipping_date ? new Date(shipping_date) : null,
        cancelled_date: cancelled_date ? new Date(cancelled_date) : null,
        phone_number,
        shipping_address,
        zip_code,
        status: status || "pending",
      },
      products,
    };

    await connectToMongoDB();
    let userOrder = await Order.findOne({ user_id });

    if (userOrder) {
      userOrder.orders.push(newOrder);
    } else {
      userOrder = new Order({
        user_id,
        user_name,
        orders: [newOrder],
      });
    }

    await userOrder.save();

    return res
      .status(200)
      .json({ success: true, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create order" });
  }
}

// : products.map((product) => ({
//   product_id: product.product_id,
//   variant_flavor: product.variant_flavor,
//   quantity: product.quantity,
// }))
