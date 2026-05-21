const express = require("express");
const auth = require("../middleware/auth");
const Settings = require("../models/Settings");

const router = express.Router();

// PUBLIC – get verification status (no auth needed)
router.get("/public", async (req, res) => {
  try {
    let setting = await Settings.findOne({ key: "publicVerification" });
    const enabled = setting ? setting.value : true;  // default true
    res.json({ publicVerification: enabled });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// SUPERADMIN ONLY – toggle verification
router.put("/public-verification", auth, async (req, res) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const { enabled } = req.body;
  if (typeof enabled !== "boolean") {
    return res.status(400).json({ msg: "Invalid value" });
  }

  try {
    await Settings.findOneAndUpdate(
      { key: "publicVerification" },
      { value: enabled },
      { upsert: true, new: true }
    );
    res.json({ msg: "Setting updated", publicVerification: enabled });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
