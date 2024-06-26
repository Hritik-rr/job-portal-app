import {z} from 'zod';

export const jobPostSchema = z.object({
    dept: z.string().trim().optional().refine(
        (val) => val!?.length >= 1,
        { message: "Department must be one character or more (if provided)" }
    ),
    jobDesc: z.string().trim().optional(),
    salaryRange: z.string().trim().optional().refine(
      (val) => val?.includes("-") || val === "", // Allow empty string for optional salary
      { message: "Salary range must be in the format 'low-high' or empty (if not provided)" }
    ),
  });

export const jobApplicationSchema = z.object({
    jobId: z.string().min(1, {message: "Job ID is required."})
});  