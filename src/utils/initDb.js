const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

const initDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Initializing database...');

    const sqlPath = path.join(__dirname, '../../src/init-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sql);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 