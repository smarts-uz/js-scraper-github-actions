const cheerio = require('cheerio');

const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\n/g, ' ')       // Replace newlines with spaces
    .replace(/\s+/g, ' ')      // Replace multiple spaces with a single space
    .trim();                   // Remove leading and trailing whitespace
};

const parseHTMLtoJSON = (html) => {
  const $ = cheerio.load(html);
  const tools = [];

  // Find all tool cards
  $('.custom-listing').each((index, element) => {
    const card = $(element);

    // Extract image data
    const imageElement = card.find('.custom-listing-image');
    const imageUrl = imageElement.css('background-image')?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || '';

    // Extract title and links
    const titleElement = card.find('h2');
    const title = normalizeString(titleElement.text());
    const internalLink = card.find('a.tool-link-tool-loop').attr('href') || '';

    // Extract description
    const description = normalizeString(card.find('.custom-listing-content p').text());

    // Extract tags
    const tags = [];
    card.find('.tool-tag a').each((i, tagElement) => {
      tags.push(normalizeString($(tagElement).text()));
    });

    // Extract pricing
    const pricing = normalizeString(card.find('.payment-term').text());

    // Extract popularity
    const popularityElement = card.find('.fas.fa-chart-bar').siblings('span');
    const popularity = normalizeString(popularityElement.text());

    // Build the tool object
    const tool = {
      title,
      internalLink,
      image: imageUrl,
      description,
      tags,
      pricing,
      popularity,
    };

    tools.push(tool);
  });

  return tools;
};

const parseSingleHTMLtoJSON = (html) => {
  const $ = cheerio.load(html);

  // Find all "Visit Site" links with target="_blank" and rel="nofollow"
  const visitSiteLink = $('a:contains("Visit Site")[target="_blank"][rel="nofollow"]').attr('href') || '';

  const tool = {
    externalLink: visitSiteLink
  }

  return tool;
};

module.exports = { parseHTMLtoJSON, normalizeString, parseSingleHTMLtoJSON };
