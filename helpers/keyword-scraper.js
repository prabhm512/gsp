const csv = require('csv-parser');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const getMeta = require("lets-get-meta");

// CSV writer
let writer = csvWriter();
writer.pipe(fs.createWriteStream('valid-urls-with-keywords.csv'), {flags: 'a'})

let cntr = 0;

// const dataArr = [];

fs.createReadStream('./data/gsp_url_mapping1.csv')
    .pipe(csv())
    .on('data', async (row) => {
        // console.log(row);
        const meta = await getMeta(row.html);

        if (meta.keywords) {
            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: meta.keywords});
        } else {
            writer.write({node_id: row.node_id, url: row.url, label: 'WEBPAGE', keywords: row.html});
        }

        // dataArr.push(row);
        
        cntr++;
        console.log(cntr);
        // console.log(meta);
    })
