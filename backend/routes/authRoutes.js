const express = require("express");
const router = express.Router();
const { sendOTP } = require("../services/otpService");
const User = require("../models/User");

// Temporary OTP storage
let otpStore = {};

// ---------------- SEND OTP ----------------
router.post("/send-otp", async (req, res) => {
  const { phone, email, password, confirmPassword } = req.body;

  if (!phone || !email || !password || !confirmPassword) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match"
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[phone] = {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000,
      userData: { phone, email: email.trim().toLowerCase(), password }
    };

    await sendOTP(phone, otp);

    console.log("====================================");
    console.log(`[UniSync OTP]: ${otp} for phone ${phone}`);
    console.log("====================================");

    res.json({
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      message: "Failed to send OTP"
    });
  }
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      message: "Phone and OTP required"
    });
  }

  const record = otpStore[phone];
  if (!record) {
    return res.status(400).json({
      message: "OTP not requested"
    });
  }

  if (Date.now() > record.expires) {
    delete otpStore[phone];
    return res.status(400).json({
      message: "OTP expired"
    });
  }

  if (record.code != otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  try {
    const userData = record.userData;

    const newUser = new User({
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
      role: "teacher" // registrations from signup form are teachers
    });

    await newUser.save();
    console.log("User saved:", newUser);

    delete otpStore[phone];

    res.json({
      message: "Signup successful",
      user: newUser
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      message: "Error saving user"
    });
  }
});

// ---------------- DIRECT REGISTER ----------------
router.post("/register", async (req, res) => {
  const { phone, email, password, name, department, employeeId, role } = req.body;

  if (!phone || !email || !password) {
    return res.status(400).json({
      message: "Phone, email and password are required"
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email is already registered"
      });
    }

    const newUser = new User({
      name: name || "Faculty Member",
      phone,
      email: email.trim().toLowerCase(),
      password,
      department: department || "Computer Science",
      employeeId: employeeId || "EMP" + Math.floor(100 + Math.random() * 900),
      role: role || "teacher",
      status: "pending" // ✅ Registered accounts start as pending for Admin approval!
    });

    await newUser.save();
    console.log("[UniSync] New teacher registration pending admin approval:", newUser.email);

    res.json({
      message: "Registration submitted successfully! Your account is pending Admin approval.",
      user: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        status: "pending"
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed"
    });
  }
});

// ---------------- VERIFY APPROVED OTP ----------------
router.post("/verify-approved-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required"
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update status to active and clear OTP fields
    user.status = "active";
    user.otpCode = "";
    user.otpExpires = undefined;
    await user.save();

    res.json({
      message: "OTP verified successfully. Login successful",
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Verification failed"
    });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: "No account found with this email address. Please register first using the 'Register here' link."
      });
    }

    // Check if user account is pending approval by the admin
    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your registration is pending admin approval. Please wait for an administrator to approve your account before logging in."
      });
    }

    // Verify password: only match the user's actual stored password
    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect password. Please check your password and try again."
      });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        department: user.department,
        employeeId: user.employeeId,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;