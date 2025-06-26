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


module.exports = function getModels(db) {
  return {
    User: db.model("User", userSchema, "users"),
    UserToken: db.model("UserToken", userTokenSchema, "user_tokens")
  };
};