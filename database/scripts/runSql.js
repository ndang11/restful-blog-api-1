import { Pool } from 'pg';
import fs from 'node:fs';
import path from 'node:path';
export { runSql, runSqlFile };


const runSql = async (sql, connectionString) => {
  const pool = new Pool({ connectionString });
  let client;
  try {
    client = await pool.connect();
    await client.query(sql);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

const runSqlFile = async (filePath, connectionString) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await runSql(sql, connectionString);
    console.log(`✅ Executed ${filePath}`);
  } catch (err) {
    console.error(`❌ Error executing ${filePath}:`, err.message);
    throw err;
  }
};

export { runSql, runSqlFile };