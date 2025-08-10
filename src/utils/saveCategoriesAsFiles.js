const fs = require('fs');
const path = require('path');
const { ensureDirectoryExists } = require('./ensureDirectoryExists');

const saveCategoriesAsFiles = (categories, outputDir, folderName = 'Category') => {
  if (!categories || !Array.isArray(categories)) {
    console.log('No categories to save');
    return;
  }

  const categoriesDir = path.join(outputDir, folderName);
  ensureDirectoryExists(categoriesDir);

  categories.forEach((category) => {
    if (!category) {
      console.log('Invalid category found');
      return;
    }

    const fileName = `${category}.txt`;
    const filePath = path.join(categoriesDir, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`Category file ${fileName} already exists, skipping`);
      return;
    }

    try {
      fs.writeFileSync(filePath, '');

      console.log(`Saved category: ${fileName}`);
    } catch (error) {
      console.error(`Error saving category ${category}: ${error.message}`);
    }
  });
};

module.exports = { saveCategoriesAsFiles };
