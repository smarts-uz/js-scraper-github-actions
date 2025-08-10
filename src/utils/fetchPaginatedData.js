const { base_url, type } = require('../config');
const { parseHTMLtoJSON } = require('./parseHTMLtoJSON');

const createPaginatedUrl = (page = 1) => {
  const url = new URL(`${base_url}?page=${page}&type=${type}`);
  return url.toString();
};

const fetchPaginatedData = async (page, perPage = 100) => {
  const url = createPaginatedUrl(page);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(url)
    return {
      data: data.results || [],
      pagination: {
        currentPage: page,
        totalItems: data.totalPages || 0,
        perPage: data?.results?.length || 20
      }
    };
  } catch (error) {
    throw new Error('Error fetching paginated data: ' + error.message);
  }
};

module.exports = { fetchPaginatedData };