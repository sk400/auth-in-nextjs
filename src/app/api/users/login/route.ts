import connectToDB from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { loginFormSchema } from "@/schemas/loginFormSchema";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDB();

export const POST = async (req: NextRequest) => {
  try {
    // get inputs
    const { email, password } = await req.json();

    // validate using zod

    const validatedFields = loginFormSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: validatedFields.error.message,
        },
        { status: 400 }
      );
    }

    // check if user exists

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          message: "User does not exist. Please signup",
        },
        { status: 404 }
      );
    }

    // check if password is correct

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          message: "Password is incorrect",
        },
        { status: 401 }
      );
    }

    // generate token

    const tokenData = {
      id: user?._id.toString(),
      email: user?.email,
      username: user?.username,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "10m",
    });

    // set the token in the cookie

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
