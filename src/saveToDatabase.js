const { pool } = require('./utils/db');
const { fetchEachPage } = require('./utils/fetchEachPage');
const fs = require('fs');
const path = require('path');
const { saveItemsToDatabase } = require('./utils/saveItemstoDatabase');
const { max_page } = require('./config')

const main = async () => {
  try {
    console.log('🚀 Starting data fetching process...');
    console.time('Total Execution Time');

    const result = fs.readFileSync(path.join(__dirname, 'result.json'), 'utf8');
    const results = JSON.parse(result);
    const items = []

    console.log(`📊 Total items to process: ${results.length}`);

    for (const [index, item] of results.entries()) {
      if (index > max_page) break;
      console.log(`🔍 Processing item ${index + 1}/${results.length}: ${item.title}`);

      console.log(`🌐 Fetching details for URL: ${item.internalLink}`);

      const data = await fetchEachPage(item.internalLink);

      const mergedItem = {
        ...item,
        externalLink: data.externalLink
      };
      console.log(`✅ Successfully processed: ${item.title}`);
      items.push(mergedItem)
    }
    console.log(`📥 Saving ${items.length} items to database...`);
    await saveItemsToDatabase(items)
    console.log('✨ Database save completed successfully');

  } catch (error) {
    console.error('❌ Error in main function:', error);
  } finally {
    console.timeEnd('Total Execution Time');
    // Close the pool when done
    pool.end();
    console.log('🏁 Script execution completed');
  }
};

// Execute the script
main();
