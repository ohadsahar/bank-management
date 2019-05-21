const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
const port = process.env.PORT || "3000";
const server = http.createServer(app);
const transcationRoute = require('./routes/transactions');
const connection = require('./dev');

connection.connectMongoDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
  });
server.listen(port);


app.use('/admin/bank',transcationRoute);
module.exports = app;


