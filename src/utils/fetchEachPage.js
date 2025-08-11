const { parseHTMLtoJSON } = require('./parseHTMLtoJSON');

const fetchEachPage = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    const responseText = await response.text();
    return parseHTMLtoJSON(responseText)
  } catch (error) {
    console.error('Error fetching paginated data: ' + error.message);
  }
};

module.exports = { fetchEachPage };