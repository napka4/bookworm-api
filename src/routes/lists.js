import express from "express";
import request from "request-promise";
import { parseString } from "xml2js";
import authenticate from "../middlewares/authenticate";
import List from "../models/List";
import Book from "../models/Book";
import BooksOnList from "../models/BooksOnList";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  List
    .find({ userId: req.currentUser._id })
    .then(lists => res.json({ lists }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get("/with-books", (req, res) => {
  List
    .find({ userId: req.currentUser._id })
    .then(async lists => {
      const newLists = [];

      for(let listIndex = 0; listIndex < lists.length; listIndex++) {
        const listId = lists[listIndex]._id;
        const booksOnList = await BooksOnList.find({ listId }).exec();
        const books = [];
  
        for(let bookIndex = 0; bookIndex < booksOnList.length; bookIndex++) {
          const book = await Book.findOne({ _id: booksOnList[bookIndex].bookId }).exec();
          books.push(book);
        }

        lists[listIndex]._doc.books = books;
        newLists.push(lists[listIndex]);
      }

      return res.json({ lists: newLists });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/", (req, res) => {
  const query = {
    ...req.body.list, 
    userId: req.currentUser._id, 
    title: req.body.title
  };

  List
    .create(query)
    .then(list => res.json({ list }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.put("/", (req, res) => {
  const query = { _id: req.body._id };
  const setter = {
    $set: {
      title: req.body.title
    }
  };

  List
    .findOneAndUpdate(query, setter, { new: true })
    .then(list => res.json({ list }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete("/", (req, res) => {
  const query = {
    ...req.body.list, 
    userId: req.currentUser._id
  };

  List
    .deleteOne(query)
    .then(list => res.json({ list }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//récup les données du formu

//retrouver les listes
router.get("/fetchLists", (req, res) => {
  const goodreadsId = req.query.goodreadsId;
  const goodreadsUrl = `https://www.goodreads.com/book/show.xml`;

  request
    .get(`${goodreadsUrl}?key=${process.env.GOODREADS_KEY}&id=${goodreadsId}`)
    .then(result =>
      parseString(result, (err, goodreadsResult) => {
        const numPages = goodreadsResult.GoodreadsResponse.book[0].num_pages[0];
        const pages = numPages ? parseInt(numPages, 10) : 0;

        res.json({ pages });
      })
    );
});

export default router;