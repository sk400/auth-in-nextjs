import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const decodeToken = (req: NextRequest) => {
  try {
    const encodedToken = req.cookies.get("token")?.value || "";

    const decodedToken: any = jwt.verify(
      encodedToken,
      process.env.TOKEN_SECRET!
    );

    return decodedToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
