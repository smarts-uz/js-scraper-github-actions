const { parseSingleHTMLtoJSON } = require('./parseHTMLtoJSON');

const fetchEachPage = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseText = await response.text();
    return parseSingleHTMLtoJSON(responseText)
  } catch (error) {
    throw new Error('Error fetching paginated data: ' + error.message);
  }
};

module.exports = { fetchEachPage };