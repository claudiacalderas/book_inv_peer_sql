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
      db.query('SELECT * FROM "books" ORDER BY "id" DESC;', function(queryError,result) {
        // result is the result from our query
        done(); // releases the connection we have to the pool
        if (queryError) {
          console.log('Error making query');
          res.send(500);
        } else {
          //console.log(result);
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/add', function(req,res) {
  console.log(req.body);
  var title = req.body.title;
  var author = req.body.author;
  var publisher = req.body.publisher;
  var year = req.body.year;
  // INSERT INTO books (author,title) VALUES ('David Mitchel','Cloud Atlas');
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.send(500);
    } else {
      // We connected
      db.query('INSERT INTO "books" ("author","title","publisher","year") VALUES ($1,$2,$3,$4);',
      [author,title,publisher,year], function(queryError,result) {
        // result is the result from our query
        done(); // releases the connection we have to the pool
        if (queryError) {
          console.log('Error making query');
          res.send(500);
        } else {
          //console.log(result);
          res.sendStatus(201); // succesful insert status
        } //else
      }); //db.query
    } //else
  }); //router.post
});

router.put('/update/:id', function(req,res) {
    var id = parseInt(req.params.id);
    var title = req.body.title;
    var author = req.body.author;
    var publisher = req.body.publisher;
    var year = req.body.year;
    // UPDATE "books" SET "author"='John' ,"title"='Rogue',"publisher"='Mac',"year"=1903 WHERE "id" = 1;
    pool.connect(function(errorConnectingToDatabase,db,done) {
      if(errorConnectingToDatabase) {
        console.log('Error connecting to the database');
        res.send(500);
      } else {
        // We connected
        db.query('UPDATE "books" SET "author"=$1 ,"title"=$2,"publisher"=$3,"year"=$4 WHERE "id" = $5;',
        [author,title,publisher,year,id], function(queryError,result) {

          // result is the result from our query
          done(); // releases the connection we have to the pool
          if (queryError) {
            console.log('Error making query');
            res.send(500);
          } else {
            //console.log(result);
            res.sendStatus(201); // succesful insert status
          } //else
        }); //db.query
      }//else
    });
});

router.delete('/delete/:id', function(req,res) {
  var id = parseInt(req.params.id);
  // DELETE FROM "books" WHERE "id" = 47;
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
      res.send(500);
    } else {
      // We connected
      db.query('DELETE FROM "books" WHERE "id" = $1',[id], function(queryError,result) {

        // result is the result from our query
        done(); // releases the connection we have to the pool
        if (queryError) {
          console.log('Error making query');
          res.send(500);
        } else {
          //console.log(result);
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
