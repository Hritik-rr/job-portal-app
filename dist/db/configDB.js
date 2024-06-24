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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const postgres_migrations_1 = require("postgres-migrations");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const poolConfig = {
    // database: 'postgres',
    // user: 'root',
    // password: 'secret',
    // host: 'localhost',
    // port: 5432,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    // max: Number(process.env.DB_POOL_SIZE),
    // idleTimeoutMillis: Number(process.env.DB_POOL_CLIENT_IDLE_TIMEOUT),
    // connectionTimeoutMillis: Number(process.env.DB_POOL_CLIENT_CONNECTION_TIMEOUT)
};
// console.log(Number(process.env.PORT) + " " + process.env.DB_HOST)
exports.pool = new pg_1.Pool(poolConfig);
// singleton db instance
exports.db = {
    runMigrations: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield exports.pool.connect();
            try {
                yield (0, postgres_migrations_1.migrate)({ client }, path_1.default.resolve(__dirname, 'migrations/sql'));
                console.log("Migration successful");
            }
            catch (error) {
                console.log("migrations failed", error);
            }
            finally {
                client.release();
            }
        });
    }
};
// async function queryDatabase() {
//   try {
//     const res = await pool.query('SELECT * from candidate;');
//     console.log(res.rows[0]);
//     console.log("Hello")
//   } catch (err) {
//     console.error(err);
//   }
// }
// // Call the query function
// queryDatabase();
// const { Pool } = require('pg');
// // Configuration for the PostgreSQL client
// export const pool = new Pool({
// database: 'postgres',
// user: 'root',
// password: 'secret',
// host: 'localhost',
// port: 5432,
// });
// // Example of a function to query the database
// async function queryDatabase() {
//   try {
//     const res = await pool.query('SELECT * from candidate;');
//     console.log(res.rows[0]);
//     console.log("Hello")
//   } catch (err) {
//     console.error(err);
//   }
// }
// // Call the query function
// queryDatabase();
