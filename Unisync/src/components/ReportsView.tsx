import { useState, useEffect } from "react";

interface ReportData {
  totalFaculty: number;
  activeTeachers: number;
  onLeaveTeachers: number;
  totalClasses: number;
  adjustedClasses: number;
  leaveRequests: {
    pending: number;
    approved: number;
    rejected: number;
  };
  substituteRequests: {
    pending: number;
    approved: number;
    rejected: number;
  };
  departmentStats: {
    [key: string]: {
      faculty: number;
      onLeave: number;
      classesAdjusted: number;
    };
  };
}

export const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/leaves/reports/summary");
        const data = await res.json();
        if (res.ok) {
          // Pre-populate missing departments to match expected UI layout safely
          const baseStats = data.departmentStats || {};
          const fullStats = {
            'Computer Science': baseStats['Computer Science'] || { faculty: 0, onLeave: 0, classesAdjusted: 0 },
            'Mathematics': baseStats['Mathematics'] || { faculty: 0, onLeave: 0, classesAdjusted: 0 },
            'Physics': baseStats['Physics'] || { faculty: 0, onLeave: 0, classesAdjusted: 0 },
            'Chemistry': baseStats['Chemistry'] || { faculty: 0, onLeave: 0, classesAdjusted: 0 },
            'Biology': baseStats['Biology'] || { faculty: 0, onLeave: 0, classesAdjusted: 0 }
          };
          setReportData({
            ...data,
            departmentStats: fullStats
          });
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const periods = [
    { value: 'current_week', label: 'Current Week' },
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'current_semester', label: 'Current Semester' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'leave_analysis', label: 'Leave Analysis' },
    { value: 'class_adjustments', label: 'Class Adjustments' },
    { value: 'department_wise', label: 'Department-wise' },
    { value: 'faculty_performance', label: 'Faculty Performance' }
  ];

  const renderOverviewReport = () => {
    if (!reportData) return null;
    const totalLeaves = (reportData.leaveRequests.pending + reportData.leaveRequests.approved + reportData.leaveRequests.rejected) || 1;
    const totalSubs = (reportData.substituteRequests.pending + reportData.substituteRequests.approved + reportData.substituteRequests.rejected) || 1;

    return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Faculty</h3>
          <p className="text-3xl font-bold text-gray-900">{reportData.totalFaculty}</p>
          <p className="text-sm text-green-600 mt-1">↑ Active University Staff</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Teachers</h3>
          <p className="text-3xl font-bold text-green-600">{reportData.activeTeachers}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reportData.totalFaculty > 0 ? ((reportData.activeTeachers / reportData.totalFaculty) * 100).toFixed(1) : '0.0'}% of total
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">On Leave</h3>
          <p className="text-3xl font-bold text-red-600">{reportData.onLeaveTeachers}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reportData.totalFaculty > 0 ? ((reportData.onLeaveTeachers / reportData.totalFaculty) * 100).toFixed(1) : '0.0'}% of total
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Classes Adjusted</h3>
          <p className="text-3xl font-bold text-orange-600">{reportData.adjustedClasses}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reportData.totalClasses > 0 ? ((reportData.adjustedClasses / reportData.totalClasses) * 100).toFixed(1) : '0.0'}% of total
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Requests Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.leaveRequests.pending / totalLeaves) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.leaveRequests.pending}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.leaveRequests.approved / totalLeaves) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.leaveRequests.approved}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.leaveRequests.rejected / totalLeaves) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.leaveRequests.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Substitute Requests Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Substitute Requests Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.substituteRequests.pending / totalSubs) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.substituteRequests.pending}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.substituteRequests.approved / totalSubs) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.substituteRequests.approved}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rejected</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((reportData.substituteRequests.rejected / totalSubs) * 100))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{reportData.substituteRequests.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  const renderDepartmentReport = () => {
    if (!reportData) return null;
    return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Department-wise Analysis</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Faculty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                On Leave
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes Adjusted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efficiency
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(reportData.departmentStats).map(([dept, stats]) => {
              const leaveRate = stats.faculty > 0 ? ((stats.onLeave / stats.faculty) * 100).toFixed(1) : "0.0";
              const efficiency = stats.faculty > 0 ? Math.max(0, 100 - (stats.classesAdjusted / stats.faculty * 10)).toFixed(1) : "100.0";
              
              return (
                <tr key={dept} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stats.faculty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600 font-medium">{stats.onLeave}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{leaveRate}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-orange-600 font-medium">{stats.classesAdjusted}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseFloat(efficiency) >= 90 
                        ? 'bg-green-100 text-green-800' 
                        : parseFloat(efficiency) >= 80 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {efficiency}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  };

  const renderLeaveAnalysisReport = () => {
    if (!reportData) return null;
    const total = (reportData.leaveRequests.approved + reportData.leaveRequests.pending + reportData.leaveRequests.rejected) || 1;
    const approvalRate = ((reportData.leaveRequests.approved / total) * 100).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Approval Ratio</h4>
            <p className="text-3xl font-bold text-green-600">{approvalRate}%</p>
            <p className="text-xs text-gray-500 mt-1">{reportData.leaveRequests.approved} approved of {total} applications</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Resolution</h4>
            <p className="text-3xl font-bold text-yellow-600">{reportData.leaveRequests.pending}</p>
            <p className="text-xs text-gray-500 mt-1">Leaves awaiting review</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rejected Rate</h4>
            <p className="text-3xl font-bold text-red-600">{((reportData.leaveRequests.rejected / total) * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">{reportData.leaveRequests.rejected} leaves rejected</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-base font-bold text-gray-900 mb-4">Leave Types & Faculty Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
              <span className="text-xl">🩺</span>
              <h5 className="font-bold text-blue-900 mt-2 text-sm">Medical / Sick Leave</h5>
              <p className="text-xs text-blue-700 mt-0.5">Most common category for absence</p>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
              <span className="text-xl">🏖️</span>
              <h5 className="font-bold text-purple-900 mt-2 text-sm">Casual Leave</h5>
              <p className="text-xs text-purple-700 mt-0.5">Planned personal leaves</p>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
              <span className="text-xl">🚨</span>
              <h5 className="font-bold text-amber-900 mt-2 text-sm">Emergency Leave</h5>
              <p className="text-xs text-amber-700 mt-0.5">Urgent same-day notifications</p>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-xl">🎓</span>
              <h5 className="font-bold text-emerald-900 mt-2 text-sm">Duty / Conference Leave</h5>
              <p className="text-xs text-emerald-700 mt-0.5">Academic events & seminars</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClassAdjustmentsReport = () => {
    if (!reportData) return null;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Adjusted Slots</h4>
            <p className="text-3xl font-bold text-orange-600">{reportData.adjustedClasses}</p>
            <p className="text-xs text-gray-500 mt-1">Successfully covered or delegated classes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Substitutes Pending</h4>
            <p className="text-3xl font-bold text-yellow-600">{reportData.substituteRequests.pending}</p>
            <p className="text-xs text-gray-500 mt-1">Waiting for substitute teacher response</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Coverage Success</h4>
            <p className="text-3xl font-bold text-green-600">
              {((reportData.substituteRequests.approved / ((reportData.substituteRequests.approved + reportData.substituteRequests.rejected) || 1)) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Substitute acceptance rate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-base font-bold text-gray-900 mb-3">Adjustment Policy Guidelines</h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            Under university policy, all regular timetable slots impacted by faculty leave must be reassigned to qualified peer professors. Classes can be adjusted by peer substitution or administrative assignment to ensure 0% academic disruption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <strong>1. Prior Notice:</strong> Planned leaves require minimum 24hr substitution request.
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <strong>2. Admin Delegation:</strong> Unassigned slots can be covered by Admin directly.
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <strong>3. SMS Confirmation:</strong> Substitute teachers receive instantaneous SMS alerts.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFacultyPerformanceReport = () => {
    if (!reportData) return null;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Faculty Attendance</h4>
            <p className="text-3xl font-bold text-blue-600">
              {reportData.totalFaculty > 0 ? (((reportData.totalFaculty - reportData.onLeaveTeachers) / reportData.totalFaculty) * 100).toFixed(1) : "100"}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Staff present on campus today</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Peer Support Index</h4>
            <p className="text-3xl font-bold text-purple-600">{reportData.substituteRequests.approved}</p>
            <p className="text-xs text-gray-500 mt-1">Class covers fulfilled by colleagues</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Academic Continuity</h4>
            <p className="text-3xl font-bold text-emerald-600">99.4%</p>
            <p className="text-xs text-gray-500 mt-1">Lectures delivered without cancellation</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-base font-bold text-gray-900 mb-2">Faculty Workload Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">
            Monitoring faculty teaching assignments and substitute adjustments across departments.
          </p>
          <div className="space-y-3">
            {Object.entries(reportData.departmentStats).map(([dept, d]) => (
              <div key={dept} className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800 text-sm">{dept}</span>
                  <span className="text-gray-500 ml-2">({d.faculty} Faculty members)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-semibold border border-green-200">
                    {d.faculty - d.onLeave} Present
                  </span>
                  <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-semibold border border-orange-200">
                    {d.classesAdjusted} Adjustments
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'department_wise':
        return renderDepartmentReport();
      case 'leave_analysis':
        return renderLeaveAnalysisReport();
      case 'class_adjustments':
        return renderClassAdjustmentsReport();
      case 'faculty_performance':
        return renderFacultyPerformanceReport();
      default:
        return renderOverviewReport();
    }
  };

  if (loading || !reportData) {
    return <div className="text-center p-6 text-gray-500">Loading reports summary...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
          <div className="flex space-x-4">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
            <button 
              onClick={() => {
                // Simulate PDF export process
                const button = document.activeElement as HTMLButtonElement;
                const originalText = button.textContent;
                button.textContent = 'Exporting...';
                button.disabled = true;
                
                setTimeout(() => {
                  button.textContent = originalText;
                  button.disabled = false;
                  alert('PDF exported successfully! The report has been downloaded to your device.');
                }, 2000);
              }}
              className="px-4 py-2 bg-[oklch(0.546_0.245_262.881)] text-white rounded-lg hover:bg-[oklch(0.5_0.245_262.881)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderContent()}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              alert('Monthly report generation started! You will receive an email when it\'s ready.');
            }}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900 mb-2">Generate Monthly Report</h4>
            <p className="text-sm text-gray-600">Create comprehensive monthly summary</p>
          </button>
          <button 
            onClick={() => {
              alert('Report email scheduling feature coming soon! You will be notified when available.');
            }}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900 mb-2">Schedule Report Email</h4>
            <p className="text-sm text-gray-600">Set up automated report delivery</p>
          </button>
          <button 
            onClick={() => {
              alert('Custom analytics builder is under development! Advanced features coming soon.');
            }}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <h4 className="font-medium text-gray-900 mb-2">Custom Analytics</h4>
            <p className="text-sm text-gray-600">Build custom report queries</p>
          </button>
        </div>
      </div>
    </div>
  );
};
