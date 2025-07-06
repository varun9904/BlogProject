const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173", // ✅ frontend URL
  credentials: true               // ✅ allow cookies
}));



app.get("/", (req, res) => res.send("Welcome to the blogShare API"));
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on http://localhost:${process.env.PORT || 5000}`)
  );
}).catch(console.error);
