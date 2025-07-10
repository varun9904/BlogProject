const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  flagged: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: String,
  text: String,
  flagged: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
},{ timestamps: true }
);

module.exports = mongoose.model("blog", blogSchema);
