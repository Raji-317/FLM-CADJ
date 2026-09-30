import { useState, useEffect } from "react";
import { FacultyProfileModal, FacultyMember } from "@/components/FacultyProfileModal";

export const FacultyManagement = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [facultyActions, setFacultyActions] = useState<{[key: string]: 'approved_return' | null}>({});
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ New States for Creating HODs / Teachers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "teacher",
    phone: "",
    department: "Computer Science",
    employeeId: ""
  });

  // ✅ FETCH FACULTY FROM BACKEND
  const fetchFaculty = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/teachers");
      const data = await res.json();
      if (res.ok) {
        const mapped = data.map((t: any) => ({
          id: t._id,
          name: t.name || "No Name",
          email: t.email,
          department: t.department || "General",
          employeeId: t.employeeId || "TCH-" + t._id.slice(-4).toUpperCase(),
          status: t.status || "active",
          classesAssigned: t.classesAssigned || 0,
          classesAdjusted: t.classesAdjusted || 0,
          phone: t.phone || "",
          joinDate: t.joinDate || (t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : "2024-01-01"),
          address: t.address || "",
          specialization: t.specialization || "",
          qualifications: t.qualifications || "",
          experience: t.experience || "",
          emergencyContact: t.emergencyContact || "",
          role: t.role || "teacher"
        }));
        setFacultyMembers(mapped);
      }
    } catch (err) {
      console.error("Error fetching faculty:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const statuses = ['All', 'active', 'pending', 'on_leave', 'substitute'];

  const filteredFaculty = facultyMembers.filter(member => {
    const departmentMatch = selectedDepartment === 'All' || member.department === selectedDepartment;
    const statusMatch = selectedStatus === 'All' || member.status === selectedStatus;
    return departmentMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-red-100 text-red-800';
      case 'substitute':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveRegistration = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${email}/approve`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Teacher registration approved successfully! Account is now active. ✅");
        fetchFaculty();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to approve registration");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving registration");
    }
  };

  const handleRejectRegistration = async (email: string) => {
    const confirmReject = window.confirm(`Are you sure you want to reject and remove the registration for ${email}?`);
    if (!confirmReject) return;
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${email}/reject`, {
        method: "PUT"
      });
      if (res.ok) {
        alert("Registration rejected and deleted. ✕");
        fetchFaculty();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to reject registration");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting registration");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleApproveReturn = async (memberId: string, email: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${email}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" })
      });
      if (res.ok) {
        setFacultyActions(prev => ({
          ...prev,
          [memberId]: 'approved_return'
        }));
        alert('Faculty return approved successfully! status set to active. ✅');
        fetchFaculty();
        setTimeout(() => {
          setFacultyActions(prev => ({
            ...prev,
            [memberId]: null
          }));
        }, 3000);
      } else {
        alert("Failed to update teacher status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewProfile = (faculty: FacultyMember) => {
    setSelectedFaculty(faculty);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditProfile = (faculty: FacultyMember) => {
    setSelectedFaculty(faculty);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (updatedFaculty: FacultyMember) => {
    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFaculty)
      });
      if (res.ok) {
        alert("Faculty profile updated successfully! ✅");
        setFacultyMembers(prev => prev.map(f => f.email === updatedFaculty.email ? { ...f, ...updatedFaculty } : f));
        fetchFaculty();
        setIsModalOpen(false);
      } else {
        alert("Failed to update faculty profile");
      }
    } catch (err) {
      console.error("Error saving faculty profile:", err);
    }
  };

  const handleDeleteFaculty = async (email: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/teachers/${email}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Faculty member deleted successfully from the college system! 🗑️");
        setFacultyMembers(prev => prev.filter(f => f.email.toLowerCase() !== email.toLowerCase()));
        fetchFaculty();
        setIsModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete faculty member");
      }
    } catch (err) {
      console.error("Error deleting faculty:", err);
      alert("Error contacting server to delete faculty member");
    }
  };

  // ✅ SUBMIT NEW FACULTY / HOD TO BACKEND
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createFormData)
      });
      if (res.ok) {
        alert("Faculty member/HOD created successfully! ✅");
        fetchFaculty();
        setIsCreateModalOpen(false);
        setCreateFormData({
          name: "",
          email: "",
          password: "",
          role: "teacher",
          phone: "",
          department: "Computer Science",
          employeeId: ""
        });
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create faculty member");
      }
    } catch (err) {
      console.error("Error creating faculty:", err);
      alert("Error contacting server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
  };

  const getStats = () => {
    const total = facultyMembers.length;
    const active = facultyMembers.filter(f => f.status === 'active').length;
    const onLeave = facultyMembers.filter(f => f.status === 'on_leave').length;
    const substitute = facultyMembers.filter(f => f.status === 'substitute').length;
    const pending = facultyMembers.filter(f => f.status === 'pending').length;
    const totalAdjustedClasses = facultyMembers.reduce((sum, f) => sum + f.classesAdjusted, 0);

    return { total, active, onLeave, substitute, pending, totalAdjustedClasses };
  };

  const stats = getStats();

  if (isLoading) {
    return <div className="text-center p-6 text-gray-500">Loading faculty details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Faculty</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Active</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Pending Approval</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">On Leave</h3>
          <p className="text-2xl font-bold text-red-600">{stats.onLeave}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Substituting</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.substitute}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-xs border">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Adjusted Classes</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.totalAdjustedClasses}</p>
        </div>
      </div>

      {/* PENDING APPROVAL NOTIFICATION BANNER */}
      {stats.pending > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-amber-900 text-sm">
                {stats.pending} Registration Request{stats.pending > 1 ? 's' : ''} Awaiting Admin Approval
              </p>
              <p className="text-xs text-amber-700">
                Newly registered teachers cannot log in until approved. Use the quick buttons in the table below to approve them.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'pending' ? 'All' : 'pending')}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors shadow-xs ${
              selectedStatus === 'pending'
                ? 'bg-amber-800 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {selectedStatus === 'pending' ? '✓ Showing Pending' : `Filter Pending (${stats.pending})`}
          </button>
        </div>
      )}

      {/* Faculty List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Faculty Management</h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                + Add Faculty / HOD
              </button>
            </div>
            <div className="flex space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[oklch(0.546_0.245_262.881)] rounded-full flex items-center justify-center text-white font-medium text-sm animate-pulse">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        <div className="text-xs text-gray-400">ID: {member.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.department}</div>
                    <div className="text-xs text-gray-500">Joined: {formatDate(member.joinDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                      member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role === 'admin' ? 'Admin/HOD' : 'Teacher'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(member.status)}`}>
                      {member.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Assigned: <span className="font-medium">{member.classesAssigned}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Adjusted: <span className="font-medium text-orange-600">{member.classesAdjusted}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProfile(member)}
                        className="text-[oklch(0.546_0.245_262.881)] hover:text-[oklch(0.5_0.245_262.881)]"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditProfile(member)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>

                      {/* QUICK ACTION BUTTONS FOR PENDING REGISTRATIONS */}
                      {member.status === 'pending' && (
                        <div className="flex items-center space-x-1 ml-1 pl-2 border-l border-gray-200">
                          <button
                            onClick={() => handleApproveRegistration(member.email)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs transition-colors"
                            title="Approve teacher registration"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(member.email)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-xs transition-colors"
                            title="Reject teacher registration"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                      {member.status === 'on_leave' && (
                        <>
                          {facultyActions[member.id] === 'approved_return' ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                              ✓ Return Approved
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleApproveReturn(member.id, member.email)}
                              className="text-green-600 hover:text-green-950 transition-colors font-bold"
                            >
                              Approve Return
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE FACULTY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Add Faculty / HOD</h2>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  value={createFormData.name}
                  onChange={e => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Dr. Harinadh"
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={e => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="e.g. harinadhv@edu.com"
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={e => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  placeholder="Password for login"
                  className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    value={createFormData.phone}
                    onChange={e => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="e.g. 75368786867"
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Employee ID</label>
                  <input
                    value={createFormData.employeeId}
                    onChange={e => setCreateFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    required
                    placeholder="e.g. CS001"
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                  <select
                    value={createFormData.department}
                    onChange={e => setCreateFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {departments.filter(d => d !== 'All').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Access Role</label>
                  <select
                    value={createFormData.role}
                    onChange={e => setCreateFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-blue-600"
                  >
                    <option value="teacher">Teacher (Faculty Access)</option>
                    <option value="admin">Admin / HOD (Principal Access)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 p-2.5 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white p-2.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FacultyProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        faculty={selectedFaculty}
        mode={modalMode}
        onSave={handleSaveProfile}
        onDelete={handleDeleteFaculty}
      />
    </div>
  );
};
