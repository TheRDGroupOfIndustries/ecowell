import { connectToMongoDB } from "../../../utils/db";
import Order from "../../../models/Order";

export default async function handler(req, res) {
  const { method, body } = req;
  //   console.log("check product is in order - req:", method, body);

  if (method === "POST") {
    try {
      const { user_id, product_id } = body;

      await connectToMongoDB();
      const isProductOrder = await Order.findOne({
        user_id,
        "orders.products.product_id": product_id,
      });

      //   console.log("isProductOrder : ", isProductOrder);

      if (!isProductOrder) {
        return res.status(201).json({
          success: false,
          hasOrdered: false,
          message: "User hasn't ordered this product!",
        });
      }

      return res.status(200).json({
        success: true,
        hasOrdered: true,
        message: "User has ordered this product!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        hasOrdered: false,
        message: "Something went wrong!",
      });
    }
  }
}
