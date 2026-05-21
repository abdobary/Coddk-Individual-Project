const express = require("express");
const Submission = require("../models/Submission");
const VerificationCode = require("../models/VerificationCode");
const User = require("../models/User");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const router = express.Router();

// ---- Helpers ----
const disposableDomains = [
  "mailinator.com", "guerrillamail.com", "10minutemail.com",
  "tempmail.com", "throwaway.email", "yopmail.com",
  "sharklasers.com", "trashmail.com", "fakeinbox.com",
  "temp-mail.org", "maildrop.cc", "getairmail.com",
  "dispostable.com", "mailnesia.com", "spam4.me"
];

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isAdminOrSuper(role) {
  return role === "admin" || role === "superadmin";
}

// ---- Transporter ----
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========== PUBLIC FORM – DIRECT SUBMIT (verification off) ==========
router.post("/direct-submit", async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const domain = normalizedEmail.split("@")[1];
  if (disposableDomains.includes(domain)) {
    return res.status(400).json({ msg: "Please use a real email address" });
  }

  try {
    // Only block if email already approved
    const existingApproved = await Submission.findOne({
      email: normalizedEmail,
      status: "approved",
    });
    if (existingApproved) {
      return res.status(409).json({ msg: "هذا البريد الإلكتروني مسجّل مسبقًا." });
    }

    const sub = await Submission.create({
      name,
      phone,
      email: normalizedEmail,
      status: "approved",
    });

    // Clean up any pending duplicates
    await Submission.deleteMany({ email: normalizedEmail, status: "pending" });

    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== PUBLIC FORM – TWO‑STEP (verification on) ==========
router.post("/send-code", async (req, res) => {
  const { email, name, phone } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const normalizedEmail = email.toLowerCase().trim();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const domain = normalizedEmail.split("@")[1];
  if (disposableDomains.includes(domain)) {
    return res.status(400).json({ msg: "Please use a real email address" });
  }

  const existingApproved = await Submission.findOne({ email: normalizedEmail, status: "approved" });
  if (existingApproved) {
    return res.status(409).json({ msg: "This email is already registered." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await VerificationCode.findOneAndUpdate(
      { email: normalizedEmail },
      { code, createdAt: new Date() },
      { upsert: true, returnDocument: "after" }
    );

    await Submission.findOneAndUpdate(
      { email: normalizedEmail, status: "pending" },
      { name, phone, email: normalizedEmail, status: "pending" },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"كود دك" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Verification Code",
      html: `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://coddk.com/coddkLogo.svg" width="120" alt="كود دك" />
        </div>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    res.json({ msg: "Code sent to your email. Please verify." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send code. Please try again." });
  }
});

router.post("/verify-and-submit", async (req, res) => {
  const { email, code, name, phone } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !code || !name || !phone) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  try {
    const record = await VerificationCode.findOne({ email: normalizedEmail });
    if (!record || record.code !== code) {
      return res.status(400).json({ msg: "Invalid or expired code" });
    }

    await VerificationCode.deleteOne({ _id: record._id });

    const sub = await Submission.findOneAndUpdate(
      { email: normalizedEmail, status: "pending" },
      { $set: { name, phone, status: "approved" } },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ msg: "Submission not found or already verified." });
    }

    // Clean up any stray pending duplicates
    await Submission.deleteMany({ email: normalizedEmail, status: "pending" });

    res.status(200).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== EMPLOYEE (AUTH) TWO‑STEP ==========

router.post("/employee/send-code", auth, async (req, res) => {
  const { email, name, phone } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const domain = normalizedEmail.split("@")[1];
  if (disposableDomains.includes(domain)) {
    return res.status(400).json({ msg: "Please use a real email address" });
  }

  const existingApproved = await Submission.findOne({ email: normalizedEmail, status: "approved" });
  if (existingApproved) {
    return res.status(409).json({ msg: "This email is already registered." });
  }

  // Update pending if it exists, otherwise it will be created below
  const existingPending = await Submission.findOne({ email: normalizedEmail, status: "pending" });
  if (existingPending) {
    existingPending.name = name || existingPending.name;
    existingPending.phone = phone || existingPending.phone;
    existingPending.createdBy = req.user.id;
    await existingPending.save();
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await VerificationCode.findOneAndUpdate(
      { email: normalizedEmail },
      { code, createdAt: new Date() },
      { upsert: true, returnDocument: "after" }
    );

    if (!existingPending) {
      await Submission.create({
        email: normalizedEmail,
        status: "pending",
        name: name || "",
        phone: phone || "",
        createdBy: req.user.id,
      });
    }

    await transporter.sendMail({
      from: `"كود دك" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Verification Code",
      html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code expires in 5 minutes.</p>`,
    });

    res.json({
      msg: existingPending
        ? "تم إعادة إرسال رمز التحقق وتحديث البيانات."
        : "Code sent to the student's email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send code." });
  }
});

router.post("/employee/verify-and-submit", auth, async (req, res) => {
  const { email, code, name, phone } = req.body;
  const normalizedEmail = email?.toLowerCase().trim();

  if (!normalizedEmail || !code || !name || !phone) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  try {
    const record = await VerificationCode.findOne({ email: normalizedEmail });
    if (!record || record.code !== code) {
      return res.status(400).json({ msg: "Invalid or expired code" });
    }

    await VerificationCode.deleteOne({ _id: record._id });

    const sub = await Submission.findOneAndUpdate(
      { email: normalizedEmail, status: "pending" },
      { $set: { name, phone, createdBy: req.user.id, status: "approved" } },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ msg: "Pending submission not found." });
    }

    // Clean up stray pending duplicates
    await Submission.deleteMany({ email: normalizedEmail, status: "pending" });

    res.status(200).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== EMPLOYEE – DIRECT SUBMIT (no verification) ==========
router.post("/employee/direct-submit", auth, async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  const domain = normalizedEmail.split("@")[1];
  if (disposableDomains.includes(domain)) {
    return res.status(400).json({ msg: "Please use a real email address" });
  }

  try {
    const existing = await Submission.findOne({ email: normalizedEmail, status: "approved" });
    if (existing) {
      return res.status(409).json({ msg: "هذا البريد الإلكتروني مسجّل مسبقًا." });
    }

    const sub = await Submission.create({
      name,
      phone,
      email: normalizedEmail,
      createdBy: req.user.id,
      status: "approved",
    });

    // Clean up pending duplicates
    await Submission.deleteMany({ email: normalizedEmail, status: "pending" });

    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ========== GET SUBMISSIONS (with optional status filter) ==========
router.get("/", auth, async (req, res) => {
  try {
    let filter = {};
    if (!isAdminOrSuper(req.user.role)) {
      filter = { createdBy: req.user.id };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = { $ne: "pending" };
    }
    const data = await Submission.find(filter)
      .populate("createdBy", "name username")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------- DELETE SUBMISSION (admin, superadmin, or owner) ----------
router.delete("/:id", auth, async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ msg: "Submission not found" });

    if (!isAdminOrSuper(req.user.role) && sub.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await Submission.findByIdAndDelete(req.params.id);
    res.json({ msg: "Submission deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------- DELETE ALL PENDING SUBMISSIONS (superadmin only) ----------
router.delete("/pending/all", auth, async (req, res) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  try {
    const result = await Submission.deleteMany({ status: "pending" });
    res.json({ msg: `Deleted ${result.deletedCount} pending submissions.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------- UPDATE SUBMISSION (admin, superadmin, or owner) ----------
router.put("/:id", auth, async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ msg: "Submission not found" });

    const isAdmin = isAdminOrSuper(req.user.role);
    const isOwner = sub.createdBy && sub.createdBy.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const { name, phone, email, code } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (phone) updatedFields.phone = phone;

    // If email is being changed
    if (email && email.toLowerCase().trim() !== sub.email.toLowerCase().trim()) {
      const normalizedEmail = email.toLowerCase().trim();

      if (!isValidEmail(normalizedEmail)) {
        return res.status(400).json({ msg: "Invalid email format" });
      }

      const existing = await Submission.findOne({
        email: normalizedEmail,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res.status(409).json({ msg: "This email is already registered by another student." });
      }

      // Superadmin and users with directAdd can skip code verification
      const canSkipCode = req.user.role === "superadmin";
      const currentUser = await User.findById(req.user.id);
      const hasDirectAdd = currentUser?.directAdd === true;

      if (!canSkipCode && !hasDirectAdd) {
        if (!code) {
          return res.status(400).json({ msg: "Verification code is required to change email." });
        }

        const record = await VerificationCode.findOne({ email: normalizedEmail });
        if (!record || record.code !== code) {
          return res.status(400).json({ msg: "Invalid or expired verification code." });
        }

        await VerificationCode.deleteOne({ _id: record._id });
      }

      updatedFields.email = normalizedEmail;
    }

    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate("createdBy", "name username");

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ---------- UPDATE STATUS (admin/superadmin only) ----------
router.patch("/:id/status", auth, async (req, res) => {
  if (!isAdminOrSuper(req.user.role)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).populate("createdBy", "name username");

    if (!sub) return res.status(404).json({ msg: "Not found" });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
