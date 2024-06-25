import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import {pool} from '../db/configDB';
import { CustomRequest } from '../middlewares/authentication.middleware';

dotenv.config();

export class RecruiterController {
    public static async jobPost(req: Request, res: Response) {
        const {recId} = req.params as {recId: string}
        const {dept, jobDesc, salaryRange} = req.body;

        try {
            const result = await pool.query(
                `INSERT INTO jobListings (recId, dept, jobDesc, salaryRange) VALUES ($1, $2, $3, $4) RETURNING *`,
                [recId, dept, jobDesc, salaryRange]
            );
            // console.log(result);

            return res.status(201).json({message: "New Job posted.", job:result.rows[0]})
        } catch(error) {
            console.error('Error during job posting', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    public static async jobApplicationLogs(req: Request, res: Response) {
        const { jobId } = req.params;
        const { currentUser } = req as CustomRequest;
        const recruiterId = currentUser?.id;
    
        // console.log("Received jobId:", jobId);
        // console.log("Current user:", currentUser);
    
        try {
          if (!recruiterId) {
            return res.status(401).json({ message: "Unauthorized" });
          }
    
          // Verify that the jobId belongs to the recruiter
          const jobResult = await pool.query(
            `SELECT id FROM jobListings WHERE id = $1 AND recId = $2`,
            [jobId, recruiterId]
          );
    
          console.log("Job result:", jobResult.rows);
    
          if (jobResult.rows.length === 0) {
            return res.status(404).json({ message: "Job not found or you are not authorized to view this job's applications." });
          }
    
          // Fetch the candidates who applied for this job
          const result = await pool.query(
            `SELECT ja.candidateId, c.userName, c.userDept, c.age, c.email, jl.dept, jl.jobDesc, jl.salaryRange 
             FROM jobApplications ja 
             INNER JOIN jobListings jl ON jl.id = ja.jobId 
             INNER JOIN candidate c ON c.id = ja.candidateId 
             WHERE ja.jobId = $1 AND jl.recId = $2`,
            [jobId, recruiterId]
          );
    
          console.log("Application result:", result.rows);
    
          if (result.rows.length === 0) {
            return res.status(404).json({ message: "No applications found for this job." });
          }
    
          res.status(200).json({ applications: result.rows });
        } catch (error) {
          console.error("Error fetching job application logs:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
    }
}