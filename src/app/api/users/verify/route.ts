import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    connectToDB();

    // get the token from the request

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        {
          message: "Token is required",
        },
        { status: 400 }
      );
    }

    // find the user using the token if token is not expired

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
        },
        { status: 400 }
      );
    }

    // update user verified status

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    await user.save();

    // return response

    return NextResponse.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
