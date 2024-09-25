import { signUpFormSchema } from "@/schemas/signUpFormSchema";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";
import connectToDB from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/sendEmail";

connectToDB();

export const POST = async (req: NextRequest) => {
  try {
    // get the inputs
    const { username, email, password } = await req.json();

    // validate the inputs using zod

    const validatedFields = signUpFormSchema.safeParse({
      username,
      email,
      password,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: validatedFields.error.message },
        { status: 400 }
      );
    }

    // check if user exists

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already exists. Please login" },
        { status: 400 }
      );
    }

    // hash password

    const hashedPassword = await bcryptjs.hash(password, 12);

    // create user

    const savedUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // send verification email

    const mailResponse = await sendEmail({
      userId: savedUser?._id,
      email: savedUser?.email,
      type: "VERIFY-EMAIL",
      username: savedUser?.username,
    });

    console.log(mailResponse);

    // return response
    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
};
