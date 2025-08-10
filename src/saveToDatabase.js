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

    const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'result.json'), 'utf8'))
    const items = []

    console.log(`📊 Total items to process: ${results.length}`);

    for (const [index, item] of results.entries()) {
      if (index > max_page) break;
      console.log(`🔍 Processing item ${index + 1}/${results.length}: ${item.name}`);
      const itemUrl = `https://github.com/marketplace/actions/${item.slug}`

      console.log(`🌐 Fetching details for URL: ${itemUrl}`);

      const data = await fetchEachPage(itemUrl);
      console.log(item, data)
      const mergedItem = {
        ...item,
        version: data?.version,
        starCount: data?.starCount,
        contributorCount: data?.contributorCount,
        sourceCode: data?.sourceCode || {},
        url: itemUrl,
        tags: data?.tags || []
      };

      console.log(`✅ Successfully processed: ${item.name}`);
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
