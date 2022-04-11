// mySQL BEGIN
const express = require('express');
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./events');
// mySQL END

const db_config = {
  host: 'localhost',
  user: 'student',
  password: 'SuperUJ',
  database: 'auctionhouse'
};
let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

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