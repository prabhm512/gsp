// const path = require("path");
const db = require("../models");

// html routes
module.exports = function(app) {
    app.get("/api/nodes", (req, res) => {
        db.Node.findAll({}).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })
};

