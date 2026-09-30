import { useState, useEffect } from "react";
import { LeaveRequestModal, LeaveRequest } from "@/components/LeaveRequestModal";
import { SubstituteRequestModal, SubstituteRequest } from "@/components/SubstituteRequestModal";
import { Calendar } from "@/components/Calendar";
import { ClassScheduleView } from "@/components/ClassScheduleView";
import { WeeklyScheduleView } from "@/components/WeeklyScheduleView";
import { ProfileView } from "@/components/ProfileView";
import { AdminClassAdjustments, ClassAdjustment } from "@/components/AdminClassAdjustments";
import { FacultyManagement } from "@/components/FacultyManagement";
import { ReportsView } from "@/components/ReportsView";
import { getScheduleWithSubstitutions } from "@/utils/scheduleUtils";

interface DashboardProps {
  userType: 'teacher' | 'admin';
  userEmail: string;
  onLogout: () => void;
}

export const Dashboard = ({ userType, userEmail, onLogout }: DashboardProps) => {

  const [activeSection, setActiveSection] = useState('overview');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  
  // ✅ NEW: State for incoming substitute requests from database
  const [substituteLeaves, setSubstituteLeaves] = useState<any[]>([]);
  const [selectedClassForAdjustment, setSelectedClassForAdjustment] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
  const [scheduleViewMode, setScheduleViewMode] = useState<'daily' | 'weekly'>('daily');

  // ✅ Fetch current logged in user profile
  const fetchUserProfile = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userEmail}`);
      const data = await res.json();
      if (res.ok && data) {
        setCurrentUserProfile(data);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // ✅ NEW: Registration Requests State and Handlers
  const [registrationRequests, setRegistrationRequests] = useState<any[]>([]);

  const fetchRegistrationRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/teachers/pending");
      const data = await res.json();
      if (res.ok) {
        setRegistrationRequests(data);
      }
    } catch (err) {
      console.error("Error fetching registration requests:", err);
    }
  };

  useEffect(() => {
    if (userType === 'admin') {
      fetchRegistrationRequests();
    }
  }, [userType, activeSection]);

  // ✅ NEW: Admin overview stats state
  const [adminStats, setAdminStats] = useState<any>(null);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/reports/summary");
      const data = await res.json();
      if (res.ok) {
        setAdminStats(data);
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    }
  };

  useEffect(() => {
    if (userType === 'admin') {
      fetchAdminStats();
    }
  }, [userType, activeSection]);

  const handleRegistrationAction = async (email: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${email}/${action}`, {
        method: "PUT"
      });
      if (res.ok) {
        alert(`Registration ${action === 'approve' ? 'approved' : 'rejected'} successfully! ✅`);
        fetchRegistrationRequests();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to execute action");
      }
    } catch (err) {
      console.error("Error updating registration:", err);
    }
  };

  const handleLeaveRequestAction = async (leaveId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/admin-action", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveId, action })
      });
      if (res.ok) {
        alert(`Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully! ✅`);
        fetchLeaves();
        if (userType === 'admin') {
          fetchAdminStats();
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to execute action");
      }
    } catch (err) {
      console.error("Error updating leave action:", err);
    }
  };

  // ⏰ Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ FETCH LEAVES (LIFO Stack Order: newest on top)
  const fetchLeaves = async () => {
    if (!userEmail) return;
    try {
      const url = userType === "admin"
        ? "http://localhost:5000/api/leaves/admin"
        : `http://localhost:5000/api/leaves/my/${userEmail}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        // Enforce stack order: newest requests at the top
        const sorted = Array.isArray(data) ? [...data].sort((a: any, b: any) => {
          const tA = new Date(a.createdAt || (a._id ? parseInt(a._id.substring(0,8), 16)*1000 : 0)).getTime();
          const tB = new Date(b.createdAt || (b._id ? parseInt(b._id.substring(0,8), 16)*1000 : 0)).getTime();
          return tB - tA;
        }) : [];
        setLeaveRequests(sorted);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  // ✅ FETCH SUBSTITUTE REQUESTS ASSIGNED TO THIS TEACHER
  const fetchSubstituteLeaves = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/substitute/${userEmail}`);
      const data = await res.json();
      if (res.ok) {
        const sorted = Array.isArray(data) ? [...data].sort((a: any, b: any) => {
          const tA = new Date(a.createdAt || (a._id ? parseInt(a._id.substring(0,8), 16)*1000 : 0)).getTime();
          const tB = new Date(b.createdAt || (b._id ? parseInt(b._id.substring(0,8), 16)*1000 : 0)).getTime();
          return tB - tA;
        }) : [];
        setSubstituteLeaves(sorted);
      }
    } catch (err) {
      console.error("Error fetching substitute requests:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchUserProfile();
    if (userType === 'teacher') {
      fetchSubstituteLeaves();
    }
  }, [userEmail, userType, activeSection]);

  // ---------------- HANDLERS ----------------
  const handleNewLeaveRequest = (newRequest: LeaveRequest) => {
    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  const handleNewSubstituteRequest = (_newRequest: SubstituteRequest) => {
    fetchSubstituteLeaves(); // Refresh list after requesting
    fetchLeaves();
  };

  const handleNewClassAdjustment = (_newAdjustment: ClassAdjustment) => {
    fetchLeaves();
  };

  // ✅ NEW: Respond to a substitute request (accept/reject)
  const handleSubstituteResponse = async (leaveId: string, classId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch("http://localhost:5000/api/leaves/substitute-response", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ leaveId, classId, status })
      });
      if (res.ok) {
        alert(`Request ${status} successfully! ✅`);
        fetchSubstituteLeaves();
        fetchLeaves(); // Refresh leaves so auto-approved status is updated immediately
      } else {
        const data = await res.json();
        alert(data.message || "Failed to respond");
      }
    } catch (err) {
      console.error("Error responding to substitute request:", err);
    }
  };

  // ---------------- HELPERS ----------------
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString();

  const getStatusColor = (status: string) => {
    if (status === "approved") return "text-green-600 font-bold";
    if (status === "rejected") return "text-red-600 font-bold";
    if (status === "ready_for_admin" || status === "emergency_pending" || status === "waiting_substitutes") return "text-yellow-600 font-bold";
    return "text-yellow-600 font-bold";
  };

  const getStatusText = (status: string) => {
    if (status === "ready_for_admin") return "Pending Admin Approval";
    if (status === "waiting_substitutes") return "Pending Substitutes";
    if (status === "emergency_pending") return "Pending Admin Approval (Emergency)";
    return status.replace("_", " ");
  };

  // Pending counts for badges
  const pendingIncomingCount = substituteLeaves.reduce((cnt, leave) => {
    return cnt + (leave.affectedClasses ? leave.affectedClasses.filter((c: any) => 
      c.substituteTeacher && 
      c.substituteTeacher.toLowerCase() === userEmail.toLowerCase() && 
      (c.substituteStatus === 'pending' || c.substituteStatus === 'assigned')
    ).length : 0);
  }, 0);

  const pendingLeavesCount = leaveRequests.filter(r => r.type !== 'substitution' && r.status !== 'approved' && r.status !== 'rejected').length;
  const allRelevantLeaves = [...substituteLeaves, ...leaveRequests];

  // ---------------- SECTIONS ----------------
  const teacherSections = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'leave-requests', name: 'Leave Requests', icon: '📝', badge: pendingLeavesCount },
    { id: 'substitute-requests', name: 'Substitute Requests', icon: '🔄', badge: pendingIncomingCount },
    { id: 'class-schedule', name: 'Class Schedule', icon: '📅' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  const adminSections = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'all-requests', name: 'All Requests', icon: '📋' },
    { id: 'leave-requests', name: 'Leave Requests', icon: '📝', badge: pendingLeavesCount },
    { id: 'substitute-requests', name: 'Substitute Requests', icon: '🔄' },
    { id: 'registration-approvals', name: 'Registration Approvals', icon: '✅', badge: registrationRequests.length },
    { id: 'class-schedule', name: 'Schedule', icon: '📅' },
    { id: 'emergency-adjustments', name: 'Adjustments', icon: '🚨' },
    { id: 'faculty-management', name: 'Faculty', icon: '👥' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  const sections = userType === 'teacher' ? teacherSections : adminSections;

  // ---------------- MAIN CONTENT ----------------
  const renderContent = () => {
    switch (activeSection) {

      case 'overview':
        if (userType === 'admin') {
          return (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-800">Welcome to Admin Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Here is a quick overview of UniSync's current status.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Leaves</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {leaveRequests.filter(r => r.status !== 'approved' && r.status !== 'rejected').length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Registrations</h3>
                  <p className="text-3xl font-bold text-yellow-600">{registrationRequests.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Active Teachers</h3>
                  <p className="text-3xl font-bold text-green-600">{adminStats?.activeTeachers ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Substituting Teachers</h3>
                  <p className="text-3xl font-bold text-purple-600">{adminStats?.substituteTeachers ?? 0}</p>
                </div>
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h3>
                    <button onClick={() => setActiveSection('leave-requests')} className="text-xs text-blue-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {leaveRequests.slice(0, 3).map((request: any) => (
                      <div key={request._id || request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{request.teacherEmail}</p>
                          <p className="text-xs text-gray-500">Reason: {request.reason}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    ))}
                    {leaveRequests.length === 0 && <p className="text-sm text-gray-500">No leave requests found</p>}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Pending Registrations</h3>
                    <button onClick={() => setActiveSection('registration-approvals')} className="text-xs text-blue-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {registrationRequests.slice(0, 3).map((request) => (
                      <div key={request._id || request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{request.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{request.email}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                    ))}
                    {registrationRequests.length === 0 && <p className="text-sm text-gray-500">No pending registration requests</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ✅ Dynamically get today's classes including any accepted substitute coverages and covered annotations
        const teacherScheduleToday = getScheduleWithSubstitutions(userEmail, new Date(), allRelevantLeaves);

        return (
          <div className="space-y-6">
            {/* FACULTY PROFILE BANNER */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    Welcome back, {currentUserProfile?.name || 'Professor'}!
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    currentUserProfile?.status === 'on_leave' 
                      ? 'bg-amber-400 text-amber-950' 
                      : currentUserProfile?.status === 'substitute' 
                      ? 'bg-purple-200 text-purple-900' 
                      : 'bg-green-400 text-green-950'
                  }`}>
                    {currentUserProfile?.status ? currentUserProfile.status.replace('_', ' ') : 'Active'}
                  </span>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Department of {currentUserProfile?.department || 'Computer Science'} • ID: {currentUserProfile?.employeeId || 'CS100'} • {userEmail}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-4 py-2 rounded-xl text-sm shadow transition-colors"
                >
                  + Apply Leave
                </button>
                <button
                  onClick={() => {
                    setSelectedClassForAdjustment(null);
                    setIsSubstituteModalOpen(true);
                  }}
                  className="bg-blue-800/60 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl text-sm border border-blue-400/40 transition-colors"
                >
                  🔄 Request Substitute
                </button>
              </div>
            </div>

            {/* TEACHER STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Weekly Classes</span>
                  <span className="text-lg">📚</span>
                </div>
                <p className="text-3xl font-extrabold text-blue-600">
                  {currentUserProfile?.classesAssigned || 12}
                </p>
                <p className="text-xs text-gray-500 mt-1">Assigned lectures & labs</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Leave Requests</span>
                  <span className="text-lg">📝</span>
                </div>
                <p className="text-3xl font-extrabold text-amber-600">
                  {leaveRequests.filter(r => r.type !== 'substitution').length}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {pendingLeavesCount} pending approval
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Incoming Substitute</span>
                  <span className="text-lg">🔄</span>
                </div>
                <p className="text-3xl font-extrabold text-purple-600">
                  {substituteLeaves.length}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {pendingIncomingCount} awaiting your reply
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center text-gray-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Classes Substituted</span>
                  <span className="text-lg">✅</span>
                </div>
                <p className="text-3xl font-extrabold text-green-600">
                  {currentUserProfile?.classesAdjusted || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Coverages completed</p>
              </div>
            </div>

            {/* ACTION BANNER & DIRECT ACTIONS FOR PENDING SUBSTITUTE REQUESTS */}
            {pendingIncomingCount > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-amber-200/60">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-amber-100 rounded-xl">⚡</span>
                    <div>
                      <h4 className="font-bold text-amber-950 text-base">
                        Action Required: {pendingIncomingCount} Substitute Request(s) Awaiting Your Response
                      </h4>
                      <p className="text-xs text-amber-800">
                        Review incoming class coverages below and accept or decline immediately.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('substitute-requests')}
                    className="text-xs text-amber-900 font-semibold underline hover:text-amber-950"
                  >
                    View All Coverages →
                  </button>
                </div>

                <div className="space-y-3">
                  {substituteLeaves.flatMap(leave => 
                    (leave.affectedClasses || [])
                      .filter((c: any) => 
                        c.substituteTeacher && 
                        c.substituteTeacher.toLowerCase() === userEmail.toLowerCase() && 
                        (c.substituteStatus === 'pending' || c.substituteStatus === 'assigned')
                      )
                      .map((cls: any) => ({ leave, cls }))
                  ).slice(0, 3).map(({ leave, cls }) => (
                    <div 
                      key={`${leave._id}-${cls.classId || cls._id}`} 
                      className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{cls.subject}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cls.assignedBy === 'Admin' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {cls.assignedBy === 'Admin' ? '🏛️ Admin Assignment' : '👤 Teacher Request'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          From: <strong>{cls.assignedBy === 'Admin' ? 'Administrator' : leave.teacherEmail}</strong> • Date: <strong>{cls.date || formatDate(leave.startDate)}</strong> • Time: <strong>{cls.time}</strong>
                        </p>
                        {leave.reason && (
                          <p className="text-[11px] text-gray-500 mt-0.5 italic">"Reason: {leave.reason}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleSubstituteResponse(leave._id, cls.classId || cls._id, "accepted")}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                        >
                          <span>✓</span>
                          <span>{cls.assignedBy === 'Admin' ? 'Confirm Assignment' : 'Accept Cover'}</span>
                        </button>
                        <button
                          onClick={() => handleSubstituteResponse(leave._id, cls.classId || cls._id, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                        >
                          <span>✕</span>
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TWO COLUMNS: TODAY'S SCHEDULE & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TODAY'S SCHEDULE */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Today's Class Schedule</h3>
                    <p className="text-xs text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('class-schedule')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Full Schedule →
                  </button>
                </div>

                <div className="space-y-3">
                  {teacherScheduleToday.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-xs">
                      No classes or substitute coverages scheduled for today.
                    </div>
                  ) : (
                    teacherScheduleToday.map((cls) => (
                      <div 
                        key={cls.id} 
                        className={`p-3.5 border rounded-xl flex items-center justify-between transition-colors ${
                          cls.isSubstitution 
                            ? 'bg-purple-50/70 border-purple-200 ring-1 ring-purple-100' 
                            : cls.isCovered
                            ? 'bg-emerald-50/70 border-emerald-200 ring-1 ring-emerald-100'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900 text-sm">{cls.subject}</h4>
                            {cls.isSubstitution ? (
                              <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                <span>🔄</span> Substitute Period
                              </span>
                            ) : cls.isCovered ? (
                              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                <span>✓</span> Covered by Colleague
                              </span>
                            ) : (
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded capitalize">
                                {cls.type}
                              </span>
                            )}
                          </div>
                          {cls.isSubstitution ? (
                            <p className="text-xs text-purple-900 font-medium mt-0.5">
                              👤 Covering for: <strong>{cls.substituteFor}</strong>
                            </p>
                          ) : cls.isCovered ? (
                            <p className="text-xs text-emerald-900 font-medium mt-0.5">
                              ✓ Covered by: <strong>{cls.coveredBy}</strong>
                            </p>
                          ) : null}
                          <p className="text-xs text-gray-500 mt-0.5">
                            🕒 {cls.time} ({cls.duration}) • 📍 {cls.room}
                          </p>
                        </div>

                        {cls.isSubstitution ? (
                          <span className="text-xs bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-bold">
                            ✓ Accepted Cover
                          </span>
                        ) : cls.isCovered ? (
                          <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
                            ✓ Cover Arranged
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedClassForAdjustment({
                                ...cls,
                                date: new Date().toISOString().split('T')[0]
                              });
                              setIsSubstituteModalOpen(true);
                            }}
                            className="text-xs bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                          >
                            Request Cover
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RECENT LEAVE & SUBSTITUTE STATUS */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Recent Leave Applications</h3>
                    <p className="text-xs text-gray-500">Track approvals and substitute coverage status</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('leave-requests')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    View All ({leaveRequests.filter(r => r.type !== 'substitution').length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {leaveRequests.filter((r: any) => r.type !== 'substitution').length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-3xl mb-2">📝</p>
                      <p className="text-xs text-gray-500">No leave requests submitted yet.</p>
                      <button
                        onClick={() => setIsLeaveModalOpen(true)}
                        className="mt-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-semibold"
                      >
                        Apply for Leave
                      </button>
                    </div>
                  ) : (
                    leaveRequests.filter((r: any) => r.type !== 'substitution').slice(0, 3).map((req: any) => (
                      <div key={req._id || req.id} className="p-3.5 bg-gray-50 border rounded-xl space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-gray-800">{req.type || 'Leave Request'}</span>
                            <p className="text-xs text-gray-500">Reason: {req.reason}</p>
                            <p className="text-xs text-gray-400">
                              {formatDate(req.startDate)} - {formatDate(req.endDate)}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                            req.status === 'approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getStatusText(req.status)}
                          </span>
                        </div>
                        {req.affectedClasses && req.affectedClasses.length > 0 && (
                          <p className="text-[11px] text-blue-600 pt-1 border-t border-gray-200/60">
                            🔄 {req.affectedClasses.length} class slot(s) for substitution
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'all-requests':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Requests Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Leave Requests</h3>
                  <p className="text-2xl font-bold text-blue-600">{leaveRequests.length}</p>
                  <p className="text-sm text-blue-600">
                    {leaveRequests.filter(r => r.status !== 'approved' && r.status !== 'rejected').length} pending
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Registration Requests</h3>
                  <p className="text-2xl font-bold text-green-600">{registrationRequests.length}</p>
                  <p className="text-sm text-green-600">
                    {registrationRequests.filter(r => r.status === 'pending').length} pending
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Substitute Covers</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {leaveRequests.reduce((sum, r) => sum + (r.affectedClasses ? r.affectedClasses.length : 0), 0)}
                  </p>
                  <p className="text-sm text-purple-600">
                    {leaveRequests.reduce((sum, r) => sum + (r.affectedClasses ? r.affectedClasses.filter((c: any) => c.substituteStatus === 'pending').length : 0), 0)} pending
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
                <div className="space-y-3">
                  {leaveRequests.filter((r: any) => r.type !== 'substitution').slice(0, 3).map((request: any) => (
                    <div key={request._id || request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{request.teacherEmail}</p>
                        <p className="text-xs text-gray-500">Reason: {request.reason}</p>
                        <p className="text-xs text-gray-500">{formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                  {leaveRequests.filter((r: any) => r.type !== 'substitution').length === 0 && <p className="text-sm text-gray-500">No leave requests found</p>}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registration Requests</h3>
                <div className="space-y-3">
                  {registrationRequests.slice(0, 3).map((request) => (
                    <div key={request._id || request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-medium text-gray-900">{request.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{request.email}</p>
                        <p className="text-xs text-gray-500">Dept: {request.department || 'N/A'} | ID: {request.employeeId || 'N/A'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  ))}
                  {registrationRequests.length === 0 && <p className="text-sm text-gray-500">No pending registration requests</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'registration-approvals':
        return (
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Registration Approval Requests</h2>
              <p className="text-sm text-gray-500 mt-1">Approve new teacher and staff accounts before they can log in.</p>
            </div>
            {registrationRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No registration requests require your approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrationRequests.map((request: any) => (
                  <div key={request._id || request.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition-shadow flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {request.name || 'No Name Provided'}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 capitalize">
                          {request.role}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Email:</strong> {request.email}</p>
                        <p><strong>Department:</strong> {request.department || 'Not Assigned'}</p>
                        <p><strong>Employee ID:</strong> {request.employeeId || 'N/A'}</p>
                        <p><strong>Phone:</strong> {request.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRegistrationAction(request.email, 'approve')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm rounded shadow-sm transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRegistrationAction(request.email, 'reject')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded shadow-sm transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'leave-requests':
        const actualLeaves = leaveRequests.filter((req: any) => req.type !== 'substitution');
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
                <p className="text-xs text-gray-500 mt-0.5">Official faculty leaves (sick, casual, personal, medical)</p>
              </div>
              {userType === "teacher" && (
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  + New Leave
                </button>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {actualLeaves.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border">
                  <p className="text-gray-400 text-3xl mb-1">📝</p>
                  <p className="text-gray-500 text-sm">No leave requests found.</p>
                </div>
              ) : (
                actualLeaves.map((req: any) => (
                  <div key={req._id || req.id} className="p-3 border rounded bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        {userType === 'admin' && (
                          <p className="mb-1"><b>Teacher:</b> <span className="font-semibold text-blue-600">{req.teacherEmail}</span></p>
                        )}
                        <p><b>Reason:</b> {req.reason}</p>
                        <p><b>From:</b> {formatDate(req.startDate)}</p>
                        <p><b>To:</b> {formatDate(req.endDate)}</p>
                    <p className={getStatusColor(req.status)}>
                      <b>Status:</b> {getStatusText(req.status)}
                    </p>
                  </div>

                  {/* Direct Inline Approval Buttons for Admin */}
                  {userType === 'admin' && req.status !== "approved" && req.status !== "rejected" && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLeaveRequestAction(req._id || req.id, 'approve')}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded shadow-sm transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleLeaveRequestAction(req._id || req.id, 'reject')}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded shadow-sm transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {req.affectedClasses && req.affectedClasses.length > 0 && (
                  <div className="mt-2 text-sm pl-4 border-l-2 border-gray-300 space-y-1">
                    <p className="font-semibold text-gray-700">Affected Classes:</p>
                    {req.affectedClasses.map((cls: any, i: number) => (
                      <div key={i} className="text-sm bg-gray-50 p-2 rounded border flex justify-between items-center max-w-lg mt-1">
                        <div>
                          <p className="font-medium text-gray-800">{cls.subject}</p>
                          <p className="text-xs text-gray-500">{cls.time} • Substitute: {cls.substituteTeacher || 'None'}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                          cls.substituteStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                          cls.substituteStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                          cls.substituteStatus === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cls.substituteStatus || 'pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );

  case 'substitute-requests':
    if (userType === 'admin') {
      const allSubstitutionRequests = leaveRequests.filter(req => req.type === 'substitution');
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Teacher Substitution Requests</h2>
              <p className="text-xs text-gray-500 mt-0.5">Class delegations and peer substitutions requested by faculty members</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
              {allSubstitutionRequests.length} Total Substitution Requests
            </span>
          </div>

          <div className="space-y-4">
            {allSubstitutionRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-400 text-4xl mb-2">🔄</p>
                <h3 className="font-semibold text-gray-700 text-base">No Substitution Requests</h3>
                <p className="text-gray-500 text-xs mt-1">No faculty members have requested class substitutions at this time.</p>
              </div>
            ) : (
              allSubstitutionRequests.map((sub: any) => (
                <div key={sub._id || sub.id} className="p-4 bg-white border rounded-xl shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Substitution Request
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{sub.teacherEmail}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1"><strong>Reason:</strong> {sub.reason}</p>
                      <p className="text-xs text-gray-500"><strong>Date:</strong> {formatDate(sub.startDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                        sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusText(sub.status)}
                      </span>
                      {userType === 'admin' && sub.status !== "approved" && sub.status !== "rejected" && (
                        <div className="flex gap-1.5 ml-1">
                          <button 
                            onClick={() => handleLeaveRequestAction(sub._id || sub.id, 'approve')}
                            className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded shadow-xs transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleLeaveRequestAction(sub._id || sub.id, 'reject')}
                            className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded shadow-xs transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {sub.affectedClasses && sub.affectedClasses.length > 0 && (
                    <div className="pl-3 border-l-2 border-blue-500 space-y-2 pt-1">
                      <h5 className="font-semibold text-xs text-gray-700">Affected Class & Substitute Teacher:</h5>
                      {sub.affectedClasses.map((cls: any, i: number) => (
                        <div key={i} className="text-xs bg-gray-50 p-3 rounded-lg border flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{cls.subject}</p>
                            <p className="text-gray-500 mt-0.5">🕒 {cls.time} | 📅 {cls.date || formatDate(sub.startDate)}</p>
                            <p className="text-blue-600 font-medium mt-0.5">
                              Covering Substitute: <strong>{cls.substituteTeacher || 'None Assigned'}</strong>
                            </p>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-xs font-bold capitalize ${
                            cls.substituteStatus === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                            cls.substituteStatus === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                            cls.substituteStatus === 'assigned' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {cls.substituteStatus === 'accepted' ? '✓ Accepted by Substitute' :
                             cls.substituteStatus === 'rejected' ? '✕ Declined' :
                             '⏳ Pending Response'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    const incomingRequests = substituteLeaves;
    const outgoingRequests = leaveRequests.filter(req => 
      req.type === 'substitution' || (req.affectedClasses && req.affectedClasses.some((c: any) => c.substituteTeacher))
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Substitute Coverages</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage class delegations and substitutions</p>
          </div>
          <button
            onClick={() => {
              setSelectedClassForAdjustment(null);
              setIsSubstituteModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Request Substitute
          </button>
        </div>

        {/* SECTION 1: INCOMING COVERAGE REQUESTS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span>📥</span> Requests Awaiting Your Cover (Incoming)
            </h3>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
              {incomingRequests.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-400 text-3xl mb-1">📬</p>
                <p className="text-gray-500 text-sm">No incoming substitute requests assigned to you.</p>
              </div>
            ) : (
              incomingRequests.map((leave: any) => {
                const classesForMe = (leave.affectedClasses || []).filter((c: any) => 
                  c.substituteTeacher && c.substituteTeacher.toLowerCase() === userEmail.toLowerCase()
                );
                
                return (
                  <div key={leave._id} className="p-4 bg-gray-50 border rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">
                            {leave.affectedClasses?.some((c: any) => c.assignedBy === 'Admin') 
                              ? `🏛️ Official Admin Assignment (Delegation for ${leave.teacherEmail})` 
                              : `Request from: ${leave.teacherEmail}`}
                          </h4>
                          {leave.affectedClasses?.some((c: any) => c.assignedBy === 'Admin') && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                              Admin Assigned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5"><strong>Reason:</strong> {leave.reason}</p>
                        <p className="text-xs text-gray-500"><strong>Date:</strong> {formatDate(leave.startDate)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusText(leave.status)}
                      </span>
                    </div>
                    
                    <div className="pl-3 border-l-2 border-blue-500 space-y-2">
                      <h5 className="font-semibold text-xs text-gray-700">Affected Classes Assigned to You:</h5>
                      {classesForMe.map((cls: any, index: number) => (
                        <div key={index} className="text-xs bg-white p-3.5 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900 text-sm">{cls.subject}</p>
                              {cls.assignedBy === 'Admin' && (
                                <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-1.5 py-0.2 rounded border border-purple-200">
                                  Assigned by Admin
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 mt-0.5">🕒 {cls.time} | 📅 {cls.date || formatDate(leave.startDate)}</p>
                            <p className="mt-1">
                              Status: <span className={`font-bold capitalize ${
                                cls.substituteStatus === 'accepted' ? 'text-green-600' :
                                cls.substituteStatus === 'rejected' ? 'text-red-600' :
                                cls.substituteStatus === 'assigned' ? 'text-purple-600' :
                                'text-amber-600'
                              }`}>{cls.substituteStatus}</span>
                            </p>
                          </div>
                          
                          {(cls.substituteStatus === "pending" || cls.substituteStatus === "assigned") && (
                            <div className="flex items-center gap-2 mt-2 sm:mt-0">
                              <button
                                onClick={() => handleSubstituteResponse(leave._id, cls.classId || cls._id, "accepted")}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                              >
                                <span>✓</span>
                                <span>{cls.assignedBy === 'Admin' ? 'Confirm Assignment' : 'Accept Cover'}</span>
                              </button>
                              <button
                                onClick={() => handleSubstituteResponse(leave._id, cls.classId || cls._id, "rejected")}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                              >
                                <span>✕</span>
                                <span>Decline</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SECTION 2: OUTGOING COVERAGE REQUESTS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span>📤</span> Your Coverage Requests (Outgoing)
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {outgoingRequests.length} Sent
            </span>
          </div>

          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-400 text-3xl mb-1">📬</p>
                <p className="text-gray-500 text-sm">You have not sent any substitute requests.</p>
              </div>
            ) : (
              outgoingRequests.map((req: any) => (
                <div key={req._id || req.id} className="p-4 bg-gray-50 border rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{req.type || 'Substitution'}</h4>
                      <p className="text-xs text-gray-600"><strong>Reason:</strong> {req.reason}</p>
                      <p className="text-xs text-gray-500"><strong>Date:</strong> {formatDate(req.startDate)}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      req.status === 'approved' ? 'bg-green-100 text-green-800' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                  
                  {req.affectedClasses && req.affectedClasses.length > 0 && (
                    <div className="pl-3 border-l-2 border-green-500 space-y-2 mt-2">
                      <h5 className="font-semibold text-xs text-gray-700">Cover Details:</h5>
                      {req.affectedClasses.map((cls: any, i: number) => (
                        <div key={i} className="text-xs bg-white p-2.5 rounded-lg border flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{cls.subject}</p>
                            <p className="text-gray-500">{cls.time} • Substitute: {cls.substituteTeacher || 'None Assigned'}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                            cls.substituteStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                            cls.substituteStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            cls.substituteStatus === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cls.substituteStatus || 'pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );

      case 'class-schedule':
        return userType === "admin"
          ? <WeeklyScheduleView selectedDate={selectedDate} userType={userType} />
          : (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Class Schedule & Timetable</h3>
                  <p className="text-xs text-gray-500">Toggle between your personal daily schedule and the department weekly timetable</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setScheduleViewMode('daily')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      scheduleViewMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📅 Daily Schedule
                  </button>
                  <button
                    onClick={() => setScheduleViewMode('weekly')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      scheduleViewMode === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📊 Department Timetable
                  </button>
                </div>
              </div>

              {scheduleViewMode === 'daily' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Calendar 
                    selectedDate={selectedDate} 
                    onDateSelect={setSelectedDate} 
                    substituteLeaves={allRelevantLeaves}
                  />
                  <ClassScheduleView 
                    selectedDate={selectedDate} 
                    userEmail={userEmail} 
                    substituteLeaves={allRelevantLeaves}
                    onRequestAdjustment={(session: any) => {
                      setSelectedClassForAdjustment({
                        ...session,
                        date: selectedDate.toISOString().split('T')[0]
                      });
                      setIsSubstituteModalOpen(true);
                    }}
                  />
                </div>
              ) : (
                <WeeklyScheduleView selectedDate={selectedDate} userType={userType} />
              )}
            </div>
          );

      case 'emergency-adjustments':
        return <AdminClassAdjustments onCreateAdjustment={handleNewClassAdjustment} />;

      case 'faculty-management':
        return <FacultyManagement />;

      case 'reports':
        return <ReportsView />;

      case 'profile':
        return <ProfileView userEmail={userEmail} userType={userType} />;

      default:
        return <div>Section Coming Soon</div>;
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleNewLeaveRequest}
        userEmail={userEmail}
      />
      <SubstituteRequestModal
        isOpen={isSubstituteModalOpen}
        onClose={() => {
          setIsSubstituteModalOpen(false);
          setSelectedClassForAdjustment(null);
        }}
        onSubmit={handleNewSubstituteRequest}
        userEmail={userEmail}
        preselectedClass={selectedClassForAdjustment}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* HEADER */}
        <header className="bg-white shadow-xs border-b px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="font-black text-2xl tracking-tight text-blue-600 flex items-center gap-1.5">
              <span>🎓</span> UniSync
            </h1>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1 ${
              userType === 'admin' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              <span>{userType === 'admin' ? '🛡️' : '👨‍🏫'}</span>
              <span>{userType === 'admin' ? 'Administrator Portal' : 'Faculty / Teacher Portal'}</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-semibold text-gray-800 text-sm">{currentUserProfile?.name || userEmail}</p>
              <p className="text-xs text-gray-400 font-mono">{userEmail} • {currentTime}</p>
            </div>
            <button 
              onClick={onLogout} 
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </header>

        <div className="flex">

          {/* SIDEBAR */}
          <aside className="w-64 bg-white min-h-[calc(100vh-80px)] p-4 border-r">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center justify-between w-full text-left p-3 rounded-xl mb-1.5 font-medium transition-colors ${
                  activeSection === sec.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {sec.icon && <span className="text-lg">{sec.icon}</span>}
                  <span>{sec.name}</span>
                </div>
                {sec.badge && sec.badge > 0 ? (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeSection === sec.id ? "bg-white text-blue-700" : "bg-red-500 text-white"
                  }`}>
                    {sec.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-8">
            {renderContent()}
          </main>

        </div>
      </div>
    </>
  );
};