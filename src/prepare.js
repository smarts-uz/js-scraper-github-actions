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
      const filteredItems = allItems.filter(item =>
        item.internalLink && item.internalLink.trim() !== ''
      );

      if (filteredItems.length > 0) {
        const outputPath = path.join(__dirname, 'result.json');
        fs.writeFileSync(outputPath, JSON.stringify(filteredItems, null, 2));
        console.log(`Saved ${filteredItems.length} items to ${outputPath}`);
      } else {
        console.log('No items with valid internal link found.');
      }
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
