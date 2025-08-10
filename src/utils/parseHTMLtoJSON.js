const cheerio = require('cheerio');

const normalizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

const parseHTMLtoJSON = (html) => {
  const $ = cheerio.load(html);

  const version = normalizeString($('[title^="v"]').first().text());

  const tags = [];
  $('[data-testid="tags"] .topic-tag').each((i, el) => {
    tags.push(normalizeString($(el).text()));
  });


  // Star count
  let starCount = '';
  const starBtnText = $('[data-testid="star-button"]').text();
  if (starBtnText) {
    const match = starBtnText.match(/Star\s*([\d.,Kk]+)/);
    if (match) starCount = match[1];
  }

  // Contributor count
  let contributorCount = '';
  $('[href$="/graphs/contributors"], .contributors, a:contains("contributors")').each((i, el) => {
    const numMatch = normalizeString($(el).text()).match(/([\d.,Kk]+)/);
    if (numMatch) contributorCount = numMatch[1];
  });

  // Source code info from "View source code" link
  let repoUrl = '';
  let owner = '';
  let repoName = '';

  const viewSourceLink = $('a:contains("View source code")').attr('href');
  if (viewSourceLink) {
    repoUrl = `https://github.com${viewSourceLink}`;
    const parts = viewSourceLink.split('/');
    if (parts.length >= 3) {
      owner = parts[1];
      repoName = parts[2];
    }
  }

  return {
    version,
    tags: [...new Set(tags)],
    starCount,
    contributorCount,
    sourceCode: {
      repoUrl,
      owner,
      repoName
    }
  };
};

module.exports = { parseHTMLtoJSON, normalizeString };
