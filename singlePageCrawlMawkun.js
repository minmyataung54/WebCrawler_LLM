const axios = require("axios");
const cheerio = require("cheerio");
const { createHash } = require("crypto");
const fs = require("fs");

// console.log(process.argv);

async function scrapePage(url, page , id , date , title) {
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract posts
    let postdata = "";
    $("div.single-post-content p").each((i, el) => {
        const paragraph = $(el).text().trim();
        postdata += paragraph + "\n";
    });

    // console.log(postdata);
    const postDate = new Date(date);
    const filename = `Mawkun/Mawkun_${postDate.toISOString().split("T")[0]}_${createHash("md5").update(postdata).digest("hex")}.txt`;
    console.log(filename);
    
    
    // Save filtered data
    // fs.appendFileSync(filename, postdata, "utf8");
    fs.writeFileSync(filename, postdata, 'utf8');
    // console.log("File is saved successfully.");
}

// Start scraping
if(process.argv.length > 2){
    const url = process.argv[2];
    const id = process.argv[3];
    const date = process.argv[4];
    const title = process.argv[5];
    scrapePage(url, 1 , id , date , title);
}
else
{
    const url = "https://mawkun.com/%e1%80%9a%e1%80%b1%e1%80%ac%e1%80%94%e1%80%9a%e1%80%ba%e1%80%80%e1%80%ad%e1%80%af-%e1%80%90%e1%80%ad%e1%80%af%e1%80%80%e1%80%ba%e1%80%95%e1%80%bd%e1%80%b2%e1%80%90%e1%80%bd%e1%80%b1%e1%80%80%e1%80%b0/";
    scrapePage(url, 1 , 0 , "2024-12-17");
}