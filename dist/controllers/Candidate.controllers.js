"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const configDB_1 = require("../db/configDB");
class CandidateController {
    static getAvailableJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dept, jobDesc } = req.query;
            try {
                const conditions = [];
                const params = [];
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
                const result = yield configDB_1.pool.query(query, params);
                return res.status(200).json(result.rows);
            }
            catch (error) {
                console.error('Error fetching job listings', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    static applyToJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { jobId } = req.params;
            const { currentUser } = req; // Assuming CustomRequest includes currentUser
            const candidateId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
            // console.log("candidateId " + candidateId);
            // console.log("jobId " + jobId);
            if (!candidateId) {
                return res.status(401).json({ message: "Candidate ID required." });
            }
            // query 1: checks if the jobID exits
            // query 2: checks if the candidate has already applied for the job
            // query 3: insert the new job application entry into the jobApplications table
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
                const result = yield configDB_1.pool.query(query, [jobId, candidateId]);
                const jobExists = (_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.job_exists;
                const alreadyApplied = (_b = result.rows[0]) === null || _b === void 0 ? void 0 : _b.already_applied;
                const applied = (_c = result.rows[0]) === null || _c === void 0 ? void 0 : _c.applied;
                if (!jobExists) {
                    return res.status(404).json({ message: 'Job not found' });
                }
                if (alreadyApplied) {
                    return res.status(409).json({ message: 'You have already applied for this job' });
                }
                if (applied) {
                    return res.status(201).json({ message: 'Successfully applied for the job' });
                }
                else {
                    return res.status(500).json({ message: 'Failed to apply for the job' });
                }
            }
            catch (error) {
                console.error('Error applying for job', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.CandidateController = CandidateController;
