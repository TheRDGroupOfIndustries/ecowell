// pages/api/Newsletter/check.js
import { connectToMongoDB } from "../../../utils/db";
import Newsletter from "../../../models/Newsletter";
import mongoose from 'mongoose';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== "GET") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "userId is required." });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format" });
        }

        console.log("Attempting to connect to MongoDB...");
        await connectToMongoDB();
        console.log("Connected to MongoDB successfully");

        console.log("Searching for user with ID:", userId);
        const subscription = await Newsletter.findOne({ userId: userId });
        console.log("Subscription found:", subscription);

        if (!subscription) {
            console.log("No subscription found for userId:", userId);
            return res.status(404).json({
                message: "User does not exist in the newsletter.",
                searchedId: userId
            });
        }

        return res.status(200).json({
            message: "User exists in the newsletter.",
            userId: subscription.userId.toString(),
            emails: subscription.emails,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
        });
    } catch (error) {
        console.error("Check newsletter subscription error:", error);
        return res.status(500).json({
            error: "Failed to check newsletter subscription.",
            details: error.message
        });
    }
}