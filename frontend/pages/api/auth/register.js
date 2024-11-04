import {
  transporter,
  sendOtpToPhone,
  verifyOtpFromPhone,
} from "../../../lib/utils";
import { connectToMongoDB } from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { query, method, body } = req;

  if (method !== "POST") {
    return res.status(405).json({ error: `Method ${method} not allowed` });
  }

  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    isEmail,
    otp,
    checkOtpCode,
  } = body;

  // console.log(body);

  await connectToMongoDB();

  if (isEmail) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }
  } else {
    const existingUser = await User.findOne({ phone_number });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }
  }

  let otpCode = checkOtpCode || "";

  if (!otp) {
    if (isEmail) {
      otpCode = Math.floor(100000 + Math.random() * 900000);
      const body = `<h1 style="color: #333; font-family: 'Arial', sans-serif;">Heya ${first_name}!!</h1>
                    <span style="color: #ccc; font-size: 18px; font-family: 'Arial', sans-serif;">Here's an OTP for your email verification <b style="color: #2fff00;">${otpCode}</b><br /></span>`;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "EcoWell - Verify Email",
        text: "User Email Verification",
        html: body,
      });
      return res.status(201).json({
        otpCode,
        message: "Otp has been sent to your email for verification.",
      });
    } else {
      try {
        // send otp to phone number
        const verification = await sendOtpToPhone(phone_number);

        if (verification) {
          return res.status(201).json({
            otpCode: 1234,
            message: "Otp has been sent to your email for verification.",
          });
        } else {
          throw new Error("Failed to send OTP");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }
    }
  }

  if (otp) {
    let newUser;
    if (!isEmail) {
      const isOtpValid = await verifyOtpFromPhone(phone_number, otp);

      if (!isOtpValid) {
        return res.status(400).json({ error: "Invalid OTP" });
      }
      newUser = new User({
        first_name,
        last_name,
        phone_number,
      });
    } else if (otp === checkOtpCode + "") {
      const hashPassword = await bcrypt.hash(password, 5);

      newUser = new User({
        first_name,
        last_name,
        email,
        password: hashPassword,
      });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    try {
      await newUser.save();
      return res.status(200).json({ message: "User Registered successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error: " + error });
    }
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
}
