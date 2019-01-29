import express from "express";
import authenticate from "../middlewares/authenticate";
import List from "../models/List";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  List.find({ userId: req.currentUser._id }).then(lists => res.json({ lists }));
});

router.post("/", (req, res) => {
  console.log(req.body)
  List.create({ ...req.body.list, userId: req.currentUser._id, title: req.body.title })
    .then(list => res.json({ list }))
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