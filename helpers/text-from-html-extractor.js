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

        // Update all rows containing html with just the text within the html body
        if (bodyWithoutJS === "") {
            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: row.keywords});
        } else {
            // remove all whitespaces from string
            let bodyWithoutJSAndWhitespaces = bodyWithoutJS.replace(/\s/g, "");

            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: bodyWithoutJSAndWhitespaces});
        }

        cntr++;
        console.log(cntr);
    })
