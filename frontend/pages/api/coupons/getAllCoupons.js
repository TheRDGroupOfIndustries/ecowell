import { connectToMongoDB } from "../../../utils/db";
import Coupon from "../../../models/Coupon";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      await connectToMongoDB();

      const coupons = await Coupon.find();
      if (coupons.length === 0) {
        return res.status(404).json({ error: "No coupons found." });
      }

      return res.status(200).json({
        message: "Coupons retrieved successfully!",
        coupons,
      });
    } catch (error) {
      console.error("Error retrieving coupons:", error);
      return res.status(500).json({
        error: "Failed to retrieve coupons",
      });
    }
  } else {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}