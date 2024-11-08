import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Coupon from "@/models/Coupon";

export const GET = async (request: NextRequest) => {
  try {
    await connectToMongoDB();

    const coupons = await Coupon.find();
    if (!coupons) {
      return NextResponse.json(
        { error: "Coupon with this code already exists." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Coupon created successfully!", coupons },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
};
