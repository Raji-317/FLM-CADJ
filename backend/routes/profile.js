const express = require("express");
const router = express.Router();

// ✅ Use common model
const User = require("../models/User");


// 🔹 GET PROFILE (FIXED - no crash)
router.get("/:email", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    const user = await User.findOne({ email: { $regex: emailRegex } });

    // ✅ FIX: don't send 404 (prevents frontend crash)
    if (!user) {
      return res.json(null);
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔹 UPDATE PROFILE (FIXED - upsert added)
router.put("/update", async (req, res) => {
  const { email, ...updates } = req.body;

  // ✅ safety check
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const emailRegex = new RegExp(`^${email.trim()}$`, "i");
    const user = await User.findOneAndUpdate(
      { email: { $regex: emailRegex } },
      updates,
      {
        new: true,
        upsert: true,              // ✅ creates user if not exists
        setDefaultsOnInsert: true
      }
    );

    res.json({
      message: "Profile saved successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;