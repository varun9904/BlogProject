import express from "express";

import {register, login, logout} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authMiddleware, (req, res) => {
  const { password, ...userData } = req.user.toObject(); 
  res.json(userData);
});

export default router;