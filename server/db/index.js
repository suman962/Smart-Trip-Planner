const mongoose = require("mongoose");
const { User, UserToken } = require("../models/User");
const express = require("express");
const dotenv = require("dotenv");
const crypto = require('crypto');

dotenv.config();
const MONGO_AUTH = process.env.MONGO_AUTH;

const router = express.Router();

mongoose.connect(MONGO_AUTH)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

function getToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
  return { token, expiry };
}

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password is missing!!!!" });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ error: "User/Email already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const { token, expiry } = getToken();

    const userToken = new UserToken({ email, token, expiry });
    await userToken.save();

    res.status(201).json({ message: "User registered successfully", token, expiry });

  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password is missing!!!!" });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await UserToken.findOne({ email });
    if (token) {
      const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      await UserToken.updateOne({ email }, { expiry });
    }
    else {
      const { token, expiry } = getToken();
      const userToken = new UserToken({ email, token, expiry });
      await userToken.save();
    }
    res.status(200).json({ message: "Login successful", token, expiry });

  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
