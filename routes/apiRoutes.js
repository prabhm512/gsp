const fs = require("fs");
const csv = require('csv-parser');

// API Routes
module.exports = function(app) {
    // GET all nodes matching with keywords entered by user
    app.get("/api/nodes/:keywords", (req, res) => {

        const response = [];

        fs.createReadStream('./data/url_id_mapping.csv')
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
    })
    
    // GET incoming edges of node
    app.get("/api/in-edges/:nodeID", (req, res) => {
        const response = [];

        fs.createReadStream('./data/url_graph_file.csv')
            .pipe(csv())
            .on('data', async (row) => {

                if (row.end_id === req.params.nodeID) {
                    response.push({start_id: parseInt(row.start_id)});
                }
            })
            .on('end' , () => {
                res.json(response);
            })
    })

    // GET number of outgoing edges of node with incoming edge to X
    app.get("/api/out-edges/:incomingNodeID", (req, res) => {
        const response = [];
        let cntr = 0;
        fs.createReadStream('./data/url_graph_file.csv')
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
    })
};

