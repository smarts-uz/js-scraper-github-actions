const fs = require('fs');
const path = require('path');
const { pool } = require('./utils/db');
const { fetchAllData } = require('./utils/fetchAllData');

const main = async () => {
  try {
    console.log('Fetching all data from API...');
    const allItems = await fetchAllData();

    if (allItems && allItems.length > 0) {
      // Filter out items without an internal link
      const outputPath = path.join(__dirname, 'result.json');

      console.log(`Saved ${allItems.length} items to ${outputPath}`);
      fs.writeFileSync(outputPath, JSON.stringify(allItems, null, 2));
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    // Close the pool when done
    pool.end();
  }
};

// Execute the script
main();
