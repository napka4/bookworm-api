import mongoose from "mongoose";

const schema = new mongoose.Schema({
  listId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    index: true,
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true, 
    index: true,
  }
});

export default mongoose.model("BooksOnList", schema);