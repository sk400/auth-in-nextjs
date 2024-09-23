import { decodeToken } from "@/helpers/decodeToken";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/dbConfig/dbConfig";

connectToDB();

export const GET = async (request: NextRequest) => {
  try {
    const userDataFromToken = decodeToken(request);

    const user = await User.findOne({ _id: userDataFromToken?.id }).select(
      "_id username email isAdmin isVerified"
    );

    return NextResponse.json({ message: "User found", user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
