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
exports.authorization = void 0;
const configDB_1 = require("../db/configDB");
// interface CustomRequest extends Request {
//   currentUser?: {
//     id: string;
//     role: string;
//   };
// }
const authorization = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentUser } = req;
        // console.log("auth test " + JSON.stringify(currentUser))
        if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const userId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
        const userRole = currentUser === null || currentUser === void 0 ? void 0 : currentUser.role;
        try {
            let result;
            // Query the respective table based on the user role
            if (userRole === 'recruiter') {
                result = yield configDB_1.pool.query('SELECT id FROM recruiter WHERE id = $1', [userId]);
            }
            else if (userRole === 'candidate') {
                result = yield configDB_1.pool.query('SELECT id FROM candidate WHERE id = $1', [userId]);
            }
            else {
                return res.status(403).json({ message: "Forbidden" });
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!roles.includes(userRole)) {
                return res.status(403).json({ message: "Forbidden" });
            }
            next();
        }
        catch (error) {
            console.error('Database query error', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
};
exports.authorization = authorization;
