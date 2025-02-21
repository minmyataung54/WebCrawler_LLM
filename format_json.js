const fs = require('fs');

const filePath ='/Users/minn/Documents/CPE_RAP_2025_LLM/first_CPE_RAP/WebCrawler_LLM/Mawkun.json';

const jsonData = fs.readFileSync(filePath, 'utf8');

const formattedJson = JSON.stringify(JSON.parse(jsonData), null, 2);

fs.writeFileSync(filePath, formattedJson)
