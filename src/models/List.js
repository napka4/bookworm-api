import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  goodreadsId: { type: mongoose.Schema.Types.ObjectId },
  id: { type: Number, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

export default mongoose.model("List", schema);