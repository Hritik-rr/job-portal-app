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
            const { dept, jobDesc } = req.query; // Use req.query to get query parameters
            try {
                const conditions = [];
                const params = [];
                if (dept) {
                    conditions.push(`dept = $${conditions.length + 1}`);
                    params.push(dept);
                }
                if (jobDesc) {
                    conditions.push(`jobDesc ILIKE $${conditions.length + 1}`);
                    params.push(`%${jobDesc}%`); // Add wildcards for partial matching
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
}
exports.CandidateController = CandidateController;
