const express = require("express");
const router = express.Router();

const BookController = require("../controllers/books");

/* GET all books listing. */
router.get("/", BookController.getAllBooks);

// Get individual book
router.get("/:bookId", BookController.getIndividualBook);

//  Add new Book
router.post("/add", BookController.addNewBook);

// update existing book
router.put("/:bookId", BookController.updateBook);

// Delete book
router.delete("/:bookId", BookController.deleteBook);

module.exports = router;
