var express = require('express');
var router = express.Router();
var pg = require('pg');

// this object configures the connection to the database
var config = {
  database: 'chi',
  host: 'localhost', // where is your database
  port: 5432, // default port number for postgress database
  max: 10, // how many connections at one time
  idleTimeoutMillis: 30000 // 30 seconds to try to connect
};

// connection pool is what allows us to have more than one connection at a time
// allows us to return a connection back to a pool to get reused
var pool = new pg.Pool(config);

router.get('/', function(req,res) {
  // SELECT * FROM books;
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.send(500);
    } else {
      // We connected
      db.query('SELECT * FROM "books";', function(queryError,result) {
        // result is the result from our query
        done(); // releases the connection we have to the pool
        if (queryError) {
          console.log('Error making query');
          res.send(500);
        } else {
          console.log(result);
          res.send(result.rows);
        }
      });
    }
  });
});

module.exports = router;
