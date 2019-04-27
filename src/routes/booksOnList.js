import express from "express";
import authenticate from "../middlewares/authenticate";
import Book from "../models/Book";
import List from "../models/List";
import BooksOnList from "../models/BooksOnList";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  List
    .findOne({ ...req.body.list })
    .then(async list => {
      const listId = list._id;
      const booksOnList = await BooksOnList.find({ listId }).exec();
      const books = [];

      for(let index = 0; index < booksOnList.length; index++) {
        const book = await Book.findOne({ _id: booksOnList[index].bookId }).exec();
        books.push(book);
      }

      return res.json({ books });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/", (req, res) => {
  const query = {
    listId: req.body.list.list._id,
    bookId: req.body.list.book._id
  };
  
  BooksOnList
    .create(query)
    .then(() => res.json(req.body))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete("/", (req, res) => {
  const query = {
    listId: req.body.list._id,
    bookId: req.body.book._id
  };

  BooksOnList
    .deleteOne(query)
    .then(result => res.json({ result }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;