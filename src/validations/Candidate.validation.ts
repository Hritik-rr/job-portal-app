import {z} from 'zod';

export const applyToJobschema = z.object({
    jobId: z.string().min(1, {message: "Job ID is required."})
});

let deptCheck: String[] = ['Engineering', 'HR', 'Marketing']
export const getAvailableJobsSchema = z.object({
    dept: z.string()
      .trim() // Remove leading/trailing whitespace
      .optional()
      .refine(val => val === '' || val === undefined || (val && deptCheck.includes(val)), { // Prioritize empty string check
        message: 'Department must be one of Engineering, HR, or Marketing (if provided)',
        path: ['dept'], // Optional: Specify the path for better error messages
      }),
    jobDesc: z.string().trim().optional(),
  });
  