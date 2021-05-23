const csv = require('csv-parser');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const getMeta = require("lets-get-meta");

// CSV writer
let writer = csvWriter();
writer.pipe(fs.createWriteStream('valid-urls-with-keywords-shortened1.csv'), {flags: 'a'})

let cntr = 0;

// const dataArr = [];

fs.createReadStream('./data/gsp_url_mapping1.csv')
    .pipe(csv())
    .on('data', async (row) => {
        // console.log(row);
        let keywords = row.keywords.toString();
        // Replace all special characters with ""  
        let keywordsWithoutSpecialChars = keywords.replace(/[^\w\s]/gi,"");

        writer.write({node_id: row.node_id, url: row.url, title: row.title, keywords: keywordsWithoutSpecialChars});

        cntr++;
        console.log(cntr);
    })

