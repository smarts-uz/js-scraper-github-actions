const { Pool } = require('pg');

const { db_name } = require('../config');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: db_name,
  password: 'admin',
  port: 5432,
});

module.exports = { pool };
