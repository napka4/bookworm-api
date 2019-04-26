import mongoose from "mongoose";

const schema = new mongoose.Schema({
    listId: { type: mongoose.Schema.Types.ObjectId, required: true },
    booksId: { type: mongoose.Schema.Types.ObjectId }
  });
  
  export default mongoose.model("BooksOnList", schema);