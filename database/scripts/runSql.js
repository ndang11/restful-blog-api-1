import fs from 'node:fs';
import pool from '../../src/config/db.js';

const runSql = async (sql) => {
  let client;
  try {
    client = await pool.connect();
    await client.query(sql);
  } finally {
    if (client) {
      client.release();
    }
  }
};

const runSqlFile = async (filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await runSql(sql);
    console.log(`✅ Executed ${filePath}`);
  } catch (err) {
    console.error(`❌ Error executing ${filePath}:`, err.message);
    throw err;
  }
};

export { runSql, runSqlFile };