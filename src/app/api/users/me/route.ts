import connectToDB from "@/dbConfig/dbConfig";
import { decodeToken } from "@/helpers/decodeToken";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

connectToDB();
export const GET = async (req: NextRequest) => {
  try {
    const tokenData = decodeToken(req);

    const user = await User.findOne({ _id: tokenData?.id }).select(
      "username email isAdmin isVerified"
    );

    return NextResponse.json({
      message: "User fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
