const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  teacherEmail: String,

  type: String,
  startDate: String,
  endDate: String,
  reason: String,

  isEmergency: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: [
      "waiting_substitutes",
      "ready_for_admin",
      "approved",
      "rejected",
      "emergency_pending"
    ],
    default: "waiting_substitutes"
  },

  affectedClasses: [
    {
      classId: String,
      subject: String,
      date: String,
      time: String,

      substituteTeacher: String,
      assignedBy: {
        type: String,
        default: "Teacher"
      },

      substituteStatus: {
        type: String,
        enum: ["pending", "accepted", "rejected", "assigned"],
        default: "pending"
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);