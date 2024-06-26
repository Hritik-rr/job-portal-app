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
const express_1 = __importDefault(require("express"));
const configDB_1 = require("../src/db/configDB");
const dotenv = __importStar(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const route_1 = __importDefault(require("./routes/route"));
route_1.default;
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const port = 3000;
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield configDB_1.pool.query('SELECT NOW()');
    res.send(result.rows[0]);
    // res.send('Hello, TypeScript Node Express!');
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    const checkDB = yield configDB_1.pool.query('select * from candidate');
    if (checkDB.rows[0] === null) {
        yield configDB_1.db.runMigrations().then(() => {
            console.log("Migrations Completed.");
        }).catch(error => {
            console.log("Migrations failed", error);
        });
    }
    console.log(`Server running on port ${port}`);
}));
app.use('/', route_1.default);
// db.runMigrations().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }).catch(error => {
//   console.error('Migration failed', error);
// });
