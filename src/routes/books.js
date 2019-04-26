import express from "express";
import request from "request-promise";
import { parseString } from "xml2js";
import authenticate from "../middlewares/authenticate";
import Book from "../models/Book";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  Book
    .find({ userId: req.currentUser._id })
    .then(books => res.json({ books }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/", (req, res) => {
  const query = { 
    ...req.body.book, 
    userId: req.currentUser._id
  };

  Book
    .create(query)
    .then(book => res.json({ book }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete("/", (req, res) => {
  const query = {
    ...req.body.book, 
    userId: req.currentUser._id
  };

  Book
    .deleteOne(query)
    .then(book => res.json({ book }) )
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get("/search", (req, res) => {
  const goodreadsUrl = 'https://www.goodreads.com/search/index.xml';

  request
    .get(`${goodreadsUrl}?key=${process.env.GOODREADS_KEY}&q=${req.query.q}`)
    .then(result =>
      parseString(result, (err, goodreadsResult) =>
        res.json({
          books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
            work => ({
              goodreadsId: work.best_book[0].id[0]._,
              title: work.best_book[0].title[0],
              authors: work.best_book[0].author[0].name[0],
              covers: [work.best_book[0].image_url[0]]
            })
          )
        })
      )
    );
});

router.get("/fetchPages", (req, res) => {
  const goodreadsId = req.query.goodreadsId;
  const goodreadsUrl = 'https://www.goodreads.com/book/show.xml';

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
