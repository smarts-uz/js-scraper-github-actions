const { fetchPaginatedData } = require('./fetchPaginatedData');
const { max_page } = require('../config')

const fetchAllData = async (perPage = 100) => {
  try {
    let currentPage = 1;
    let hasMorePages = true;
    let allItems = [];
    let totalItems = 0;

    console.log('Starting to fetch all data...');

    while (hasMorePages && currentPage <= max_page) {
      console.log(`Fetching page ${currentPage}...`);

      try {
        const response = await fetchPaginatedData(currentPage, perPage);

        if (response.data && Array.isArray(response.data)) {
          allItems = [...allItems, ...response.data];

          if (response.pagination && response.pagination.totalItems) {
            totalItems = response.pagination.totalItems;
          }

          console.log(`Fetched ${response.data.length} items so far: ${allItems.length}`);

          hasMorePages = allItems.length < totalItems && response.data.length > 0;
        } else {
          console.warn('Received unexpected data format:', response);
          hasMorePages = false;
        }

        if (hasMorePages) {
          currentPage++;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    console.log(`Completed fetching all data. Total items: ${allItems.length}`);
    return allItems;
  } catch (error) {
    console.error('Error in fetchAllData:', error);
    return [];
  }
};

module.exports = { fetchAllData };
