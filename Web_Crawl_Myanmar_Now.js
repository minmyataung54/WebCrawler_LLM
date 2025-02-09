const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://myanmar-now.org/mm/news/category/news/";
const totalPage = 200;

// Define a filter date (e.g., filter articles from 2024)
const filterDate = new Date("2024-01-01");

async function scrapePage(url, page) {
    if (page > totalPage) {
        return;
    }
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const postdata = [];
        $("li.post-item").each((i, el) => {
            const title = $(el).find("h2.post-title").text().trim();
            const dateStr = $(el).find("span.date").text().trim();
            const link = $(el).find("a.more-link").attr("href");

            if (dateStr) {
                // Convert date string to JavaScript Date object
                const postDate = new Date(dateStr);

                // Filter only articles published after filterDate
                if (postDate >= filterDate) {
                    postdata.push({ title, date: postDate.toISOString(), link });
                }
            }
        });

        console.log(postdata);

        const existingData = fs.existsSync("MyanmarNow.json") 
        ? JSON.parse(fs.readFileSync("MyanmarNow.json")) 
        : [];

    const updatedData = [...existingData, ...postdata];

// Sort by date (newest first)
        updatedData.sort((a, b) => new Date(b.date) - new Date(a.date));

// Save as a formatted JSON file
        fs.writeFileSync("MyanmarNow.json", JSON.stringify(updatedData, null, 2), "utf8");

        console.log("Data saved and sorted successfully in MyanmarNow.json");

        // Get the next page URL
        const nextUrl = $("span.last-page.first-last-pages > a").attr("href");
        if (nextUrl && postdata.length > 0) {
            console.log("Next page:", nextUrl);
            scrapePage(nextUrl, page + 1);
        }

    } catch (error) {
        console.error("Error fetching the page:", error.message);
    }
}

// Start scraping
scrapePage(url, 1);
