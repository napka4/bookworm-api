import express from "express";
import request from "request-promise";
import { parseString } from "xml2js";
import authenticate from "../middlewares/authenticate";
import Book from "../models/Book";
import List from "../models/List";
import BooksOnList from "../models/BooksOnList";
import parseErrors from "../utils/parseErrors";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
    BooksOnList.find({ List: req.currentUser._id }).then(books => res.json({ books }));
  });


export default router;