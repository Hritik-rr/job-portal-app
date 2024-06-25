import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import {pool} from '../db/configDB';

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
}