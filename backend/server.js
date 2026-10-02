require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // ✅ MUST BE FIRST

// Import models and seed
const User = require("./models/User");

// Import routes
const profileRoutes = require("./routes/profile");
const teacherRoutes = require('./routes/teacherRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/leaves", leaveRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/unisync";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("MongoDB Connected to:", MONGODB_URI.startsWith("mongodb+srv") ? "MongoDB Atlas (Cloud)" : "Local MongoDB");
    await seedDatabase();
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

// Database Seeding Logic
async function seedDatabase() {
  try {
    const adminExists = await User.findOne({ email: "admin@edu.com" });
    if (!adminExists) {
      console.log("Seeding database with default admin account...");
      const admin = new User({
        email: "admin@edu.com",
        password: "Admin@UniSync#2026",
        role: "admin",
        name: "System Administrator",
        phone: "+91 9999999999",
        department: "Administration",
        employeeId: "ADM001",
        joinDate: "2015-01-01",
        status: "active"
      });
      await admin.save();
      console.log("Default admin seeded!");
    } else if (adminExists.role !== "admin") {
      adminExists.role = "admin";
      await adminExists.save();
    }

    // Ensure all user roles are consistently lowercase
    await User.updateMany({ role: { $regex: /^admin$/i } }, { $set: { role: "admin" } });
    await User.updateMany({ role: { $regex: /^teacher$/i } }, { $set: { role: "teacher" } });

    const { ALL_TIMETABLE_FACULTY } = require("./seed_all_faculty");

    for (const t of ALL_TIMETABLE_FACULTY) {
      const teacherEmail = t.email.toLowerCase().trim();
      const existing = await User.findOne({ email: teacherEmail });
      if (!existing) {
        console.log(`Seeding timetable faculty ${t.name} (${teacherEmail})...`);
        const teacher = new User({
          name: t.name,
          email: teacherEmail,
          password: 'Teach@UniSync#2026',
          role: t.role || 'teacher',
          department: t.department,
          designation: t.designation || 'Assistant Professor',
          specialization: t.specialization,
          employeeId: t.employeeId,
          classesAssigned: t.classesAssigned || 10,
          classesAdjusted: 0,
          phone: t.phone || '+91 9876543210',
          status: 'active',
          joinDate: '2021-08-15',
          address: 'SVECW Campus, Bhimavaram',
          qualifications: t.designation && t.designation.includes('Dr.') ? 'PhD in Engineering' : 'M.Tech, B.Tech',
          experience: '8+ years'
        });
        await teacher.save();
      }
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (UniSync Backend Active)`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`ℹ️ Port ${PORT} is already in use — UniSync backend is already running and ready on port ${PORT}.`);
    } else {
      console.error("Server error:", err);
    }
  });
}

module.exports = app;