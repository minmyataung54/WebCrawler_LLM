const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const filePath = '/Users/minn/Documents/CPE_RAP_2025_LLM/WebCrawler_LLM/disaster_Links.txt';

function readUrlsFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split(/\r?\n/).filter(url => url.trim() !== ''); 
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

async function scrapePage(url, index) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let content = $('.entry-content.entry.clearfix').text().trim();

        if (!content) {
            throw new Error(`Content is empty for URL: ${url}`);
        }
        content = content.replace(/\s+/g, ' ');
        
        const filename = `New_content_${index + 1}.txt`;
        const filePath = path.join(__dirname, filename);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Content successfully saved to ${filename}`);
    } catch (error) {
        console.error(`Error fetching URL ${url}:`, error.message);
    }
}


async function processUrls() {
    const urls = readUrlsFromFile(filePath);
    if (urls.length === 0) {
        console.error('No URLs found in the file.');
        return;
    }

    for (let i = 0; i < urls.length; i++) {
        await scrapePage(urls[i], i);
    }
}

processUrls();