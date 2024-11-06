import { connectToMongoDB } from "../../../../utils/db";
import Order from "../../../../models/Order";

export default async function handler(req, res) {
  await connectToMongoDB(); // Connect to MongoDB

  if (req.method === 'GET') {
    const { userId } = req.query; // Get userId from query parameters

    try {
      // Fetch all orders for the specified user from the database
      const userOrders = await Order.find({ user_id: userId });
      res.status(200).json(userOrders);
    } catch (error) {
      // Handle any errors during the fetching process
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to retrieve orders." });
    }
  } else {
    // Respond with 405 Method Not Allowed for other methods
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}