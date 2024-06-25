import { Request, Response } from "express";
import { pool } from '../db/configDB';
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {SECRET_KEY} from '../middlewares/authentication.middleware';

dotenv.config();

export class AuthController {
  private static generateToken(user: { id: string; role: string }) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: "12h" });
  }

  // Recruiter Login
  public static async loginRecruiter(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM recruiter WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const recruiter = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, recruiter.pwd);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = AuthController.generateToken({ id: recruiter.id, role: 'recruiter' });
      const recID = result.rows[0].id 


      return res.status(200).json({ 
        message: "Login Successful", 
        token, 
        recID
      });
    } catch (error) {
      console.error('Error during login', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Candidate Login
  public static async loginCandidate(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM candidate WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const candidate = result.rows[0];

      const isPasswordValid = await bcrypt.compare(password, candidate.pwd);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = AuthController.generateToken({ id: candidate.id, role: 'candidate' });
      const candidateId = result.rows[0].id 

      return res.status(200).json({ 
        message: "Login Successful",
        token,
        candidateId
       });
    } catch (error) {
      console.error('Error during login', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Recruiter Registration
  public static async registerRecruiter(req: Request, res: Response) {
    const { recName, email, pwd, recDept, recStatus } = req.body;
    // console.log(recStatus)

    try {
      const hashedPassword = await bcrypt.hash(pwd, 10);

      const result = await pool.query(
        'INSERT INTO recruiter (recName, email, pwd, recDept, recStatus) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [recName, email, hashedPassword, recDept, recStatus===undefined?"Active":recStatus]
      );

      const newRecruiter = result.rows[0];

      const token = jwt.sign({ id: newRecruiter.id, role: 'recruiter' }, SECRET_KEY, { expiresIn: '12h' });

      return res.status(201).json({ 
        message: "New Recruiter account created.", 
        token 
      });
    } catch (error) {
      console.error('Error during registration', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Candidate Registration
  public static async registerCandidate(req: Request, res: Response) {
    const { userName, userDept, age, email, pwd, userStatus } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(pwd, 10);

      let profileStatus = true;
      if(userName===undefined || userDept===undefined || age===undefined) {
        profileStatus = false
      } 
      const result = await pool.query(
        'INSERT INTO candidate (userName, userDept, age, email, pwd, userStatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userName, userDept, age, email, hashedPassword, profileStatus===false?"Incomplete Profile":userStatus]
      );

      const newCandidate = result.rows[0];

      const token = jwt.sign({ id: newCandidate.id, role: 'candidate' }, SECRET_KEY, { expiresIn: '12h' });

      return res.status(201).json({ token });
    } catch (error) {
      console.error('Error during registration', error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
