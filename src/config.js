const path = require('path');

const db_name = 'aitoptools_com';
const name = 'aitoptools.com';
const base_url = 'https://aitoptools.com/ajaxtool/';
const website_url = "https://aitoptools.com"
const max_page = 12 // SET TO INFINITY LATER

const chunk_size = 10;
const concurrency_limit = 10;
const output_dir = path.join(process.cwd(), "output");
const save_html = false;

module.exports = {
  db_name,
  name,
  base_url,
  max_page,
  website_url,
  chunk_size,
  concurrency_limit,
  output_dir,
  save_html
};
