const { parseHTMLtoJSON, parseSingleHTMLtoJSON } = require('./utils/parseHTMLtoJSON.js');
const fs = require('fs');

// Read the HTML file
const html = fs.readFileSync('./item.html', 'utf-8');
// console.log(html)
// Parse the HTML to JSON
const result = parseSingleHTMLtoJSON(html);
// Save the parsed result to a JSON file
fs.writeFileSync(`./result-${Date.now()}.json`, JSON.stringify(result, null, 2));


// Output the result
console.log(JSON.stringify(result)); 