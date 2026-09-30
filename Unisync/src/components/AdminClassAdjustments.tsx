import { useState, useEffect } from "react";
import { getAvailableTeachersForSlot, getTeacherSubject } from "@/utils/scheduleUtils";

const defaultClasses = [
  'Computer Networks & Security',
  'Web Technologies Lab',
  'Cloud Computing Architecture',
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Machine Learning & AI',
  'Software Engineering'
];

const defaultRooms = [
  'Room 101',
  'Room 105',
  'Room 201',
  'Room 202',
  'Room 204',
  'Room 205',
  'Lab 301',
  'Lab 302',
  'Lab 303',
  'Auditorium'
];

interface AdminClassAdjustmentsProps {
  onCreateAdjustment: (adjustment: ClassAdjustment) => void;
}

export interface ClassAdjustment {
  id: string;
  teacherName: string;
  className: string;
  originalDate: string;
  originalTime: string;
  newDate: string;
  newTime: string;
  newRoom?: string;
  reason: string;
  type: 'reschedule' | 'cancel' | 'room_change';
  status: 'approved' | 'rejected' | 'pending';
  createdAt: string;
  createdBy: string;
}

export const AdminClassAdjustments = ({ onCreateAdjustment }: AdminClassAdjustmentsProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  // Track selected substitute teacher dropdown state per class (keyed by "leaveId-classId")
  const [selectedTeacherEmails, setSelectedTeacherEmails] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState({
    teacherName: '',
    className: '',
    originalDate: '',
    originalTime: '',
    newDate: '',
    newTime: '',
    newRoom: '',
    reason: '',
    type: 'reschedule' as 'reschedule' | 'cancel' | 'room_change'
  });

  const [adjustments, setAdjustments] = useState<ClassAdjustment[]>([]);

  // ✅ FETCH LEAVES FROM BACKEND
  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/admin");
      const data = await res.json();
      if (res.ok) {
        setLeaveRequests(data);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  // ✅ FETCH TEACHERS FROM BACKEND
  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/teachers");
      const data = await res.json();
      if (res.ok) {
        setTeachers(data);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchTeachers();
  }, []);

  // ✅ SUBMIT MANUAL EMERGENCY ADJUSTMENT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAdjustment: ClassAdjustment = {
      id: Date.now().toString(),
      teacherName: formData.teacherName,
      className: formData.className,
      originalDate: formData.originalDate,
      originalTime: formData.originalTime,
      newDate: formData.newDate,
      newTime: formData.newTime,
      newRoom: formData.newRoom,
      reason: formData.reason,
      type: formData.type,
      status: 'approved',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    };

    setAdjustments(prev => [newAdjustment, ...prev]);
    onCreateAdjustment(newAdjustment);

    setFormData({
      teacherName: '',
      className: '',
      originalDate: '',
      originalTime: '',
      newDate: '',
      newTime: '',
      newRoom: '',
      reason: '',
      type: 'reschedule'
    });

    setIsModalOpen(false);
  };

  // ✅ HANDLE APPROVAL ACTIONS
  const handleAdminAction = async (leaveId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/admin-action", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveId, action })
      });
      if (res.ok) {
        alert(`Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully! ✅`);
        fetchLeaves();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to execute action");
      }
    } catch (err) {
      console.error("Error updating leave action:", err);
    }
  };

  // ✅ HANDLE ASSIGNING SUBSTITUTE
  const handleAssignSubstitute = async (leaveId: string, classId: string) => {
    const key = `${leaveId}-${classId}`;
    const teacherEmail = selectedTeacherEmails[key];
    if (!teacherEmail) {
      alert("Please select a substitute teacher from the dropdown first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/leaves/assign-substitute", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveId, classId, teacherEmail })
      });
      if (res.ok) {
        alert("Substitute teacher assigned successfully! ✅");
        fetchLeaves();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to assign substitute");
      }
    } catch (err) {
      console.error("Error assigning substitute:", err);
    }
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDropdownChange = (leaveId: string, classId: string, value: string) => {
    setSelectedTeacherEmails(prev => ({
      ...prev,
      [`${leaveId}-${classId}`]: value
    }));
  };

  return (
    <div className="space-y-6">

      {/* ADMIN LEAVE REQUESTS */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">Leave Requests & Class Substitutions</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+</span> Create Adjustment
          </button>
        </div>

        {leaveRequests.length === 0 ? (
          <p className="text-gray-500">No leave requests found in the system</p>
        ) : (
          leaveRequests.map((leave: any) => (
            <div key={leave._id} className="border p-4 mb-4 rounded-lg bg-gray-50 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{leave.teacherEmail}</h3>
                  <p className="text-sm text-gray-600"><strong>Type:</strong> <span className="capitalize">{leave.type}</span></p>
                  <p className="text-sm text-gray-600"><strong>Dates:</strong> {leave.startDate} to {leave.endDate}</p>
                  <p className="text-sm text-gray-600"><strong>Reason:</strong> {leave.reason}</p>
                  <p className="text-sm mt-1">
                    <strong>Status:</strong>{" "}
                    <span className={`capitalize font-bold ${
                      leave.status === 'approved' ? 'text-green-600' :
                      leave.status === 'rejected' ? 'text-red-600' :
                      leave.status === 'ready_for_admin' ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {leave.status.replace("_", " ")}
                    </span>
                  </p>
                </div>
                
                {/* Approve/Reject Buttons */}
                {leave.status !== "approved" && leave.status !== "rejected" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdminAction(leave._id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                      Approve Leave
                    </button>
                    <button
                      onClick={() => handleAdminAction(leave._id, 'reject')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                      Reject Leave
                    </button>
                  </div>
                )}
              </div>

              {/* AFFECTED CLASSES */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Affected Classes:</h4>

                {leave.affectedClasses && leave.affectedClasses.length > 0 ? (
                  leave.affectedClasses.map((cls: any) => {
                    const key = `${leave._id}-${cls.classId || cls._id}`;
                    const classDate = cls.date || leave.startDate;
                    const freeTeachers = getAvailableTeachersForSlot(
                      teachers,
                      classDate,
                      cls.time,
                      leave.teacherEmail,
                      cls.duration
                    );

                    const assignedTeacher = teachers.find(t => t.email === cls.substituteTeacher);

                    return (
                      <div key={cls.classId || cls._id} className="ml-4 border p-3 my-2 rounded-lg bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cls.subject}</p>
                          <p className="text-xs text-gray-600">
                            ⏰ <strong>Time:</strong> {cls.time} | 📅 <strong>Date:</strong> {classDate}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Substitute:</strong>{" "}
                            {cls.substituteTeacher ? (
                              <span className="font-semibold text-blue-600">
                                {assignedTeacher ? `${assignedTeacher.name} [${getTeacherSubject(assignedTeacher)}]` : cls.substituteTeacher}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-medium">Not Assigned</span>
                            )}
                            {" | "}
                            <strong>Status:</strong>{" "}
                            <span className={`capitalize font-semibold ${
                              cls.substituteStatus === 'accepted' ? 'text-green-600' :
                              cls.substituteStatus === 'rejected' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {cls.substituteStatus || 'pending'}
                            </span>
                          </p>
                        </div>

                        {/* Assign Substitute Controls */}
                        {(!cls.substituteTeacher || cls.substituteStatus === "pending" || cls.substituteStatus === "rejected") && (
                          <div className="flex flex-col gap-1 items-end">
                            <div className="flex gap-2 items-center">
                              <select
                                value={selectedTeacherEmails[key] || ""}
                                onChange={(e) => handleDropdownChange(leave._id, cls.classId || cls._id, e.target.value)}
                                className="border p-1.5 text-xs rounded-lg max-w-[280px] bg-white focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">
                                  {freeTeachers.length > 0 
                                    ? `-- Select Free Faculty (${freeTeachers.length} available) --`
                                    : `-- No faculty free at ${cls.time} --`}
                                </option>
                                {freeTeachers.map((t: any) => (
                                  <option key={t.email} value={t.email}>
                                    {t.name} — {getTeacherSubject(t)} ({t.department || 'CSE'}) • [Free]
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAssignSubstitute(leave._id, cls.classId || cls._id)}
                                disabled={!selectedTeacherEmails[key]}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                              >
                                Assign
                              </button>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-medium">
                              {freeTeachers.length > 0 
                                ? `✓ ${freeTeachers.length} faculty have leisure period at ${cls.time}` 
                                : `⚠️ No faculty available with leisure period`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 ml-4">No affected classes registered.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MANUAL EMERGENCY ADJUSTMENTS */}
      {adjustments.length > 0 && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⚡</span> Recent Emergency Adjustments ({adjustments.length})
          </h3>
          <div className="space-y-2.5">
            {adjustments.map((adj) => (
              <div key={adj.id} className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-purple-900">{adj.className}</span>
                  <span className="text-gray-600"> • Teacher: {adj.teacherName}</span>
                  <p className="text-gray-500 mt-0.5">
                    {adj.type}: {adj.originalDate} ({adj.originalTime}) → {adj.newDate || 'Cancelled'} ({adj.newTime || ''}) {adj.newRoom ? `in ${adj.newRoom}` : ''}
                  </p>
                </div>
                <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded capitalize">
                  {adj.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create Class Adjustment</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                >
                  <option value="reschedule">Reschedule Class</option>
                  <option value="cancel">Cancel Class</option>
                  <option value="room_change">Room Change</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <select
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => {
                    const tName = typeof teacher === 'object' ? teacher.name : teacher;
                    const tEmail = typeof teacher === 'object' ? teacher.email : teacher;
                    return (
                      <option key={tEmail} value={tName}>{tName}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {defaultClasses.map((cls: string) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Date
                  </label>
                  <input
                    type="date"
                    name="originalDate"
                    value={formData.originalDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Time
                  </label>
                  <input
                    type="time"
                    name="originalTime"
                    value={formData.originalTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                  />
                </div>
              </div>

              {formData.type !== 'cancel' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Date
                      </label>
                      <input
                        type="date"
                        name="newDate"
                        value={formData.newDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Time
                      </label>
                      <input
                        type="time"
                        name="newTime"
                        value={formData.newTime}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Room (Optional)
                    </label>
                    <select
                      name="newRoom"
                      value={formData.newRoom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
                    >
                      <option value="">Select Room</option>
                      {defaultRooms.map((room: string) => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Adjustment
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Explain the reason for this emergency adjustment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[oklch(0.546_0.245_262.881)] text-white rounded-lg hover:bg-[oklch(0.5_0.245_262.881)] transition-colors"
                >
                  Create Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};