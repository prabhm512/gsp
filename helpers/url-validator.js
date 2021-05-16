const csv = require('csv-parser');
const fs = require('fs');
const axios = require("axios");
const csvWriter = require('csv-write-stream');

// CSV writer
let writer = csvWriter();
writer.pipe(fs.createWriteStream('valid-urls-test.csv'), {flags: 'a'})

// Store csv data
const data = [];

// Count number of valid rows
let validCntr = 0;
let invalidCntr = 0;

fs.createReadStream('data/gsp_url_mapping1.csv')
    .pipe(csv())
    .on('data', async (row) => {
        // Convert url to string
        let url = row.url.toString();

        await axios.get(url).then((response) => {
            if (response.status == 200) {
                
                validCntr++;
                console.log(row);

                // Write records
                // Add new column that conatains source code of valid url
                // writer.write({node_id: row.node_id, url: row.url, createdAt: row.createdAt, updatedAt: row.updatedAt, html: response.data})
                console.log(response);
            }
        }).catch(err => {
            // Increment invalid url counter
            invalidCntr++;
        }).then(() => {
            console.log("Valid: " + validCntr, "Invalid: " + invalidCntr);
        })
    })

