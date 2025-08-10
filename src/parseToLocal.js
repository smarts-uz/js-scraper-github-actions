const { fetchProductsFromDatabase } = require('./utils/fetchFromDatabase');
const { saveItemsAsFiles } = require('./utils/saveItemsAsFiles');
const { chunkSize = 10, concurrencyLimit = 10 } = require('./config');

const parseToLocal = async (chunkSize = 10, concurrencyLimit = 10) => {
  console.log(`Starting data parsing to local files in chunks of ${chunkSize} with concurrency ${concurrencyLimit}...`);

  let currentPage = 1;
  let totalProcessed = 0;
  let continueFetching = true;
  let chunkCount = 0;

  try {
    while (continueFetching) {
      console.log(`Fetching chunk #${chunkCount + 1} (page ${currentPage})...`);

      const items = await fetchProductsFromDatabase(currentPage);

      if (items.length === 0) {
        continueFetching = false;
        break;
      }

      console.log(`Saving ${items.length} items to local files...`);
      await saveItemsAsFiles(items, concurrencyLimit);
      console.log(`Completed saving chunk #${chunkCount + 1}`);

      totalProcessed += items.length;
      currentPage++;
      chunkCount++;

      console.log(`Processed ${totalProcessed} items so far`);

      if (items.length < chunkSize) {
        continueFetching = false;
      }
    }

    console.log(`Completed processing. Total items processed: ${totalProcessed}`);
  } catch (error) {
    console.error('Error during parsing to local files:', error);
  }
};

if (require.main === module) {
  parseToLocal(chunkSize, concurrencyLimit)
    .then(() => console.log('Parse to local completed'))
    .catch(err => console.error('Failed to parse to local:', err));
}

module.exports = { parseToLocal };
