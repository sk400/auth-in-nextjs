import { NextRequest } from "next/server";

import jwt from "jsonwebtoken";

export const decodeToken = (req: NextRequest) => {
  try {
    const encodedToken = req.cookies.get("token")?.value || "";

    const tokenData: any = jwt.verify(encodedToken, process.env.TOKEN_SECRET!);

    return tokenData;
  } catch (error) {
    console.log((error as Error).message);
  }
};
