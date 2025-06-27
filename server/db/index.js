const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const crypto = require('crypto');

dotenv.config();
const MONGO_AUTH = process.env.MONGO_AUTH;

const router = express.Router();

mongoose.connect(MONGO_AUTH)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const db = mongoose.connection.useDb('SmartTrip');

function getToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
  return { token, expiry };
}

const getModels = require("../models");
const { User, UserToken, Trip } = getModels(db);

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

    await UserToken.updateOne({ email }, { token, expiry }, { upsert: true });

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

    const existingToken = await UserToken.findOne({ email });
    if (existingToken) {
      const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      await UserToken.updateOne({ email }, { expiry });
      res.status(200).json({ message: "Login successful", token: existingToken.token, expiry });

    }
    else {
      const { token, expiry } = getToken();
      const userToken = new UserToken({ email, token, expiry });
      await userToken.save();
      res.status(201).json({ message: "Login successful", token, expiry });
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/checktoken", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const userToken = await UserToken.findOne({ token });
    if (!userToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const currentTime = new Date();
    if (userToken.expiry < currentTime) {
      return res.status(401).json({ error: "Token expired" });
    }

    res.status(200).json({ message: "Token is valid", email: userToken.email });

  } catch (error) {
    console.error("Error in checktoken route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/savetrip", async (req, res) => {
  try {
    const { email, tripData } = req.body;

    if (!email || !tripData) {
      return res.status(400).json({ error: "Email and trip data is required" });
    }
    if (!tripData.placeId || !tripData.name || !tripData.bestTime || !tripData.image) {
      return res.status(400).json({ error: "Trip data must include placeId, name, and bestTime" });
    }
    const trip = new Trip({ email, ...tripData });
    await trip.save();

    res.status(201).json({ message: "Trip saved successfully", trip });

  } catch (error) {
    console.error("Error in savetrip route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/deletetrip", async (req, res) => {
  try {
    const { email, tripId } = req.body;

    if (!email || !tripId) {
      return res.status(400).json({ error: "Email and tripId are required" });
    }

    const trip = await Trip.findOneAndDelete({ _id: tripId, email });
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });

  } catch (error) {
    console.error("Error in deletetrip route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/gettrips", async (req, res) => {
  try {
    const { email, tripId } = req.query;

    if (!email && !tripId) {
      return res.status(400).json({ error: "Email is required" });
    }

    const trips = await Trip.find({ email });

    if (tripId) {
      const trip = await Trip.findOne({ _id: tripId });
      return res.status(200).json(trip);
    }

    res.status(200).json(trips);

  } catch (error) {
    console.error("Error in gettrips route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;