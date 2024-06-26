"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableJobsSchema = exports.applyToJobschema = void 0;
const zod_1 = require("zod");
exports.applyToJobschema = zod_1.z.object({
    jobId: zod_1.z.string().min(1, { message: "Job ID is required." })
});
let deptCheck = ['Engineering', 'HR', 'Marketing'];
exports.getAvailableJobsSchema = zod_1.z.object({
    dept: zod_1.z.string()
        .trim() // Remove leading/trailing whitespace
        .optional()
        .refine(val => val === '' || val === undefined || (val && deptCheck.includes(val)), {
        message: 'Department must be one of Engineering, HR, or Marketing (if provided)',
        path: ['dept'], // Optional: Specify the path for better error messages
    }),
    jobDesc: zod_1.z.string().trim().optional(),
});
