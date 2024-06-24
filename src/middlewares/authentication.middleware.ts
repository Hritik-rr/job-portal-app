import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const SECRET_KEY: Secret = process.env.SECRET_KEY || "secret10";

interface DecodedToken {
  id: string;
  role: string;
  // Add other properties from your JWT payload if needed
}

export const authentication = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, SECRET_KEY) as DecodedToken;

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    (req as any).currentUser = {
      id: decode.id,
      role: decode.role,
    };
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
