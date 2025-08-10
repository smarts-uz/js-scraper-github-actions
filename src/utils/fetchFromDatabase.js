const { pool } = require('./db');

const fetchProductsFromDatabase = async (page = 1, pageSize = 1000000) => {
  const client = await pool.connect();

  try {
    const offset = (page - 1) * pageSize;

    const query = `
      SELECT * FROM actions 
      WHERE is_dead = FALSE OR is_taken = FALSE
      ORDER BY id 
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, [pageSize, offset]);

    return result.rows;
  } catch (error) {
    console.error('Error fetching actions from database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { fetchProductsFromDatabase };
