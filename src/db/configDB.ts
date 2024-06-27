import path from 'path';
import { Pool } from 'pg';
import {migrate} from 'postgres-migrations'
import * as dotenv from 'dotenv';

dotenv.config();
const poolConfig = {
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    // max: Number(process.env.DB_POOL_SIZE),
    // idleTimeoutMillis: Number(process.env.DB_POOL_CLIENT_IDLE_TIMEOUT),
    // connectionTimeoutMillis: Number(process.env.DB_POOL_CLIENT_CONNECTION_TIMEOUT)
}
// console.log(Number(process.env.PORT) + " " + process.env.DB_HOST)

export const pool = new Pool(poolConfig);

// singleton db instance
export const db = {
    runMigrations: async function(): Promise<void> {
        const client = await pool.connect()
        try {
            await migrate({ client }, path.resolve(__dirname, 'migrations/sql'))
            console.log("Migration successful")
        } catch(error) {
            console.log("migrations failed", error);
        } finally {
            client.release();
        }
    } 
}

