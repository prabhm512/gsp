// const path = require("path");
const db = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

// API Routes
module.exports = function(app) {
    // GET number of nodes in database
    app.get("/api/node-count", (req, res) => {
        db.Node.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('node_id')), 'node_count']
            ]
        }).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })

    // GET all nodes matching with keywords entered by user
    app.get("/api/nodes/:keywords", (req, res) => {
        const keywordArr = req.params.keywords.split(",");
        let queryString = "SELECT * FROM gsp.nodes n WHERE n.keywords LIKE '%" + keywordArr[0] + "%'";

        for (let i=1; i<keywordArr.length; i++) {
            queryString += " AND n.keywords LIKE '%" + keywordArr[i] + "%'";
        };

        db.sequelize.query(queryString, {
            type: db.sequelize.QueryTypes.SELECT
        }).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })
    
    // GET incoming edges of node
    app.get("/api/in-edges/:nodeID", (req, res) => {
        db.sequelize.query('SELECT start_id FROM gsp.edges e WHERE e.end_id=(:id)', {
            replacements: {id: req.params.nodeID},
            type: db.sequelize.QueryTypes.SELECT
        }).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })

    // GET number of outgoing edges of node with incoming edge to X
    app.get("/api/out-edges/:incomingNodeID", (req, res) => {
        db.sequelize.query('SELECT count(end_id) as degree FROM gsp.edges e WHERE e.start_id=(:id)', {
            replacements: {id: req.params.incomingNodeID},
            type: db.sequelize.QueryTypes.SELECT
        }).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })
};

