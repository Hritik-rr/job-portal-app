import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
export const SECRET_KEY: Secret = process.env.SECRET_KEY || "secret10";

// export interface DecodedToken extends Request{
//   id: string;
//   role: string;
// }

export interface CustomRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
  };
}

export const authentication = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decode = jwt.verify(token, SECRET_KEY) as {
      id: string;
      role: string;
    };

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
