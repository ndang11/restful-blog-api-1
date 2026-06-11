import fs from 'fs';
import path from 'path';
import pool from '../../src/config/db.js';

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

const setupDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('🔧 Setting up database...');
    await runSqlFile(path.join(path.dirname('.'), 'database', 'schema.sql'));
    console.log('🎉 Database setup completed successfully!');
  } catch (err) {
    console.error('💥 Database setup failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

setupDatabase();

export { setupDatabase };