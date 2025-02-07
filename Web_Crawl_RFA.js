const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// const url = "https://www.rfa.org/burmese/news";
const url = "https://www.rfa.org/burmese/news/story_archive?b_start:int=2400&year=2024";
const totalPage = 200;

async function scrapePage(url,page) {
    if (page > totalPage) {
        return;
    }
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const postdata = $.extract({
            post: [
                {
                    selector: "div.sectionteaser.archive",
                    value: {
                        title: "span.no_media",
                        date: "span.story_date",
                        link: {
                            selector: "a",
                            value: "href",
                        },
                    },
                },
            ],
        });
        const nextUrl = $("span.last-page.first-last-pages > a").attr("href");
        console.log(postdata);
        console.log(nextUrl);

        fs.appendFileSync("scraped_content2.txt", `${JSON.stringify(postdata)}\n`, "utf8");
        scrapePage(nextUrl, page + 1);
        

        // const $postItem_list = $('li.post-item').find('h2.post-title').text();
        // console.log($postItem_list);
        // for (let i = 0; i < postItem_list.length; i++) {
        //     const element = postItem_list[i];
        //     console.log(element);
        // }

        // const content = $('.entry-content.entry.clearfix').text().trim();
        // console.log(content);

        // if (!content){
        //     throw new Error("Content is empty!");
        // }
        // fs.writeFileSync('scraped_content2.txt', content, 'utf8');
        console.log("Content successfully saved to scraped_content2.txt");
    } catch (error) {
        console.error("Error fetching the page:", error.message);
    }
}

async function firstLoader(url){
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const nextUrl = $("div.gotoarchive > a").attr("href");
    console.log(nextUrl);
}

firstLoader(url);
// scrapePage(url, 1);
