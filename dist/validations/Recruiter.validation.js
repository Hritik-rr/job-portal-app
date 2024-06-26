"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobApplicationSchema = exports.jobPostSchema = void 0;
const zod_1 = require("zod");
exports.jobPostSchema = zod_1.z.object({
    dept: zod_1.z.string().trim().optional().refine((val) => (val === null || val === void 0 ? void 0 : val.length) >= 1, { message: "Department must be one character or more (if provided)" }),
    jobDesc: zod_1.z.string().trim().optional(),
    salaryRange: zod_1.z.string().trim().optional().refine((val) => (val === null || val === void 0 ? void 0 : val.includes("-")) || val === "", // Allow empty string for optional salary
    { message: "Salary range must be in the format 'low-high' or empty (if not provided)" }),
});
exports.jobApplicationSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(1, { message: "Job ID is required." })
});
