import express from "express";
import authenticate from "../middlewares/authenticate";
import List from "../models/List";
import parseErrors from "../utils/parseErrors";
import BooksOnList from "../models/BooksOnList";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  List.find({ userId: req.currentUser._id }).then(lists => {
    const results = lists.map(list => {
      const findBooks = BooksOnList.find({ listId: list._id });
      let books = [];
      findBooks.map(book => {
        Book.find({ _id: book._id }).then(books => books.push(book));
      });
      list._doc.books = books;
      return list;
    })
    return res.json({ lists: results })
  })
  .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post("/", (req, res) => {
  List.create({ ...req.body.list, userId: req.currentUser._id, title: req.body.title })
    .then(list => res.json({ list }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.put("/", (req, res) => 
{
  List.findOneAndUpdate({ _id: req.body._id }, {$set:{ title: req.body.title }}, {new: true})
    .then(list => res.json({list}))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.put("/books", (req, res) => 
{
  List.findOne({ _id: req.body._id }).then((list, book) => {
    BooksOnList.findOneAndUpdate({ listId: list._id, bookId: book._id }, {$set:{ title: req.body.title }});
  })
  .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.delete("/", (req, res) => {
  List.deleteOne({...req.body.list, userId: req.currentUser._id})
  .then(list => res.json({list}))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

//récup les données du formu

//retrouver les listes
router.get("/fetchLists", (req, res) => {
  const goodreadsId = req.query.goodreadsId;

  request
    .get(
      `https://www.goodreads.com/book/show.xml?key=${process.env
        .GOODREADS_KEY}&id=${goodreadsId}`
    )
    .then(result =>
      parseString(result, (err, goodreadsResult) => {
        const numPages = goodreadsResult.GoodreadsResponse.book[0].num_pages[0];
        const pages = numPages ? parseInt(numPages, 10) : 0;
        res.json({
          pages
        });
      })
    );
});


export default router;