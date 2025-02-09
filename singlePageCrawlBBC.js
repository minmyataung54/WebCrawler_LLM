const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// BBC Burmese URL
const url = "https://www.bbc.com/burmese/articles/cx244l5743xo";
const totalPage = 200;

// Define date filter (e.g., only scrape articles from 2024)
const filterDate = new Date("2024-10-20"); // Change this to your desired date

async function scrapePage(baseUrl, url, page) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract posts
    let postdata = "";
    $("p").each((i, el) => {
        const paragraph = $(el).text().trim();
        postdata += paragraph + "\n";
    });

    console.log(postdata);

    // Save filtered data
    fs.appendFileSync("BBC_1.txt", postdata, "utf8");

    // // Get the next page URL
    // const nextUrl = $(
    //     'nav > span > a[aria-labelledby="pagination-next-page"]'
    // ).attr("href");

    // if (nextUrl && postdata.length > 0) {
    //     console.log("Next page:", baseUrl + nextUrl);
    //     scrapePage(baseUrl, baseUrl + nextUrl, page + 1);
    // }
}

// Start scraping
scrapePage(url, url, 1);
