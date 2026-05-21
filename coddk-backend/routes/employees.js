const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Helpers
const isAtLeastAdmin = (role) => role === "admin" || role === "superadmin";
const isSuperAdmin = (role) => role === "superadmin";

// CREATE USER (superadmin -> admin/employee, admin -> employee)
router.post("/", auth, async (req, res) => {
  if (!isAtLeastAdmin(req.user.role)) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const { name, username, password, role: targetRole, directAdd } = req.body;

  let finalRole = "employee";
  if (targetRole === "admin" && isSuperAdmin(req.user.role)) {
    finalRole = "admin";
  } else if (targetRole && targetRole !== "employee") {
    return res.status(400).json({ msg: "Invalid role" });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ msg: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      password: hashed,
      role: finalRole,
      directAdd: directAdd || false,
    });

    const { password: _, ...newUser } = user._doc;
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET USERS (superadmin -> all, admin -> employees, employee -> self)
router.get("/", auth, async (req, res) => {
  try {
    let filter = {};

    if (isSuperAdmin(req.user.role)) {
      if (req.query.role) {
        if (req.query.role === "admin") {
          filter.role = { $in: ["admin", "superadmin"] };
        } else {
          filter.role = req.query.role;
        }
      }
    } else if (req.user.role === "admin") {
      filter.role = "employee";
    } else {
      filter._id = req.user.id;
    }

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE USER
router.put("/:id", auth, async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ msg: "User not found" });

    // Permissions
    if (isSuperAdmin(req.user.role)) {
      // superadmin can edit anyone including themselves
    } else if (req.user.role === "admin") {
      // admin can only edit employees
      if (userToUpdate.role !== "employee") {
        return res.status(403).json({ msg: "Cannot edit admins" });
      }
    } else {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const { name, username, password, role: newRole, directAdd } = req.body;

    if (name) userToUpdate.name = name;
    if (username) userToUpdate.username = username;
    if (password) {
      const bcrypt = require("bcrypt");
      userToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (newRole && isSuperAdmin(req.user.role)) {
      if (["admin", "employee"].includes(newRole)) {
        userToUpdate.role = newRole;
      } else {
        return res.status(400).json({ msg: "Invalid role" });
      }
    }
    // Toggle directAdd (superadmin only)
    if (typeof directAdd === "boolean" && isSuperAdmin(req.user.role)) {
      userToUpdate.directAdd = directAdd;
    }

    await userToUpdate.save();
    res.json({ msg: "User updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE USER
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (isSuperAdmin(req.user.role)) {
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({ msg: "Cannot delete yourself" });
      }
    } else if (req.user.role === "admin") {
      if (user.role !== "employee") {
        return res.status(403).json({ msg: "Cannot delete admins" });
      }
    } else {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
