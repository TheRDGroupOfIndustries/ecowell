import { connectToMongoDB } from "../../../utils/db"; // Adjust the import path if necessary
import Newsletter from "../../../models/Newsletter"; // Import the Newsletter model
import { transporter } from "../../../utils/transporter"; // Import the transporter

export default async function handler(req, res) {
    const { method } = req;

    if (method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    try {
        const { userId, emails } = req.body; // Get userId and emails from the request body

        if (!userId || !emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "userId and an array of emails are required." });
        }

        await connectToMongoDB(); // Connect to MongoDB

        // Check if the user already exists in the newsletter
        const existingSubscription = await Newsletter.findOne({ userId });

        if (existingSubscription) {
            // Add new emails to the existing subscription if they are not already present
            const newEmails = emails.filter(email => !existingSubscription.emails.includes(email));
            if (newEmails.length > 0) {
                existingSubscription.emails.push(...newEmails);
                await existingSubscription.save();
            } else {
                return res.status(409).json({ message: "User  already subscribed with these emails." });
            }
        } else {
            // If the user does not exist, create a new newsletter subscription
            const newSubscription = new Newsletter({ userId, emails });
            await newSubscription.save();
        }

        // Send confirmation emails to all provided email addresses
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender address
            to: emails.join(", "), // List of recipients as a comma-separated string
            subject: "Newsletter Subscription Confirmation", // Subject line
            text: `Hello,

Thank you for subscribing to our newsletter! We're excited to have you on board.

Best regards,
Your Team`, // Plain text body
        };

        await transporter.sendMail(mailOptions); // Send the email

        return res.status(201).json({ message: "User  successfully subscribed to the newsletter." });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return res.status(500).json({ error: "Failed to subscribe to the newsletter." });
    }
}