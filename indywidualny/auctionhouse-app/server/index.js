// mySQL BEGIN
const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');
// mySQL END

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'student',
  password: 'SuperUJ',
  database: 'auctionhouse'
});

connection.connect();

const port = process.env.PORT || 3001;

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(events(connection))
  .use(express.static(path.join(__dirname, "..", "build")))
  .use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});