const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// console.log(process.argv);

async function scrapePage(url, page , id) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract posts
    let postdata = "";
    $("div.single-post-content p").each((i, el) => {
        const paragraph = $(el).text().trim();
        postdata += paragraph + "\n";
    });

    console.log(postdata);

    // Save filtered data
    fs.appendFileSync(`Mawkun/Mawkun_${id}.txt`, postdata, "utf8");
}

// Start scraping
if(process.argv.length > 2){
    const url = process.argv[2];
    const id = process.argv[3];
    scrapePage(url, 1 , id);
}
else
{
    const url = "https://mawkun.com/%e1%80%9a%e1%80%b1%e1%80%ac%e1%80%94%e1%80%9a%e1%80%ba%e1%80%80%e1%80%ad%e1%80%af-%e1%80%90%e1%80%ad%e1%80%af%e1%80%80%e1%80%ba%e1%80%95%e1%80%bd%e1%80%b2%e1%80%90%e1%80%bd%e1%80%b1%e1%80%80%e1%80%b0/";
    scrapePage(url, 1 , 0);
}