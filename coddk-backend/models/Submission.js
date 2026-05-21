const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

module.exports = mongoose.model("Submission", submissionSchema);
