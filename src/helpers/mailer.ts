import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

type EmailType = "forgotPassword" | "verifyEmail";

interface IEmail {
  email: string;
  emailType: EmailType;
  userId: string;
}

connectToDB();

export const sendEmail = async ({ userId, email, emailType }: IEmail) => {
  try {
    const hashedToken = await bcryptjs.hash(userId, 10);

    if (emailType === "verifyEmail") {
      await User.findByIdAndUpdate(userId.toString(), {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "forgotPassword") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_SENDER_USERID,
        pass: process.env.EMAIL_SENDER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject:
        emailType === "verifyEmail"
          ? "Verify your email address"
          : "Reset your password",
      html: `
        <p>
          ${
            emailType === "verifyEmail"
              ? "Verify your email address"
              : "Reset your password"
          }
        </p>
        <a href="${process.env.DOMAIN}/${
        emailType === "verifyEmail" ? "verify" : "forgot-password"
      }?token=${hashedToken}" target="_blank" rel="noopener noreferrer">
          Click here
        </a>
        <p>If you did not request this email, please ignore it.</p>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log("Error: " + error.message);
  }
};
