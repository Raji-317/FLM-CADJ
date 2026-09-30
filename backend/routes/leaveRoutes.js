const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const User = require('../models/User');
const { sendSMS } = require('../services/otpService');

// Create leave
router.post("/create", async (req, res) => {
  try {
    const leave = new Leave({
      teacherEmail: req.body.teacherEmail || req.body.email, // handle both keys safely
      type: req.body.type || "sick",
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason,
      affectedClasses: req.body.affectedClasses || [],
      isEmergency: req.body.isEmergency || false
    });

    if (leave.isEmergency) {
      leave.status = "emergency_pending";
    } else if (!leave.affectedClasses || leave.affectedClasses.length === 0) {
      leave.status = "ready_for_admin";
    } else {
      const hasSubstitutes = leave.affectedClasses.some(c => c.substituteTeacher);
      leave.status = hasSubstitutes ? "waiting_substitutes" : "ready_for_admin";
    }

    await leave.save();

    // Send SMS alert to assigned substitute teachers
    if (leave.affectedClasses && leave.affectedClasses.length > 0) {
      for (const cls of leave.affectedClasses) {
        if (cls.substituteTeacher) {
          try {
            const subUser = await User.findOne({ email: cls.substituteTeacher });
            const reqUser = await User.findOne({ email: leave.teacherEmail });
            if (subUser && subUser.phone) {
              const body = `UniSync Alert: Hii ${subUser.name || 'Professor'}, Teacher ${reqUser?.name || leave.teacherEmail} has requested you as a substitute for "${cls.subject || 'Class'}" on ${cls.date || leave.startDate} at ${cls.time || ''}. Reason: ${leave.reason}. Please log into UniSync.`;
              await sendSMS(subUser.phone, body);
              console.log(`[UniSync SMS] Sent substitute request to ${cls.substituteTeacher}`);
            }
          } catch (smsErr) {
            console.error("SMS error:", smsErr.message);
          }
        }
      }
    }

    res.json({ message: "Leave created", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create substitute request directly
router.post("/substitute/create", async (req, res) => {
  try {
    const { classId, className, originalDate, originalTime, substituteTeacher, reason, teacherEmail } = req.body;

    const leave = new Leave({
      teacherEmail,
      type: "substitution",
      startDate: originalDate,
      endDate: originalDate,
      reason,
      status: "waiting_substitutes",
      affectedClasses: [{
        classId: classId || "adj-" + Date.now(),
        subject: className,
        date: originalDate,
        time: originalTime,
        substituteTeacher,
        substituteStatus: "pending"
      }]
    });

    await leave.save();

    // Send SMS Alert to the substitute teacher
    try {
      const substituteUser = await User.findOne({ email: substituteTeacher });
      const requestingUser = await User.findOne({ email: teacherEmail });
      if (substituteUser && substituteUser.phone) {
        const messageBody = `UniSync Alert: Hii ${substituteUser.name || 'Professor'}, Teacher ${requestingUser?.name || teacherEmail} has requested you to substitute for their class "${className}" on ${originalDate} at ${originalTime}. Reason: ${reason}. Please log in to UniSync to respond.`;
        await sendSMS(substituteUser.phone, messageBody);
        console.log(`[UniSync SMS] Sent substitute request to ${substituteTeacher}: "${messageBody}"`);
      }
    } catch (smsErr) {
      console.error("SMS notification failed:", smsErr.message);
    }

    res.json({ message: "Substitute request created", leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Substitute response
router.put("/substitute-response", async (req, res) => {
  try {
    const { leaveId, classId, status } = req.body;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const cls = leave.affectedClasses.find(c => 
      c.classId === classId || 
      c._id?.toString() === classId || 
      (classId && c.classId && c.classId.toString() === classId.toString())
    );

    if (cls) {
      cls.substituteStatus = status;
      if (status === "accepted" && cls.substituteTeacher) {
        await User.findOneAndUpdate(
          { email: cls.substituteTeacher },
          { 
            status: "substitute",
            $inc: { classesAdjusted: 1 }
          }
        );
      }
    }

    const allAccepted = leave.affectedClasses.length > 0 && leave.affectedClasses.every(
      c => c.substituteStatus === "accepted" || c.substituteStatus === "assigned"
    );

    if (leave.type === "substitution") {
      // ✅ Direct peer substitution does NOT need admin approval - auto-approved upon substitute acceptance!
      if (allAccepted || status === "accepted") {
        leave.status = "approved";
      } else if (status === "rejected") {
        leave.status = "rejected";
      }
    } else {
      // ✅ Formal leaves advance to ready_for_admin for Administrator approval once coverage is settled
      if (allAccepted) {
        leave.status = "ready_for_admin";
      } else if (status === "rejected") {
        leave.status = "waiting_substitutes";
      }
    }

    await leave.save();

    // Send SMS response back to requesting teacher safely
    if (cls && cls.substituteTeacher) {
      try {
        const requestingUser = await User.findOne({ email: leave.teacherEmail });
        const substituteUser = await User.findOne({ email: cls.substituteTeacher });
        if (requestingUser && requestingUser.phone) {
          const messageBody = `UniSync Alert: Hii ${requestingUser.name || 'Professor'}, Teacher ${substituteUser?.name || cls.substituteTeacher} has ${status} your substitution request for class "${cls.subject}" on ${cls.date || leave.startDate}.`;
          await sendSMS(requestingUser.phone, messageBody);
          console.log(`[UniSync SMS] Sent response notification to ${leave.teacherEmail}: "${messageBody}"`);
        }
      } catch (smsErr) {
        console.error("SMS notification failed:", smsErr.message);
      }
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign substitute (Admin action)
router.put("/assign-substitute", async (req, res) => {
  try {
    const { leaveId, classId, teacherEmail } = req.body;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    const cls = leave.affectedClasses.find(c => c.classId === classId || c._id?.toString() === classId);
    if (cls) {
      cls.substituteTeacher = teacherEmail;
      cls.assignedBy = "Admin"; // ✅ Explicitly track that Administrator assigned this!
      cls.substituteStatus = "assigned";
      
      // Update substitute teacher status in DB
      await User.findOneAndUpdate(
        { email: teacherEmail },
        { 
          status: "substitute",
          $inc: { classesAdjusted: 1 }
        }
      );

      // Send SMS alert to assigned substitute teacher specifically stating Admin assignment
      try {
        const subUser = await User.findOne({ email: teacherEmail });
        const reqUser = await User.findOne({ email: leave.teacherEmail });
        if (subUser && subUser.phone) {
          const body = `UniSync Admin Alert: Hii ${subUser.name || 'Professor'}, Administrator has officially assigned you to cover "${cls.subject || 'Class'}" on ${cls.date || leave.startDate} at ${cls.time || ''} (delegated from ${reqUser?.name || leave.teacherEmail}). Please log in to UniSync to view and accept.`;
          await sendSMS(subUser.phone, body);
          console.log(`[UniSync Admin SMS] Sent official assignment alert to ${teacherEmail}`);
        }
      } catch (smsErr) {
        console.error("Admin assignment SMS error:", smsErr.message);
      }
    }

    // Check if all classes now have assigned substitutes
    const allAssigned = leave.affectedClasses.every(
      c => c.substituteStatus === "assigned" || c.substituteStatus === "accepted"
    );
    if (allAssigned) {
      leave.status = "ready_for_admin";
    }

    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Approve/Reject Action
router.put("/admin-action", async (req, res) => {
  try {
    const { leaveId, action } = req.body;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = action === "approve" ? "approved" : "rejected";
    await leave.save();

    // If a normal leave is approved, set requesting teacher status to on_leave
    if (action === "approve" && leave.type !== "substitution") {
      await User.findOneAndUpdate(
        { email: leave.teacherEmail },
        { status: "on_leave" }
      );
    }

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get admin view of leaves (sorted like a stack: newest at top)
router.get("/admin", async (req, res) => {
  try {
    // Auto-approve peer substitutions whose substitute accepted
    await Leave.updateMany(
      {
        type: "substitution",
        status: { $in: ["ready_for_admin", "waiting_substitutes"] },
        "affectedClasses.0": { $exists: true },
        affectedClasses: { $not: { $elemMatch: { substituteStatus: { $ne: "accepted" } } } }
      },
      { $set: { status: "approved" } }
    );

    // Promote formal leaves whose substitutes are all accepted to ready_for_admin for Administrator approval
    await Leave.updateMany(
      {
        type: { $ne: "substitution" },
        status: "waiting_substitutes",
        "affectedClasses.0": { $exists: true },
        affectedClasses: { $not: { $elemMatch: { substituteStatus: { $ne: "accepted" } } } }
      },
      { $set: { status: "ready_for_admin" } }
    );

    const leaves = await Leave.find({ type: { $ne: "substitution" } }).sort({ createdAt: -1, _id: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get teacher's own leaves (sorted like a stack: newest at top)
router.get("/my/:email", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    // Auto-approve peer substitutions if substitute accepted
    await Leave.updateMany(
      {
        teacherEmail: { $regex: emailRegex },
        type: "substitution",
        status: { $in: ["ready_for_admin", "waiting_substitutes"] },
        "affectedClasses.0": { $exists: true },
        affectedClasses: { $not: { $elemMatch: { substituteStatus: { $ne: "accepted" } } } }
      },
      { $set: { status: "approved" } }
    );

    // Update formal leaves to ready_for_admin once all substitutes have accepted
    await Leave.updateMany(
      {
        teacherEmail: { $regex: emailRegex },
        type: { $ne: "substitution" },
        status: "waiting_substitutes",
        "affectedClasses.0": { $exists: true },
        affectedClasses: { $not: { $elemMatch: { substituteStatus: { $ne: "accepted" } } } }
      },
      { $set: { status: "ready_for_admin" } }
    );

    const leaves = await Leave.find({ teacherEmail: { $regex: emailRegex } }).sort({ createdAt: -1, _id: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get substitute requests assigned to a teacher (sorted like a stack: newest at top)
router.get("/substitute/:email", async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.params.email.trim()}$`, "i");
    const leaves = await Leave.find({
      "affectedClasses.substituteTeacher": { $regex: emailRegex }
    }).sort({ createdAt: -1, _id: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reports summary analytics
router.get("/reports/summary", async (req, res) => {
  try {
    const totalFaculty = await User.countDocuments({ role: "teacher" });
    const activeTeachers = await User.countDocuments({ role: "teacher", status: "active" });
    const onLeaveTeachers = await User.countDocuments({ role: "teacher", status: "on_leave" });
    const substituteTeachers = await User.countDocuments({ role: "teacher", status: "substitute" });

    const leaves = await Leave.find();

    let leavePending = 0;
    let leaveApproved = 0;
    let leaveRejected = 0;

    let subPending = 0;
    let subApproved = 0;
    let subRejected = 0;

    let adjustedClassesCount = 0;

    leaves.forEach(l => {
      if (l.type === "substitution") {
        if (l.status === "approved") subApproved++;
        else if (l.status === "rejected") subRejected++;
        else subPending++;
      } else {
        if (l.status === "approved") leaveApproved++;
        else if (l.status === "rejected") leaveRejected++;
        else leavePending++;
      }

      if (l.status === "approved" || l.status === "ready_for_admin") {
        adjustedClassesCount += (l.affectedClasses ? l.affectedClasses.length : 0);
      }
    });

    res.json({
      totalFaculty,
      activeTeachers,
      onLeaveTeachers,
      substituteTeachers,
      totalClasses: 120, // default total classes base
      adjustedClasses: adjustedClassesCount,
      leaveRequests: {
        pending: leavePending,
        approved: leaveApproved,
        rejected: leaveRejected
      },
      substituteRequests: {
        pending: subPending,
        approved: subApproved,
        rejected: subRejected
      },
      departmentStats: {
        'Computer Science': {
          faculty: await User.countDocuments({ role: "teacher", department: "Computer Science" }),
          onLeave: await User.countDocuments({ role: "teacher", department: "Computer Science", status: "on_leave" }),
          classesAdjusted: adjustedClassesCount
        },
        'Mathematics': {
          faculty: await User.countDocuments({ role: "teacher", department: "Mathematics" }),
          onLeave: await User.countDocuments({ role: "teacher", department: "Mathematics", status: "on_leave" }),
          classesAdjusted: 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
