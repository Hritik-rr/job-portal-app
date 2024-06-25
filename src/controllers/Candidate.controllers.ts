import { Request, Response } from 'express';
import { pool } from '../db/configDB';

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
}
