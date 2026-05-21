const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires after 5 min
});

module.exports = mongoose.model("VerificationCode", verificationSchema);