import { connectToMongoDB } from "../../../../utils/db";
import Order from "../../../../models/Order";
import User from "../../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    user_id,
    order_info: {
      payment_method,
      first_name,
      last_name,
      total_price,
      order_date,
      delivery_date,
      shipping_date,
      cancelled_date,
      phone,
      email,
      address,
      city,
      state,
      country,
      pincode,
      status,
    },
    products,
  } = req.body;

  // Validate required fields
  if (
    !user_id ||
    !payment_method ||
    !first_name ||
    !last_name ||
    !total_price ||
    !order_date ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !state ||
    !country ||
    !pincode ||
    !products ||
    products.length === 0
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    await connectToMongoDB();

    // Generate a unique order_id
    let order_id;
    let isUnique = false;

    while (!isUnique) {
      order_id = `ORD-${Date.now()}`;
      const existingOrder = await Order.findOne({
        "order_info.order_id": order_id,
      });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    // Create new order details
    const newOrder = {
      order_info: {
        order_id,
        payment_method,
        first_name,
        last_name,
        total_price,
        order_date: new Date(order_date),
        delivery_date: delivery_date ? new Date(delivery_date) : null,
        shipping_date: shipping_date ? new Date(shipping_date) : null,
        cancelled_date: cancelled_date ? new Date(cancelled_date) : null,
        phone,
        email,
        address,
        city,
        state,
        country,
        pincode,
        status: status || "pending",
      },
      products,
    };
    const userExists = await User.findOne({ _id: user_id });
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exists." });
    }

    let userOrder = await Order.findOne({ user_id });

    if (userOrder) {
      userOrder.orders.push(newOrder);
    } else {
      const user_name = userExists.first_name;
      userOrder = new Order({
        user_id,
        user_name,
        orders: [newOrder],
      });
    }

    await userOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create order" });
  }
}
