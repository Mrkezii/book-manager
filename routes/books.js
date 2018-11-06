const express = require("express");
const router = express.Router();

const BookController = require("../controllers/books");

/* GET all books listing. */
/**
 * @api {get} /books Get all books
 * @apiName Get all books
 * @apiVersion 0.0.1
 * @apiGroup Books
 *
 * @apiSuccess {Array} data
 * [{
          "author": "davidsonss stew",
          "title": "aliqweqwrw",
          "summary": "sing and shout",
          "id": "2"
          },{
          "author": "davidsonss stew",
          "title": "aliqweqwrw",
          "summary": "sing and shout",
          "id": "1"
          }]
 *
 * @apiError {String} error Error Message
 */
router.get("/", BookController.getAllBooks);

/**
 * @api {get} /books/:bookId Get Single book
 * @apiName Get Single book
 * @apiVersion 0.0.1
 * @apiGroup Books
 *
 * @apiSuccess {Array} data{
          "author": "Shona Rhimes ",
          "title": "Jack and Jill",
          "summary": "This was the best book i have read",
          "id": "2"
          }
 *
 * @apiError {String} error Error Message
 */
// Get individual book
router.get("/:bookId", BookController.getIndividualBook);

/**
 * @api {post} /books/add Add new Book
 * @apiName Add new Book
 * @apiVersion 0.0.1
 * @apiGroup Books
 *
 *
 * @apiParam {String} Author Author of the book to be created.
 * @apiParam {String} Title Title of the book to be created.
 * @apiParam {String} Summary Summary of the book to be created.
 * @apiSuccess {String} msg Status Message
 *
 * @apiError {String} error Error Message
 */
//  Add new Book
router.post("/add", BookController.addNewBook);

/**
 * @api {put} /books/:bookId Update existing Book
 * @apiName Update Existing Book
 * @apiVersion 0.0.1
 * @apiGroup Books
 *
 *
 * @apiParam {String} Author Author to be updated.
 * @apiParam {String} Title Title to be updated.
 * @apiParam {String} Summary Summary to be updated.
 * @apiSuccess {String} msg Status Message
 *
 * @apiError {String} error Error Message
 */
// update existing book
router.put("/:bookId", BookController.updateBook);

/**
 * @api {delete} /books/:bookId Delete existing Book
 * @apiName Delete Existing Book
 * @apiVersion 0.0.1
 * @apiGroup Books
 *
 * @apiSuccess {String} msg Status Message
 *
 * @apiError {String} error Error Message
 */
// Delete book
router.delete("/:bookId", BookController.deleteBook);

module.exports = router;
