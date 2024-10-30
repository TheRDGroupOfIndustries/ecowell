import { connectToMongoDB } from "../../../../utils/db";
import { Categories } from "../../../../models/Categories";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      await connectToMongoDB();

      const categories = await Categories.find();

      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  } else {
    return res.status(405).json({ message: `Method ${method} not allowed` });
  }
}