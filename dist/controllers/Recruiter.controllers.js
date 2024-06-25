"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RecruiterController = void 0;
const dotenv = __importStar(require("dotenv"));
const configDB_1 = require("../db/configDB");
dotenv.config();
class RecruiterController {
    static jobPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recId } = req.params;
            const { dept, jobDesc, salaryRange } = req.body;
            try {
                const result = yield configDB_1.pool.query(`INSERT INTO jobListings (recId, dept, jobDesc, salaryRange) VALUES ($1, $2, $3, $4) RETURNING *`, [recId, dept, jobDesc, salaryRange]);
                // console.log(result);
                return res.status(201).json({ message: "New Job posted.", job: result.rows[0] });
            }
            catch (error) {
                console.error('Error during job posting', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    static jobApplicationLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { jobId } = req.params;
            const { currentUser } = req;
            const recruiterId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
            // console.log("Received jobId:", jobId);
            // console.log("Current user:", currentUser);
            try {
                if (!recruiterId) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                // Verify that the jobId belongs to the recruiter
                const jobResult = yield configDB_1.pool.query(`SELECT id FROM jobListings WHERE id = $1 AND recId = $2`, [jobId, recruiterId]);
                console.log("Job result:", jobResult.rows);
                if (jobResult.rows.length === 0) {
                    return res.status(404).json({ message: "Job not found or you are not authorized to view this job's applications." });
                }
                // Fetch the candidates who applied for this job
                const result = yield configDB_1.pool.query(`SELECT ja.candidateId, c.userName, c.userDept, c.age, c.email, jl.dept, jl.jobDesc, jl.salaryRange 
             FROM jobApplications ja 
             INNER JOIN jobListings jl ON jl.id = ja.jobId 
             INNER JOIN candidate c ON c.id = ja.candidateId 
             WHERE ja.jobId = $1 AND jl.recId = $2`, [jobId, recruiterId]);
                console.log("Application result:", result.rows);
                if (result.rows.length === 0) {
                    return res.status(404).json({ message: "No applications found for this job." });
                }
                res.status(200).json({ applications: result.rows });
            }
            catch (error) {
                console.error("Error fetching job application logs:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.RecruiterController = RecruiterController;
