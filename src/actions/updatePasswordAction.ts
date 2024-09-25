"use server";

import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";

export const updatePassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    connectToDB();

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    user.password = hashedPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;
    await user.save();

    return {
      success: true,
      message: "Password reset is successful. You can login now.",
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
