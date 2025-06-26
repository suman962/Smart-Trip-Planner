const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  placeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bestTime: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = { TripSchema };