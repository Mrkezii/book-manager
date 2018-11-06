var express = require("express");
var router = express.Router();
const redis = require("redis");
let client = redis.createClient();

/* GET all books listing. */
router.get("/", function(req, res) {
  client.lrange("books", 0, -1, function(err, obj) {
    if (!obj || obj.length === 0) {
      res.send("No books hav been added");
    } else {
      // obj.id = id;
      // const objj = JSON.parse(obj);
      console.log(obj);
      res.json(obj);
      obj.map(book => {
        client.hgetall(book, function(err, reply) {
          console.log(reply);
        });
      });
    }
  });
});

// Get individual book
router.get("/:bookId", function(req, res) {
  client.hgetall(req.params.bookId, function(err, obj) {
    if (!obj) {
      res.send(404);
      console.log("Book Does not exist");
    } else {
      res.send(obj);
    }
  });
});

//  Add new Book
router.post("/add", function(req, res) {
  let bookDetails = {
    id: req.body.id,
    author: req.body.author,
    title: req.body.title,
    summary: req.body.summary
  };
  client.incr("bookId", function(err, bookId) {
    client.HMSET(`book:${bookId}`, bookDetails, function(err, reply) {
      if (err) {
        console.log("there is an error", err);
      }
      console.log(reply);
      res.send("okss");

      // Push Book id's to book list
      client.LPUSH("books", `book:${bookId}`);
    });
  });
});

// Delete route
router.delete("/:bookId", function(req, res) {
  client.del(req.params.bookId, function(err, reply) {
    console.log(reply);
    client.lrem("books", 1, req.params.bookId, function(err, reply) {
      console.log(reply);
    });
  });
});

module.exports = router;
