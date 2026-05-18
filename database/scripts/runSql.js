// Utility function to run SQL from a file
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection pool (to be used by other scripts)
// We'll create a pool and export a function that uses it, or we can export the pool and let scripts create their own.
// Since the other scripts are standalone, we'll export a function that takes a file path and runs it using a new pool.
// However, to avoid creating multiple pools, we can create one pool and share it? But the scripts are run separately.
// Let's design it so that each script can use this utility by providing the file path and it will handle the pool.

// We'll create a function that runs a given SQL string using a pool, and then we'll have a wrapper for files.

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

// Function to run SQL from a file
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

module.exports = { runSql, runSqlFile };