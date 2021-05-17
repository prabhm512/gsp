// const path = require("path");
const db = require("../models");
const { Op } = require("sequelize");

// html routes
module.exports = function(app) {
    app.get("/api/nodes", (req, res) => {
        db.Node.findAll({}).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })

    app.get("/api/nodes/:keywords", (req, res) => {
        console.log(req.params.keywords);
        db.Node.findAll({
            where: {
                keywords: {
                    [Op.like]: "%" + req.params.keywords + "%"
                }
            }
        }).then(response => {
            res.json(response);
        }).catch(err => {
            res.send('error: ' + err);
        })
    })
};

