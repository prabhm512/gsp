// const path = require("path");
const db = require("../models");
const { sequelize } = require("../models");
const fs = require("fs");
const csv = require('csv-parser');

// API Routes
module.exports = function(app) {
    // GET all nodes matching with keywords entered by user
    app.get("/api/nodes/:keywords", (req, res) => {
        // const keywordArr = req.params.keywords.split(",");
        // let queryString = "SELECT * FROM gsp.nodes n WHERE n.keywords LIKE '%" + keywordArr[0] + "%'";

        // for (let i=1; i<keywordArr.length; i++) {
        //     queryString += " AND n.keywords LIKE '%" + keywordArr[i] + "%'";
        // };

        const response = [];

        fs.createReadStream('./data/valid-urls-with-keywords-shortened1.csv')
            .pipe(csv())
            .on('data', (row) => {
                var str = req.params.keywords;

                var pattern = new RegExp("\\b" + str.replace(/ +/g, "\\b.*\\b") + "\\b", "i");

                if(row.keywords.match(pattern)) {
                    // parser was not reading row.nodeID so Object.values(row)[0] had to be used
                    response.push({nodeID: Object.values(row)[0], url: row.url});
                }
            })
            .on('end', () => {
                res.json(response);
            })

        // db.sequelize.query(queryString, {
        //     type: db.sequelize.QueryTypes.SELECT
        // }).then(response => {
        //     res.json(response);
        // }).catch(err => {
        //     res.send('error: ' + err);
        // })
    })
    
    // GET incoming edges of node
    app.get("/api/in-edges/:nodeID", (req, res) => {
        const response = [];

        fs.createReadStream('./data/gsp_edges.csv')
            .pipe(csv())
            .on('data', async (row) => {

                if (row.end_id === req.params.nodeID) {
                    response.push({start_id: parseInt(row.start_id)});
                }
            })
            .on('end' , () => {
                res.json(response);
            })
        // db.sequelize.query('SELECT start_id FROM gsp.edges e WHERE e.end_id=(:id)', {
        //     replacements: {id: req.params.nodeID},
        //     type: db.sequelize.QueryTypes.SELECT
        // }).then(response => {
        //     res.json(response);
        // }).catch(err => {
        //     res.send('error: ' + err);
        // })
    })

    // GET number of outgoing edges of node with incoming edge to X
    app.get("/api/out-edges/:incomingNodeID", (req, res) => {
        const response = [];
        let cntr = 0;
        fs.createReadStream('./data/gsp_edges.csv')
            .pipe(csv())
            .on('data', async (row) => {

                if (row.start_id === req.params.incomingNodeID) {
                    // Count number of rows retrieved
                    cntr++;
                }
            })
            .on('end' , () => {
                response.push({degree: cntr});
                res.json(response);
            })

        // db.sequelize.query('SELECT count(end_id) as degree FROM gsp.edges e WHERE e.start_id=(:id)', {
        //     replacements: {id: req.params.incomingNodeID},
        //     type: db.sequelize.QueryTypes.SELECT
        // }).then(response => {
        //     res.json(response);
        // }).catch(err => {
        //     res.send('error: ' + err);
        // })
    })
};

