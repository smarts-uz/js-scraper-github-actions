const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { pool } = require('./db');
const pLimit = require('p-limit');

const markItem = async (itemId, column = 'is_dead', value = true) => {
  try {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE actions SET ${column} = ${value}, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [itemId]
      );
      console.log(`Marked item #${itemId} as ${column} in database`);
    } finally {
      client.release();
    }
  } catch (dbError) {
    console.error(`Failed to update database for dead item #${itemId}:`, dbError.message);
  }
}

const saveWithRetry = async (url, outputPath, itemId, maxRetries = 3) => {
  if (!url || !outputPath) {
    console.log(url, outputPath)
    console.error('Invalid input: URL and outputPath are required');
    return;
  }

  const dir = path.dirname(outputPath);
  let retries = 0;

  while (retries < maxRetries) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(outputPath)) {
        return console.log(`HTML file already exists for ${url}, skipping...`);
      }

      const command = `monolith "${url}" -o "${outputPath}" --no-video --no-audio --timeout 30`;

      await new Promise((resolve, reject) => {
        const child = exec(command, async (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          if (stderr) {
            console.warn(`Warning: ${stderr}`);
          }
          console.log(`Successfully saved HTML to ${outputPath}`);

          if (itemId) {
            await markItem(itemId, 'pid', child.pid);
          }

          resolve();
        });
      });

      return; // Success, exit the loop
    } catch (error) {
      retries++;
      console.log(`Retry ${retries}/${maxRetries} for ${url}`);

      if (retries >= maxRetries) {
        console.error(`Failed to save HTML after ${maxRetries} attempts:`, error.message);

        const deadPath = path.join(dir, '@Dead.txt');
        fs.writeFileSync(deadPath, "dead");

        if (itemId) {
          await markItem(itemId, 'is_dead', true);
        }

        return;
      }

      const backoffTime = 1000 * Math.pow(2, retries);
      console.log(`Waiting ${backoffTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
};

const saveItemsAsHtmlBatch = async (urls, outputPaths, itemIds, concurrencyLimit) => {
  if (!urls?.length || !outputPaths?.length) {
    console.error('Invalid input: URLs and outputPaths arrays are required');
    return;
  }

  console.log(`Processing ${urls.length} items with concurrency limit of ${concurrencyLimit}`);
  const limit = pLimit.default(concurrencyLimit);

  const promises = urls.map((url, index) => {
    return limit(() => saveWithRetry(url, outputPaths[index], itemIds[index]));
  });

  await Promise.all(promises);
  console.log(`Completed batch processing of ${urls.length} items`);
};

module.exports = { saveWithRetry, saveItemsAsHtmlBatch, markItem };
