const { pool } = require('./db');
const { initDatabase } = require('./initDb');

const saveItemsToDatabase = async (items) => {
  console.log('Saving items to PostgreSQL database...');
  const client = await pool.connect();

  try {
    await initDatabase();

    console.log(`Processing ${items.length} items`);

    for (const item of items) {
      if (!item?.title) continue;

      if (items.indexOf(item) % 50 === 0) {
        console.log('Saving item:', item.title);
      }

      const query = `
        INSERT INTO products (
          title, internal_link, external_link, 
          image, description, tags, 
          pricing, popularity
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        )
          on conflict (internal_link) do nothing
      `;

      const values = [
        item.title || '',
        item.internalLink || null,
        item.externalLink || null,
        item.image || null,
        item.description || null,
        item.tags ? JSON.stringify(item.tags) : null,
        item.pricing || null,
        item.popularity || null,
      ];

      try {
        await client.query(query, values);
      } catch (itemError) {
        console.warn(`Skipping item ${item.title} due to error:`, itemError.message);
        continue;
      }
    }

    await client.query('COMMIT');
    console.log(`Successfully saved ${items.length} items to database`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving items to database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { saveItemsToDatabase };
