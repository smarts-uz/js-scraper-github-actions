const { pool } = require('./db');
const { initDatabase } = require('./initDb');

const saveItemsToDatabase = async (items) => {
  console.log('Saving items to PostgreSQL database...');
  const client = await pool.connect();

  try {
    await initDatabase();

    console.log(`Processing ${items.length} items`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item?.name) continue; // API uses 'name', not 'title'

      if (i % 50 === 0) {
        console.log('Saving item:', item.name);
        console.log(item)
      }

      const query = `
        INSERT INTO actions (
          title, slug, url, image, description, tags, pid, 
          is_verified_owner, version, star_count, contributor_count, 
          source_code, color, type
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14
        )
        ON CONFLICT (url) DO NOTHING
      `;

      const values = [
        item.name || '', // title
        item.slug || null,
        item.url || null, // url
        item.iconSvg || null, // image
        item.description || null,
        item.tags ? JSON.stringify(item.tags) : null, // tags as JSON
        item.pid || null, // pid
        item.isVerifiedOwner ?? null, // is_verified_owner
        item.version || null,
        item.starCount || null, // keep string format
        item.contributorCount?.toString() || null,
        item.sourceCode ? JSON.stringify(item.sourceCode) : null, // source_code JSONB
        item.color || null,
        item.type || null
      ];

      try {
        await client.query(query, values);
      } catch (itemError) {
        console.warn(`Skipping item ${item.name} due to error:`, itemError.message);
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
