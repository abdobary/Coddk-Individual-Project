const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: { type: String, default: "employee" }, // admin | employee | superadmin
  directAdd: { type: Boolean, default: false }  // ← NEW
});

module.exports = mongoose.model("User", userSchema);
