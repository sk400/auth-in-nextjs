import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export const POST = async (request: NextRequest) => {
  try {
    // extract the token

    const { token } = await request.json();

    // find the user based on the token

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    // return a error response if the user is not found

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // update user information like isVerified

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;

    // save user to database

    await user.save();

    // return a response that informs that the user is verified

    return NextResponse.json(
      { message: "Email verified successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
