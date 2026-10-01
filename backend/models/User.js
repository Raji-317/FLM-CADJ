const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["teacher", "admin"], default: "teacher", lowercase: true, trim: true },

  phone: { type: String },
  department: { type: String },
  designation: { type: String },
  bio: { type: String },
  address: { type: String },
  specialization: { type: String },
  qualifications: { type: String },
  experience: { type: String },
  emergencyContact: { type: String },

  employeeId: { type: String },
  joinDate: { type: String },
  status: { type: String, enum: ["active", "on_leave", "substitute", "pending", "approved_pending_otp"], default: "pending" },
  otpCode: { type: String },
  otpExpires: { type: Date },
  classesAssigned: { type: Number, default: 0 },
  classesAdjusted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);