import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { transporter } from "../../core";

export const POST = async (request: NextRequest) => {
  const { name, email, password, otp, checkOtpCode } = await request.json();

  console.log(
    name,
    email,
    password,
    otp, checkOtpCode
  );

  await connectToMongoDB();

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return new NextResponse("Error : Admin already exists!", { status: 400 });
  }
  let otpCode = checkOtpCode || "";

  if (!otp) {
    console.log("sending otp");
    
    otpCode = Math.floor(1000 + Math.random() * 9000);
    const body = `<h1 style="color: #333; font-family: 'Arial', sans-serif;">Heya ${name}!!</h1>
    <span style="color: #ccc; font-size: 18px; font-family: 'Arial', sans-serif;">Here's an OTP for your email verification <b style="color: #2fff00;">${otpCode}</b><br /></span>`;

    await transporter.sendMail({
      from: process.env.GMAIL_Admin,
      to: email,
      subject: "EcoWell - Verify Email",
      text: "Email Verification",
      html: body,
    });

    return new NextResponse(JSON.stringify(otpCode), {
      status: 201,
    //   message: "Otp has been sent to your email for verification.",
    });
  }

  console.log(otp, " -> ", checkOtpCode);

  if (otp && otp == checkOtpCode) {
    const hashPassword = await bcrypt.hash(password, 5); // converting password into hash-code

    const newAdmin = new Admin({
      name,
      email,
      password: hashPassword,
    });

    try {
      await newAdmin.save();
      return new NextResponse("Admin Registered successfully!", {
        status: 200,
      });
    } catch (error) {
      return new NextResponse("Internal Server Error : " + error, {
        status: 500,
      });
    }
  }
};