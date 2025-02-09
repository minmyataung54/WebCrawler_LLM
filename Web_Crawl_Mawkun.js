const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// BBC Burmese URL
const url = "https://mawkun.com/category/%e1%80%9e%e1%80%90%e1%80%84%e1%80%ba%e1%80%b8/";
const totalPage = 800;
const filePath = "Mawkun.json";

// Define date filter (e.g., only scrape articles from 2024)
const filterDate = new Date("2024-09-01"); // Change this to your desired date

const postdata = [];

async function scrapePage(baseUrl , url, page) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $("div.card").each((i, el) => {
            const title = $(el).find("h3").text().trim();
            const dateStr = $(el).find("small").text().trim(); // Extract datetime attribute
            const link = $(el).find("a.archive-cat-read-more").attr("href");

            if (dateStr) {
                const dateFormat = Date.parse(dateStr);
                // console.log(dateFormat);
                
                const postDate = new Date(dateFormat);

                // Filter only articles after the filterDate
                if (postDate >= filterDate) {
                    postdata.push({ title, date: postDate.toISOString(), link });
                }
            }
        });

        // console.log(postdata);

        
        // const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
        // const updatedData = [...existingData, ...postdata];
        // fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), "utf8");

        // Get the next page URL
        const nextUrl = $('a.next').attr("href");
        
        if (nextUrl && postdata.length > 0 && page < totalPage) {
            console.log("Next page:", nextUrl);
            scrapePage(baseUrl , nextUrl, page + 1);
        }else{
            console.log("Scraping completed.");
            // Save filtered data
            console.log(postdata);
            
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
