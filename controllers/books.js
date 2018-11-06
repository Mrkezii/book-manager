const redis = require("redis");
const client = redis.createClient();

module.exports = {
  getAllBooks: function(req, res) {
    let allBooks = [];
    //get all books from the books-list
    client.lrange("books-list", 0, -1, function(err, obj) {
      if (!obj || obj.length === 0) {
        res.status(404).send("No books have been added");
      }
      // iterate over each id to get book details from hash
      const x = i => {
        if (i == obj.length) {
          return res.status(200).send(allBooks);
        }
        client.hgetall(obj[i], function(err, singleBook) {
          allBooks.push(singleBook);
          x(i + 1);
        });
      };
      x(0);
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
          } else {
            res.status(200).send(obj);
          }
        });
      }
    });
  },
  addNewBook: function(req, res) {
    // get book details from client
    let bookDetails = {
      author: req.body.author,
      title: req.body.title,
      summary: req.body.summary
    };

    //increase the book id by 1
    client.incr("bookId", function(err, bookId) {
      bookDetails["id"] = bookId;
      client.hmset(`${bookId}`, bookDetails, function(err, reply) {
        if (err) {
          res.status(404).send(err);
        }
        // Push Book id to book list
        client.LPUSH("books-list", `${bookId}`);

        return res.status(200).send(`Book-${bookId} added!`);
      });
    });
  },
  updateBook: function(req, res) {
    let bookDetails = {
      author: req.body.author,
      title: req.body.title,
      summary: req.body.summary
    };
    client.hmset(req.params.bookId, bookDetails, function(err, reply) {
      if (err) {
        res.status(404).send(err);
      }
      return res.status(200).send(`${req.params.bookId} updated successfully!`);
    });
  },
  deleteBook: function(req, res) {
    client.del(req.params.bookId, function(err, reply) {
      client.lrem("books-list", 1, req.params.bookId, function(err, reply) {
        if (err) {
          res.status(404).send(err);
        }
        return res
          .status(200)
          .send(`${req.params.bookId} deleted successfully!`);
      });
    });
  }
};
