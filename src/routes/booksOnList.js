import express from "express";
import authenticate from "../middlewares/authenticate";
import Book from "../models/Book";
import List from "../models/List";
import BooksOnList from "../models/BooksOnList";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  List.find({ userId: req.currentUser._id }).then(lists => {
    const results = lists.map(list => {
      const findBooks = BooksOnList.find({ listId: list._id });
      const books = [];

      findBooks.map(book => Book.find({ _id: book._id }).then(() => books.push(book)));
      list._doc.books = books;
      
      return list;
    });

    return res.json({ lists: results });
  })
  .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/", (req, res) => {
  const query = {
    listId: req.body.list._id,
    bookId: req.body.book._id
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