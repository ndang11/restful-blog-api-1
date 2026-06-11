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

const seedDatabase = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('🌱 Seeding database...');
    await runSqlFile(path.join(path.dirname('.'), 'database', 'seed.sql'));
    console.log('🎉 Database seeded successfully!');
  } catch (err) {
    console.error('💥 Database seeding failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
};

seedDatabase();

export { seedDatabase };