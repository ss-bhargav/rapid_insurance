import { Pool } from 'pg';
require('dotenv').config();

let conn;

if (!conn) {
  conn = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export default conn;
