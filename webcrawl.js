const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://myanmar-now.org/mm/news/60563/';

async function scrapePage() {
    try {
        
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const content = $('.entry-content.entry.clearfix').text().trim();
        if (!content){
            throw new Error("Content is empty!");
        }
        fs.writeFileSync('scraped_content2.txt', content, 'utf8');
        console.log('Content successfully saved to scraped_content2.txt');
    } catch (error) {
        console.error('Error fetching the page:', error.message);
    }
}

scrapePage();