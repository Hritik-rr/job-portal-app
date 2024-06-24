import express, { Request, Response } from 'express';
import {pool, db} from '../src/db/configDB'
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
  const result = await pool.query('SELECT NOW()');
  res.send(result.rows[0]);  
  // res.send('Hello, TypeScript Node Express!');
});


app.listen(port, async () => {
  const checkDB = await pool.query('select * from candidate'); 
  if(checkDB.rows[0] === null) {
    await db.runMigrations().then(() => {
      console.log("Migrations Completed.")
    }).catch(error => {
      console.log("Migrations failed", error);
    })
  }
  console.log(`Server running on port ${port}`);
})

// db.runMigrations().then(() => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }).catch(error => {
//   console.error('Migration failed', error);
// });


