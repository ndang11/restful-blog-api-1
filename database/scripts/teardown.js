import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import env from '../../src/config/env.js';

const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
});

const runSqlFile = async (filePath) => {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log(`✅ Executed ${filePath}`);
  } catch (err) {
    console.error(`❌ Error executing ${filePath}:`, err.message);
    throw err;
  }
};

const teardownDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('🗑️  Tearing down database...');
    await runSqlFile(path.join(path.dirname('.'), 'database', 'teardown.sql'));
    console.log('🎉 Database torn down successfully!');
  } catch (err) {
    console.error('💥 Database teardown failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

teardownDatabase();

export { teardownDatabase };