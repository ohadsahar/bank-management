const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
let app = require("./app");
const port = process.env.PORT || "3000";
const server = http.createServer(app);
const cors = require('cors')
const dev = require('./dev');

dev.connectMongoDB();
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());
app.set("port", port);
server.listen(port);

module.exports = app;


