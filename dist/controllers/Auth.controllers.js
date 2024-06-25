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
exports.AuthController = void 0;
const configDB_1 = require("../db/configDB");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
dotenv.config();
class AuthController {
    static generateToken(user) {
        return jwt.sign(user, authentication_middleware_1.SECRET_KEY, { expiresIn: "12h" });
    }
    // Recruiter Login
    static loginRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield configDB_1.pool.query('SELECT * FROM recruiter WHERE email = $1', [email]);
                if (result.rows.length === 0) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const recruiter = result.rows[0];
                const isPasswordValid = yield bcrypt.compare(password, recruiter.pwd);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const token = AuthController.generateToken({ id: recruiter.id, role: 'recruiter' });
                const recID = result.rows[0].id;
                return res.status(200).json({
                    message: "Login Successful",
                    token,
                    recID
                });
            }
            catch (error) {
                console.error('Error during login', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // Candidate Login
    static loginCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield configDB_1.pool.query('SELECT * FROM candidate WHERE email = $1', [email]);
                if (result.rows.length === 0) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const candidate = result.rows[0];
                const isPasswordValid = yield bcrypt.compare(password, candidate.pwd);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                const token = AuthController.generateToken({ id: candidate.id, role: 'candidate' });
                return res.status(200).json({
                    message: "Login Successful",
                    token
                });
            }
            catch (error) {
                console.error('Error during login', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // Recruiter Registration
    static registerRecruiter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { recName, email, pwd, recDept, recStatus } = req.body;
            console.log(recStatus);
            try {
                const hashedPassword = yield bcrypt.hash(pwd, 10);
                const result = yield configDB_1.pool.query('INSERT INTO recruiter (recName, email, pwd, recDept, recStatus) VALUES ($1, $2, $3, $4, $5) RETURNING *', [recName, email, hashedPassword, recDept, recStatus === undefined ? "Active" : recStatus]);
                const newRecruiter = result.rows[0];
                const token = jwt.sign({ id: newRecruiter.id, role: 'recruiter' }, authentication_middleware_1.SECRET_KEY, { expiresIn: '12h' });
                return res.status(201).json({ token });
            }
            catch (error) {
                console.error('Error during registration', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // Candidate Registration
    static registerCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userDept, age, email, pwd, userStatus } = req.body;
            try {
                const hashedPassword = yield bcrypt.hash(pwd, 10);
                let profileStatus = true;
                if (userName === undefined || userDept === undefined || age === undefined) {
                    profileStatus = false;
                }
                const result = yield configDB_1.pool.query('INSERT INTO candidate (userName, userDept, age, email, pwd, userStatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userName, userDept, age, email, hashedPassword, profileStatus === false ? "Incomplete Profile" : userStatus]);
                const newCandidate = result.rows[0];
                const token = jwt.sign({ id: newCandidate.id, role: 'candidate' }, authentication_middleware_1.SECRET_KEY, { expiresIn: '12h' });
                return res.status(201).json({ token });
            }
            catch (error) {
                console.error('Error during registration', error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.AuthController = AuthController;
