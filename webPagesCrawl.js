const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://myanmar-now.org/mm/'; // Base URL of the website
const targetDate = '10 October 2024'; // The date you want to filter by
const outputDir = 'articles'; // Directory to save the text files

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

async function scrapePage() {
    try {
        // Step 1: Fetch the list of articles from the main page
        const { data } = await axios.get(baseUrl);
        const $ = cheerio.load(data);

        const articles = [];

        // Step 2: Extract article links and dates
        $('article').each((index, element) => { // Adjust the selector if needed
            const articleDate = $(element).find('span.date.meta-item.tie-icon').text().trim(); // Adjust the date selector
            const articleLink = $(element).find('a').attr('href'); // Adjust the link selector

            if (articleDate === targetDate && articleLink) {
                articles.push(articleLink);
            }
        });

        if (articles.length === 0) {
            throw new Error(`No articles found for the date: ${targetDate}`);
        }

        console.log(`Found ${articles.length} articles for ${targetDate}.`);

        // Step 3: Scrape the content of each article and save it to a file
        for (const link of articles) {
            try {
                const { data: articleData } = await axios.get(link);
                const $article = cheerio.load(articleData);

                // Extract the article content
                const content = $article('.entry-content.entry.clearfix').text().trim(); // Adjust the content selector
                if (!content) {
                    console.warn(`No content found for article: ${link}`);
                    continue;
                }

                // Generate a filename from the article link
                const filename = path.basename(link).replace(/[^a-z0-9]/gi, '_') + '.txt'; // Clean the filename
                const filePath = path.join(outputDir, filename);

                // Save the content to a file
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Saved: ${filePath}`);
            } catch (error) {
                console.error(`Error scraping article ${link}:`, error.message);
            }
        }

        console.log('All articles processed.');
    } catch (error) {
        console.error('Error fetching the page:', error.message);
    }
}

scrapePage();