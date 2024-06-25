// src/types/express/index.d.ts or similar path (ensure this path is scanned by TypeScript)
import { Request } from "express";

declare module "express-serve-static-core" {
  export interface Request {
    currentUser?: {
      id: string;
      role: string;
    };
  }
}
