import { Request, Response } from 'express';
import { pool } from '../db/configDB';
import { CustomRequest } from '../middlewares/authentication.middleware';

export class CandidateController {
    public static async getAvailableJobs(req: Request, res: Response) {
        const { dept, jobDesc } = req.query; 
        try {
            const conditions: string[] = [];
            const params: any[] = [];

            if (dept) {
                conditions.push(`dept = $${conditions.length + 1}`);
                params.push(dept);
            }

            if (jobDesc) {
                // ILIKE helps in pattern matching
                conditions.push(`jobDesc ILIKE $${conditions.length + 1}`);
                params.push(`%${jobDesc}%`); 
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            const query = `SELECT * FROM jobListings ${whereClause}`;
            const result = await pool.query(query, params);

            return res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching job listings', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    public static async applyToJobs(req: Request, res: Response) {
        const {jobId} = req.params;
        const { currentUser } = req as CustomRequest; // Assuming CustomRequest includes currentUser
        const candidateId = currentUser?.id; 

        // console.log("candidateId " + candidateId);
        // console.log("jobId " + jobId);
        
        if(!candidateId) {
            return res.status(401).json({message: "Candidate ID required."})
        }

        try {
            const query = `
                WITH job_check AS (
                    SELECT recId, 1 AS job_exists 
                    FROM jobListings 
                    WHERE id = $1
                ),
                application_check AS (
                    SELECT 1 AS already_applied 
                    FROM jobApplications 
                    WHERE jobId = $1 AND candidateId = $2
                ),
                insert_application AS (
                    INSERT INTO jobApplications (jobId, recruiterId, candidateId)
                    SELECT $1, recId, $2
                    FROM job_check
                    WHERE job_exists = 1
                    AND NOT EXISTS (SELECT * FROM application_check WHERE already_applied = 1)
                    RETURNING *
                )
                SELECT 
                    (SELECT job_exists FROM job_check) AS job_exists, 
                    (SELECT already_applied FROM application_check) AS already_applied,
                    (SELECT COUNT(*) FROM insert_application) AS applied
            `;

            const result = await pool.query(query, [jobId, candidateId]);

            const jobExists = result.rows[0]?.job_exists;
            const alreadyApplied = result.rows[0]?.already_applied;
            const applied = result.rows[0]?.applied;

            if (!jobExists) {
                return res.status(404).json({ message: 'Job not found' });
            }

            if (alreadyApplied) {
                return res.status(409).json({ message: 'You have already applied for this job' });
            }

            if (applied) {
                return res.status(201).json({ message: 'Successfully applied for the job' });
            } else {
                return res.status(500).json({ message: 'Failed to apply for the job' });
            }
        } catch (error) {
            console.error('Error applying for job', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
