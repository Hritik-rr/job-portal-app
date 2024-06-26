import {z} from 'zod';

export const candidateLoginSchema = z.object({
    email: z.string().refine((val) => val.includes('@') && val.length >= 10, {
        message: "Email id must be valid.",
        path:['email']
    }),
    password: z.string().min(4, {message: "Password must be atleast of 4 characters."})
})

export const candidateRegisterSchema = z.object({
    email: z.string().refine((val) => val.includes('@') && val.length >= 10, {
        message: "Email id must be valid.",
        path:['email']
    }),
    pwd: z.string().min(4, {message: "Password must be atleast of 4 characters."})
})


export const recruiterLoginSchema = z.object({
    email: z.string().refine((val) => val.includes('@') && val.length >= 10, {
        message: "Email id must be valid.",
        path:['email']
    }),
    password: z.string().min(4, {message: "Password must be atleast of 4 characters."})
})

export const recruiterRegisterSchema = z.object({
    email: z.string().refine((val) => val.includes('@') && val.length >= 10, {
        message: "Email id must be valid.",
        path:['email']
    }),
    pwd: z.string().min(4, {message: "Password must be atleast of 4 characters."})
})
