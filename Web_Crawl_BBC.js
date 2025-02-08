const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// BBC Burmese URL
const url = "https://www.bbc.com/burmese/topics/c404v08p1wxt";
const totalPage = 200;

// Define date filter (e.g., only scrape articles from 2024)
const filterDate = new Date("2024-09-01"); // Change this to your desired date

async function scrapePage(baseUrl , url, page) {
    if (page > totalPage) {
        return;
    }
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extract posts
        const postdata = [];
        $("div.promo-text").each((i, el) => {
            const title = $(el).find("a").text().trim();
            const dateStr = $(el).find("time").attr("datetime"); // Extract datetime attribute
            const link = $(el).find("a").attr("href");

            if (dateStr) {
                const postDate = new Date(dateStr);

                // Filter only articles after the filterDate
                if (postDate >= filterDate) {
                    postdata.push({ title, date: postDate.toISOString(), link });
                }
            }
        });

        console.log(postdata);

        
        const existingData = fs.existsSync("BBC.json") ? JSON.parse(fs.readFileSync("BBC.json")) : [];
        const updatedData = [...existingData, ...postdata];
        fs.writeFileSync("BBC.json", JSON.stringify(updatedData, null, 2), "utf8");

        // Get the next page URL
        const nextUrl = $('nav > span > a[aria-labelledby="pagination-next-page"]').attr("href");
        
        if (nextUrl && postdata.length > 0) {
            console.log("Next page:", baseUrl + nextUrl);
            scrapePage(baseUrl ,baseUrl + nextUrl, page + 1);
        }

    } catch (error) {
        console.error("Error fetching the page:", error.message);
    }
}

// Start scraping
scrapePage(url ,url, 1);
