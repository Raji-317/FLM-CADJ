const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendOTP } = require('../services/otpService');

// Create teacher / HOD (admin)
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role, phone, department, employeeId } = req.body;
    const teacher = new User({
      name,
      email,
      password,
      role: role || "teacher", // Can be teacher or admin (HOD)
      phone,
      department,
      employeeId,
      status: "active"
    });
    await teacher.save();
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all faculty (teachers and HODs/admins)
router.get("/", async (req, res) => {
  try {
    const teachers = await User.find({ role: { $in: ["teacher", "admin"] } });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update teacher status (e.g. from on_leave back to active)
router.put("/:email/status", async (req, res) => {
  try {
    const { status } = req.body;
    const teacher = await User.findOneAndUpdate(
      { email: req.params.email },
      { status },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending registration requests
router.get("/pending", async (req, res) => {
  try {
    const pending = await User.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve teacher registration
router.put("/:email/approve", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    const teacher = await User.findOneAndUpdate(
      { email: { $regex: emailRegex } },
      { 
        status: "active",
        otpCode: "",
        otpExpires: undefined
      },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Optional notification SMS
    if (teacher.phone) {
      try {
        await sendOTP(teacher.phone, "APPROVED");
      } catch (smsErr) {
        console.error("SMS notification note:", smsErr.message);
      }
    }

    console.log(`[UniSync] Approved teacher registration: ${teacher.email}`);
    res.json({ message: "Registration approved successfully! Account is now active.", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject teacher registration (delete/remove)
router.put("/:email/reject", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    const teacher = await User.findOneAndDelete({ email: { $regex: emailRegex } });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log(`[UniSync] Rejected teacher registration: ${teacher.email}`);
    res.json({ message: "Registration rejected and deleted", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete faculty member (e.g. if a teacher left the college)
router.delete("/:email", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    const teacher = await User.findOneAndDelete({ email: { $regex: emailRegex } });
    if (!teacher) {
      return res.status(404).json({ message: "Faculty member not found" });
    }
    console.log(`[UniSync] Deleted faculty member: ${teacher.email}`);
    res.json({ message: "Faculty member deleted successfully", teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
