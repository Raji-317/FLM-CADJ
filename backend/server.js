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
mongoose.connect("mongodb://127.0.0.1:27017/unisync")
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDatabase();
  })
  .catch(err => console.log(err));

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
    }

    const teachers = [
      {
        name: 'Prof. Sarah Johnson (Demo Teacher)',
        email: 'teacher@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Computer Science',
        employeeId: 'CS100',
        status: 'active',
        classesAssigned: 12,
        classesAdjusted: 0,
        phone: '+91 9876543210',
        joinDate: '2021-08-15',
        address: '100 University Campus Road',
        specialization: 'Computer Networks & Web Tech',
        qualifications: 'PhD in Computer Science',
        experience: '7 years',
        emergencyContact: 'Emergency Contact - +91 9876543211'
      },
      {
        name: 'Dr. V.Harinadh',
        email: 'harinadhv@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Computer Science',
        employeeId: 'CS001',
        status: 'active',
        classesAssigned: 12,
        classesAdjusted: 0,
        phone: '+91 75368786867',
        joinDate: '2020-08-15',
        address: '123 University Ave, City, State 12345',
        specialization: 'Data Structures & Algorithms',
        qualifications: 'PhD in Computer Science, MSc in Software Engineering',
        experience: '8 years',
        emergencyContact: 'Bharathi - +91 98735282636'
      },
      {
        name: 'Prof.Pradeep Juluri',
        email: 'pradeep@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Computer Science',
        employeeId: 'CS002',
        status: 'active',
        classesAssigned: 8,
        classesAdjusted: 4,
        phone: '+91 4863427087',
        joinDate: '2019-01-10',
        address: '456 Oak Street, City, State 12346',
        specialization: 'Machine Learning & AI',
        qualifications: 'PhD in Artificial Intelligence',
        experience: '10 years',
        emergencyContact: 'Sumedha - +91 6386829720'
      },
      {
        name: 'Dr. A.Sri Krishna',
        email: 'krishnaa@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Computer Science',
        employeeId: 'CS003',
        status: 'on_leave',
        classesAssigned: 10,
        classesAdjusted: 10,
        phone: '+91 9988776655',
        joinDate: '2021-03-22',
        address: '789 Pine Road, City, State 12347',
        specialization: 'Database Systems',
        qualifications: 'PhD in Database Management',
        experience: '6 years',
        emergencyContact: 'Praveen - +91 8674876562'
      },
      {
        name: 'Prof. Pravallika Prathikonda',
        email: 'ppravallikan@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Computer Science',
        employeeId: 'CS004',
        status: 'active',
        classesAssigned: 14,
        classesAdjusted: 2,
        phone: '+91 9900990099',
        joinDate: '2018-09-05',
        address: '321 Elm Street, City, State 12348',
        specialization: 'Software Engineering',
        qualifications: 'MSc in Software Engineering, BSc in Computer Science',
        experience: '12 years',
        emergencyContact: 'Sarada- +91 9875368427'
      },
      {
        name: 'Dr.M.Sailakshmi',
        email: 'sailakshmim@edu.com',
        password: 'Teach@UniSync#2026',
        role: 'teacher',
        department: 'Mathematics',
        employeeId: 'MATH001',
        status: 'on_leave',
        classesAssigned: 9,
        classesAdjusted: 9,
        phone: '+91 980826902',
        joinDate: '2020-02-14',
        address: '654 Maple Avenue, City, State 12349',
        specialization: 'Applied Mathematics',
        qualifications: 'PhD in Applied Mathematics',
        experience: '7 years',
        emergencyContact: 'Rajyalakshmi - +1 (555) 567-8902'
      }
    ];

    for (const t of teachers) {
      const teacherExists = await User.findOne({ email: t.email });
      if (!teacherExists) {
        console.log(`Seeding teacher ${t.name}...`);
        const teacher = new User(t);
        await teacher.save();
      }
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

// Start server
const server = app.listen(5000, () => {
  console.log("Server running on port 5000 (UniSync Backend Active)");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log("ℹ️ Port 5000 is already in use — UniSync backend is already running and ready on port 5000.");
  } else {
    console.error("Server error:", err);
  }
});