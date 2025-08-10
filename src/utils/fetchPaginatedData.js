const { base_url } = require('../config');
const { parseHTMLtoJSON } = require('./parseHTMLtoJSON');

const createPaginatedUrl = (page = 1) => {
  const url = new URL(`${base_url}${page}/`);
  return url.toString();
};

const fetchPaginatedData = async (page, perPage = 100) => {
  const url = createPaginatedUrl(page);

  try {
    const response = await fetch(url, {
      method: 'GET',
      // headers: {
      //   'Content-Type': 'text/html; charset=UTF-8'
      // }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseText = await response.text();
    const responseJSON = parseHTMLtoJSON(responseText);

    return {
      data: responseJSON || [],
      pagination: {
        currentPage: page,
        totalItems: responseJSON.length * 850 || 0,
        perPage: 20
      }
    };
  } catch (error) {
    throw new Error('Error fetching paginated data: ' + error.message);
  }
};

module.exports = { fetchPaginatedData };