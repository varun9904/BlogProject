const express = require("express");
const Blog = require("../models/Blog");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const jwt = require("jsonwebtoken");

// router.post("/", auth, async (req, res) => {
//   const newblog = new blog({ text: req.body.text, user: req.userId });
//   await newblog.save();
//   res.status(201).json(newblog);
// });

router.post("/", auth, async (req, res) => {
  console.log("req.userId:", req.userId);
  const { title, text, flagged = false } = req.body;

  try {
    const newblog = new Blog({
      title,
      text,
      user: req.userId,
      flagged,
    });

    await newblog.save();
    res.status(201).json(newblog);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "name")                // blog author name
      .populate("comments.user", "name");      // comment author name

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});



router.patch("/:id/like", auth, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Not found" });

  const userId = req.userId;
  const index = blog.likes.indexOf(userId);

  if (index > -1) {
    blog.likes.splice(index, 1); // Unlike
  } else {
    blog.likes.push(userId); // Like
  }

  await blog.save();
  res.json({ likes: blog.likes.length });
});

// ✅ DELETE: Delete a blog (only by owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "blog not found" });
    console.log(blog.user.toString());
    console.log(req.userId);
    if (!blog.user.equals(req.userId)) {
      return res.status(403).json({ message: "You are not allowed to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "blog deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});







// Add comment
router.post("/:id/comments", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "blog not found" });

    let userId = null;

    // Try to extract user ID from cookie token (if exists)
    const token = req.cookies?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log("Token invalid or expired — treating as anonymous");
      }
    }

    const comment = {
      text: req.body.text,
      flagged: req.body.flagged,
      user: userId, // Either ObjectId or null (for anonymous)
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({ message: "Comment added", blog });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Delete flagged comment — only by blog author
// router.delete("/:blogId/comments/:commentId", auth, async (req, res) => {
//   try {
//     const { blogId, commentId } = req.params;

//     const blog = await blog.findById(blogId);
//     if (!blog) return res.status(404).json({ message: "blog not found" });

//     // ✅ Log all comment IDs
//     console.log("All comment IDs in blog:");
//     blog.comments.forEach(c => console.log(c._id.toString()));

//     console.log("Requested commentId:", commentId);

//     // ✅ Find comment by _id
//     const comment = blog.comments.find(
//       (c) => c._id.toString() === commentId.trim()
//     );

//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     // ✅ Authorization check (blog owner + flagged only)
//     if (
//       blog.user.toString() !== req.user._id.toString() ||
//       !comment.flagged
//     ) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // ✅ Remove the comment from array
//     blog.comments = blog.comments.filter(
//       (c) => c._id.toString() !== commentId.trim()
//     );

//     await blog.save();

//     res.json({ message: "Comment deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting comment:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.delete("/:blogId/comments/:commentId", auth, async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "blog not found" });

    // ✅ Only blog author can delete comments
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the author of this blog" });
    }

    const comment = blog.comments.find(
      (c) => c._id.toString() === commentId.trim()
    );

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // ✅ Remove the comment
    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentId.trim()
    );

    await blog.save();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});








module.exports = router;
