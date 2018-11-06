const redis = require("redis");
const client = redis.createClient();
module.exports = {
  getAllBooks: function(req, res) {
    let allBooks = [];
    //get all books from the books-list
    client.lrange("books-list", 0, -1, function(err, obj) {
      if (!obj || obj.length === 0) {
        res.send("No books have been added");
      } else {
        res.json(obj);
        // iterate over each id to get book details from hash
        obj.map(book => {
          client.hgetall(book, function(err, reply) {
            // console.log(reply);
            allBooks.push(reply);
            console.log(allBooks);
          });
        });
      }
    });
  },
  getIndividualBook: function(req, res) {
    client.lrange("books-list", 0, -1, function(err, obj) {
      const doesBookExist = obj.includes(req.params.bookId);
      if (!doesBookExist) {
        res.status(404).send("Book Does not exist");
      } else {
        client.hgetall(req.params.bookId, function(err, obj) {
          if (!obj) {
            res.status(404).send("Sorry such book does not exist.");
            console.log("Book Does not exist");
          } else {
            res.send(obj);
          }
        });
      }
    });
  },
  addNewBook: function(req, res) {
    // get book details from client
    let bookDetails = {
      id: req.body.id,
      author: req.body.author,
      title: req.body.title,
      summary: req.body.summary
    };
    //increas the book id by 1
    client.incr("bookId", function(err, bookId) {
      client.HMSET(`book:${bookId}`, bookDetails, function(err, reply) {
        if (err) {
          console.log("there is an error", err);
        }
        res.send(`Book:${bookId} added!`);
        // Push Book id to book list
        client.LPUSH("books-list", `book:${bookId}`);
      });
    });
  },
  updateBook: function(req, res) {
    let bookDetails = {
      id: req.body.id,
      author: req.body.author,
      title: req.body.title,
      summary: req.body.summary
    };
    client.HMSET(req.params.bookId, bookDetails, function(err, reply) {
      if (err) {
        console.log("there is an error", err);
      }
      console.log(reply);
      res.send("okss");
    });
  },
  deleteBook: function(req, res) {
    client.del(req.params.bookId, function(err, reply) {
      console.log(reply);
      client.lrem("books-list", 1, req.params.bookId, function(err, reply) {
        console.log(reply);
      });
    });
  }
};
