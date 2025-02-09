const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// BBC Burmese URL
const url = "https://www.bbc.com/burmese/topics/c404v08p1wxt";
const totalPage = 500;
const filePath = "BBC.json";

// Define date filter (e.g., only scrape articles from 2024)
const filterDate = new Date("2024-09-01"); // Change this to your desired date

const postdata = [];

async function scrapePage(baseUrl , url, page) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

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
        
        if (nextUrl && postdata.length > 0 && page < totalPage) {
            console.log("Next page:", baseUrl + nextUrl);
            scrapePage(baseUrl ,baseUrl + nextUrl, page + 1);
        }else{
            console.log("Scraping completed.");
            // Save filtered data
            fs.appendFileSync(filePath, `${JSON.stringify(postdata)}\n`, "utf8");
        }

    } catch (error) {
        console.error("Error fetching the page:", error.message);
    }
}

if (fs.existsSync(filePath)) {
    // Delete the file if it exists
    fs.unlinkSync(filePath);
  }
// Start scraping
scrapePage(url ,url, 1);
