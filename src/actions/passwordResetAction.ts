"use server";

import { sendEmail } from "@/helpers/sendEmail";
import User from "@/models/User.model";

export const passwordResetAction = async (email: string) => {
  try {
    const userInfo = await User.findOne({ email });

    if (!userInfo) {
      throw new Error("The email doesn't exists");
    }

    const info = await sendEmail({
      userId: userInfo?._id,
      email: userInfo?.email,
      type: "FORGOT-PASSWORD",
      username: userInfo?.username,
    });

    console.log(info);
  } catch (error) {
    console.log(error);
  }
};
