"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateLoginSchema = void 0;
const zod_1 = require("zod");
exports.candidateLoginSchema = zod_1.z.object({
    email: zod_1.z.string().refine((val) => val.includes('@') && val.length >= 10, {
        message: "Email id must be valid.",
        path: ['email']
    }),
    password: zod_1.z.string().min(4, { message: "Password must be atleast of 4 characters." })
});
