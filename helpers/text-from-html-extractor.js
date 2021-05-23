const csv = require('csv-parser');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const cheerio = require("cheerio");

// CSV writer
let writer = csvWriter();
writer.pipe(fs.createWriteStream('valid-urls-with-keywords-shortened.csv'), {flags: 'a'})

let cntr = 0;

// Remove all css within body by removing all text within curly braces
function cleanString(dirty) {
    let clean = ""
    let bad = 0

    for (let i=0; i<dirty.length; i++) {
        if (dirty[i] === "{") {
            bad += 1
        }
        else if (dirty[i] === "}") {
            bad -= 1;
        }
        else if (bad === 0) {
            clean += dirty[i];
        }
    }

    return clean;
}
                
fs.createReadStream('./data/gsp_url_mapping1.csv.csv')
    .pipe(csv())
    .on('data', async (row) => {
        // console.log(row);
        const $ = cheerio.load(row.keywords);
        
        // Remove all head tags in html
        $('head').remove();

        // Remove all script tags in html body
        $('script').remove();

        // Remove all style tags
        $('style').remove();

        // store title of page
        // not all pages have a title
        let pageTitle = $('title').text();
        if (pageTitle === "" ) {
            pageTitle = "No Title";
        }

        // Only extract text from remaining body
        let bodyWithoutJS = $('body').text().trim();

        // If no body is detected and string IS NOT html, add same keywords from keyword-scraper.js
        if (bodyWithoutJS === "" && row.keywords.includes("<", 0) === false) {
            writer.write({node_id: row.node_id, url: row.url, title: pageTitle, keywords: row.keywords});
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

            // convert multiple whitespaces into 1 whitespace and remove all CSS from string
            let bodyWithoutJSAndMultipleWhitespaces = bodyWithoutJS.replace(/\s\s+/g, ' ');
            let bodyWithoutJSAndMultipleWhitespaceAndCSS = cleanString(bodyWithoutJSAndMultipleWhitespaces);

            // Convert multi-line text into single line so csv is cleaner
            const strWithoutMulitpleLines = bodyWithoutJSAndMultipleWhitespaceAndCSS.replace(/([^\n]*)\n*/g, '$1');

            // Replace special chars with "" as it causeses problems when csv is imported into mysql
            const strWithoutMulitpleLinesAndSpecialChar = strWithoutMulitpleLines.replace(/[^\w\s]/gi,"");

            writer.write({node_id: row.node_id, url: row.url, title: pageTitle, keywords: strWithoutMulitpleLinesAndSpecialChar});
        }

        cntr++;
        console.log(cntr);
    })
