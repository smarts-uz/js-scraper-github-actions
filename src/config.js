const path = require('path');
// https://github.com/marketplace?page=1&type=actions
const db_name = 'actions';
const name = 'aitoptools.com';
const website_url = "https://aitoptools.com"
const max_page = 999999999 // SET TO INFINITY LATER
const base_url = "https://github.com/marketplace"
const type = 'actions'

const chunk_size = 10;
const concurrency_limit = 10;
const output_dir = path.join(process.cwd(), "output");
const save_html = false;
// z:\Deploys\github.com Actions\Parsings\
module.exports = {
  db_name,
  name,
  base_url,
  max_page,
  website_url,
  type,
  chunk_size,
  concurrency_limit,
  output_dir,
  save_html
};
