import { NextFunction, Request, Response } from "express";
import { pool } from '../db/configDB';

interface CustomRequest extends Request {
  currentUser?: {
    id: string;
    role: string;
  };
}

export const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { currentUser } = req as CustomRequest;

    if (!currentUser?.id || !currentUser?.role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = currentUser.id;
    const userRole = currentUser.role;

    try {
      let result;

      // Query the respective table based on the user role
      if (userRole === 'recruiter') {
        result = await pool.query('SELECT id FROM recruiter WHERE id = $1', [userId]);
      } else if (userRole === 'candidate') {
        result = await pool.query('SELECT id FROM candidate WHERE id = $1', [userId]);
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error('Database query error', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
