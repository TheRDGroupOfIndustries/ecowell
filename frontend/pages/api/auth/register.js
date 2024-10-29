import { transporter } from "../../../lib/utils";
import { connectToMongoDB } from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { query, method, body } = req;
  // console.log(query, method, req.body);

  if (method === "POST") {
    const { first_name, last_name, email, password, otp, checkOtpCode } = body;

    console.log(first_name, last_name, email, password, otp, checkOtpCode);

    await connectToMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Error : User already exists!");
    }

    let otpCode = checkOtpCode || "";

    if (!otp) {
      console.log("sending otp");

      otpCode = Math.floor(1000 + Math.random() * 9000);
      const body = `<h1 style="color: #333; font-family: 'Arial', sans-serif;">Heya ${first_name}!!</h1>
                    <span style="color: #ccc; font-size: 18px; font-family: 'Arial', sans-serif;">Here's an OTP for your email verification <b style="color: #2fff00;">${otpCode}</b><br /></span>`;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "EcoWell - Verify Email",
        text: "User Email Verification",
        html: body,
      });

      return res
        .status(201)
        .json(otpCode, "Otp has been sent to your email for verification.");
    }

    console.log(otp, " -> ", checkOtpCode);

    if (otp && otp == checkOtpCode) {
      const hashPassword = await bcrypt.hash(password, 5); // converting password into hash-code

      const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashPassword,
      });

      try {
        await newUser.save();
        return res.status(200).json("User Registered successfully!");
      } catch (error) {
        return res.status(500).json("Internal Server Error : " + error);
      }
    } else {
      res
        .status(500)
        .json({ message: `This methon: ${method} is not allowed` });
    }
  }
}
