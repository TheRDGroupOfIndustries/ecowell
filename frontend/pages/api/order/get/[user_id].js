import { connectToMongoDB } from "../../../utils/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    // Respond with 405 Method Not Allowed for other methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { user_id } = req.query;

  try {
    await connectToMongoDB();

    // Fetch all orders for the specified user from the database
    const userOrders = await Order.findOne({ user_id: user_id });
    if (!userOrders) {
      return res.status(404).json({ message: "No user orders found." });
    }
    return res.status(200).json(userOrders);
  } catch (error) {
    // Handle any errors during the fetching process
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders." });
  }
}
