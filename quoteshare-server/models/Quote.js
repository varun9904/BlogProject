const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  flagged: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const quoteSchema = new mongoose.Schema({
  text: String,
  flagged: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
});

module.exports = mongoose.model("Quote", quoteSchema);
