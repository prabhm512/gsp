const csv = require('csv-parser');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const cheerio = require("cheerio");

// CSV writer
let writer = csvWriter();
writer.pipe(fs.createWriteStream('valid-urls-with-keywords-shortened.csv'), {flags: 'a'})

let cntr = 0;

fs.createReadStream('./data/valid-urls-with-keywords.csv')
    .pipe(csv())
    .on('data', async (row) => {

        const $ = cheerio.load(row.keywords);
        
        // Remove all head tags in html
        $('head').remove();

        // Remove all script tags in html body
        $('script').remove();

        // Only extract text from remaining body
        let bodyWithoutJS = $('body').text().trim();

        // If no body is detected and string IS NOT html, add same keywords from keyword-scraper.js
        if (bodyWithoutJS === "" && row.keywords.includes("<", 0) === false) {
            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: row.keywords});
        } 

        // If no body is detected and string IS html, remove row from csv because the page does not contain anything
        else if(bodyWithoutJS === "" && row.keywords.includes("<", 0)) {
            console.log(row.node_id + ": " + row.url + " removed");
        }
        // Remove all rows with this string
        else if (bodyWithoutJS === "This site requires JavaScript and Cookies to be enabled. Please change your browser settings or upgrade your browser.") {
            console.log(row.node_id + ": " + row.url + " removed");
        }
        // Update all rows containing html with just the text within the html body
        else {
            // remove all whitespaces from string
            let bodyWithoutJSAndWhitespaces = bodyWithoutJS.replace(/\s/g, "");

            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: bodyWithoutJSAndWhitespaces});
        }

        cntr++;
        console.log(cntr);
    })
