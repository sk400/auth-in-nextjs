// create a token
// add to the db (verifyemain token and token expiry)
// setup nodemailer
// send token email with a link to verify the email

import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/User.model";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

type EmailType = "VERIFY-EMAIL" | "FORGOT-PASSWORD";

interface Params {
  userId: string;
  email: string;
  type: EmailType;
  username: string;
}

export const sendEmail = async ({ userId, email, type, username }: Params) => {
  try {
    connectToDB();

    const verificationToken = jwt.sign({ userId }, process.env.TOKEN_SECRET!);

    if (type === "VERIFY-EMAIL") {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          verifyToken: verificationToken,
          verifyTokenExpiry: Date.now() + 60 * 60 * 1000,
        }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          forgotPasswordToken: verificationToken,
          forgotPasswordExpiry: Date.now() + 10 * 60 * 1000,
        }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_SENDER_USERID,
        pass: process.env.EMAIL_SENDER_PASSWORD,
      },
    });

    const verifyEmailHTML = `
      <p>Hello, ${username}</p>
      <p>Thank you for creating an account on our website. Please click the link below to verify your email address.</p>
      <p>
        <a href="${process.env.DOMAIN}/verify?token=${verificationToken}">Click here to verify your email</a>
      </p>
      <p>If you did not create an account on our website, please disregard this email and your personal data will not be stored.</p>
      <p>Thank you for your understanding.</p>
      <p>Best regards,</p>
      <p>Saumya</p>
      `;

    const passwordResetHTML = `
      <p>Hello, ${username}</p>
      <br>
      <p>We have received a request to reset your password. If you did not make this request, please disregard this email and your personal data will not be stored.</p>
       <br>
      <p>If you did make this request, click the link below to reset your password.</p>
       <br>
      <p>
        <a href="${process.env.DOMAIN}/reset?token=${verificationToken}">Click here to reset your password</a>
      </p>
       <br>
      <p>Thank you for your understanding.</p>
       <br>
      <p>Best regards,</p>
      <p>Saumya</p>
      `;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `${
        type === "VERIFY-EMAIL" ? "Verify your Email" : "Reset your Password"
      }`,
      html: type === "VERIFY-EMAIL" ? verifyEmailHTML : passwordResetHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log((error as Error).message);
  }
};

// ${process.env.DOMAIN}/verify?token=${verificationToken}
