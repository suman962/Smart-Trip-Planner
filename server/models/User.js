const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const User = mongoose.model("User", userSchema);

const userTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  }
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = { User, UserToken };
