const fs = require('fs');
const path = require('path');
const { output_dir, save_html } = require('../config')

const { ensureDirectoryExists } = require('./ensureDirectoryExists');
const { saveCategoriesAsFiles } = require('./saveCategoriesAsFiles');
const { saveItemsAsHtmlBatch, markItem } = require('./saveItemsAsHtml');

function folderNameCompatible(input) {
  return input
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^A-Za-z0-9 \-]+/g, '') // keep only letters, digits, space, hyphen
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

const saveItemsAsFiles = async (items, concurrencyLimit = 10) => {
  ensureDirectoryExists(output_dir);

  const urls = [];
  const outputPaths = [];
  const itemIds = [];
  const batchSize = concurrencyLimit;

  for (let index = 0; index < items.length; index++) {
    const item = items[index];

    if (!item) {
      console.log(`Skipping item ${item.title} ID: ${item.id} without website URL`);
      continue;
    }

    const folderName = folderNameCompatible(item.title);

    let rootFolder
    if (item?.tags?.length > 1) {
      rootFolder = item?.tags[0]
    } else {
      rootFolder = 'ALL'
    }

    const itemDir = path.join(output_dir, rootFolder, folderName);

    ensureDirectoryExists(itemDir);

    const urlFilePath = path.join(itemDir, `${folderName}.url`);
    const starsFilePath = path.join(itemDir, `#Stars ${item?.star}.txt`)
    const contributorFilePath = path.join(itemDir, `#Contributors ${item?.contributor}.txt`)
    const iconPath = path.join(itemDir, `${folderName}.svg`)

    if (!fs.existsSync(starsFilePath) && item?.star) {
      fs.writeFileSync(starsFilePath, "")
    }
    if (!fs.existsSync(contributorFilePath) && item?.contributor) {
      fs.writeFileSync(contributorFilePath, "")
    }
    if (!fs.existsSync(iconPath) && item?.image) {
      fs.writeFileSync(iconPath, item?.image)
    }
    if (!fs.existsSync(urlFilePath) && item?.url) {
      const shortcutContent = `[InternetShortcut]\nURL=${item.url}\n`;
      fs.writeFileSync(urlFilePath, shortcutContent);
    }

    if (index % 50 === 0 || index === items.length - 1) {
      console.log(`Saved: ${index + 1}/${items.length} - ${folderName}/website.url`);
    }

    saveCategoriesAsFiles(item.tags, itemDir);

    const outputPath = path.join(itemDir, `${folderName}.html`);

    await markItem(item.id, 'is_taken', true);
    if (save_html) {
      outputPaths.push(outputPath);
      urls.push(item.external_link);
      itemIds.push(item.id);
    }
    if (urls.length === batchSize || index === items.length - 1) {
      console.log(`Processing batch of ${urls.length} items...`);
      await saveItemsAsHtmlBatch(urls, outputPaths, itemIds, batchSize);

      urls.length = 0;
      outputPaths.length = 0;
      itemIds.length = 0;
    }
  }
};

module.exports = { saveItemsAsFiles };
