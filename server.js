// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');
const logger = require("morgan");
// const session = require("express-session");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

// Bodyparser middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/apiRoutes")(app);

// Starts the server to begin listening
// =============================================================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});