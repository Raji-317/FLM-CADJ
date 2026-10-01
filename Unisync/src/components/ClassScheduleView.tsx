import { useState } from "react";
import { 
  getScheduleForDate, 
  getScheduleWithSubstitutions, 
  getAllCollegeClassesForDate, 
  FACULTY_DIRECTORY, 
  ClassSession 
} from "@/utils/scheduleUtils";

interface ClassScheduleViewProps {
  selectedDate: Date;
  userEmail: string;
  userType?: 'teacher' | 'admin';
  onDateChange?: (date: Date) => void;
  substituteLeaves?: any[];
  onRequestAdjustment?: (session: ClassSession) => void;
}

export const ClassScheduleView = ({ 
  selectedDate, 
  userEmail, 
  userType = 'teacher',
  onDateChange,
  substituteLeaves = [], 
  onRequestAdjustment 
}: ClassScheduleViewProps) => {

  // Admin filter states
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterTeacher, setFilterTeacher] = useState('All');

  // Dynamic schedule computation
  const schedule: ClassSession[] = userType === 'admin'
    ? getAllCollegeClassesForDate(selectedDate, {
        department: filterDepartment,
        branch: filterBranch,
        teacherEmail: filterTeacher,
        substituteLeaves
      })
    : substituteLeaves.length > 0 
      ? getScheduleWithSubstitutions(userEmail, selectedDate, substituteLeaves)
      : getScheduleForDate(userEmail, selectedDate);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isSunday = selectedDate.getDay() === 0;

  // Day navigation helpers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange?.(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onDateChange?.(next);
  };

  // Generate weekday buttons for current week
  const getWeekDates = (baseDate: Date) => {
    const result = [];
    const curr = new Date(baseDate);
    const day = curr.getDay();
    // Monday as start of week (day === 0 is Sunday, so offset 6)
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(curr.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      result.push(d);
    }
    return result;
  };

  const currentWeekDates = getWeekDates(selectedDate);
  const weekDaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const departments = ['All', 'CSE', 'AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const hasBranch = filterDepartment === 'All' || filterDepartment === 'CSE' || filterDepartment === 'AI';
  const branchOptions = filterDepartment === 'AI' 
    ? ['All', 'AIML', 'AIDS'] 
    : filterDepartment === 'CSE' 
    ? ['All', 'CSE', 'Cyber Security'] 
    : ['All', 'CSE', 'Cyber Security', 'AIML', 'AIDS'];

  const lecturesCount = schedule.filter(s => s.type === 'lecture').length;
  const labsCount = schedule.filter(s => s.type === 'lab').length;
  const tutorialsCount = schedule.filter(s => s.type === 'tutorial').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h3 className="text-lg font-bold text-gray-900">
                {userType === 'admin' ? 'College Day-to-Day Timetable' : 'Daily Class Schedule'}
              </h3>
              {userType === 'admin' && (
                <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                  🛡️ Admin Overview
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {formatDate(selectedDate)}
            </p>
          </div>

          {/* Quick counts */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {schedule.length} Total Classes
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 border border-blue-200">
              {lecturesCount} Lectures
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 border border-emerald-200">
              {labsCount} Labs
            </span>
            {tutorialsCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100/70 text-purple-800 border border-purple-200">
                {tutorialsCount} Tutorials
              </span>
            )}
          </div>
        </div>

        {/* DAY-TO-DAY SWITCHER BAR */}
        <div className="bg-gray-50/90 p-2.5 rounded-xl border border-gray-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 self-center md:self-auto">
            <button
              onClick={handlePrevDay}
              className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 shadow-2xs transition-colors"
              title="Previous Day"
            >
              ← Prev
            </button>
            <span className="text-xs font-semibold text-gray-500 uppercase px-1">Day:</span>
          </div>

          {/* Weekday selector buttons */}
          <div className="grid grid-cols-7 gap-1.5 flex-1">
            {currentWeekDates.map((dateObj, idx) => {
              const isSelected = dateObj.toDateString() === selectedDate.toDateString();
              const isToday = dateObj.toDateString() === new Date().toDateString();
              const dayShort = weekDaysShort[idx];
              const dayNum = dateObj.getDate();

              return (
                <button
                  key={idx}
                  onClick={() => onDateChange?.(dateObj)}
                  className={`py-1.5 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs ring-2 ring-blue-400'
                      : isToday
                      ? 'bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/80'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-tight">{dayShort}</span>
                  <span className={`text-xs ${isSelected ? 'font-black' : 'font-medium'}`}>{dayNum}</span>
                </button>
              );
            })}
          </div>

          <div className="self-center md:self-auto">
            <button
              onClick={handleNextDay}
              className="px-2.5 py-1 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 shadow-2xs transition-colors"
              title="Next Day"
            >
              Next →
            </button>
          </div>
        </div>

        {/* ADMIN FILTERS (DEPARTMENT, BRANCH, FACULTY) */}
        {userType === 'admin' && (
          <div className={`grid grid-cols-1 ${hasBranch ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3 pt-1`}>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Filter Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => {
                  setFilterDepartment(e.target.value);
                  setFilterBranch('All');
                }}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50/50 font-medium"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {hasBranch && (
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Filter Branch ({filterDepartment === 'All' ? 'Available' : filterDepartment})
                </label>
                <select
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/30 text-blue-900 font-semibold"
                >
                  {branchOptions.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Filter Faculty Member
              </label>
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50/50 font-medium"
              >
                <option value="All">All Faculty Members</option>
                {Object.values(FACULTY_DIRECTORY).map(fac => (
                  <option key={fac.email} value={fac.email}>
                    {fac.name} ({fac.department})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SCHEDULE LIST */}
      <div className="p-6">
        {isSunday ? (
          <div className="text-center py-12 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 text-5xl mb-3">🏖️</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Sunday - University Weekend</h3>
            <p className="text-xs text-gray-500">
              No regular university lectures, labs, or scheduled sessions on Sundays.
            </p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
            <div className="text-gray-400 text-5xl mb-3">📅</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No Classes Scheduled for This Day</h3>
            <p className="text-xs text-gray-500">
              {userType === 'admin' 
                ? 'No classes match the selected department, branch, or faculty filters for this day.' 
                : 'You have no classes scheduled for this day.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {schedule.map((session) => {
              const isSub = session.isSubstitution;
              const isCov = session.isCovered;

              return (
                <div 
                  key={session.id} 
                  className={`border rounded-xl p-4 transition-all ${
                    isSub 
                      ? 'bg-purple-50/60 border-purple-300 ring-1 ring-purple-200 hover:shadow-md' 
                      : isCov
                      ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200 hover:shadow-sm'
                      : 'bg-white border-gray-200/80 hover:shadow-sm hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-bold text-gray-900 text-base">{session.subject}</h4>
                        
                        {/* Session Type Badge */}
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${getTypeColor(session.type)}`}>
                          {session.type}
                        </span>

                        {/* Branch & Section */}
                        {session.branch && (
                          <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-semibold">
                            {session.branch} {session.section ? `(Sec ${session.section})` : ''}
                          </span>
                        )}

                        {/* Department Badge */}
                        {session.department && (
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            🏛️ {session.department}
                          </span>
                        )}

                        {/* Substitute Duty Badge */}
                        {isSub && (
                          <span className="text-xs font-bold bg-purple-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <span>🔄</span> Substitute Period
                          </span>
                        )}

                        {/* Covered by Colleague Badge */}
                        {isCov && (
                          <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <span>✓</span> Covered by Colleague
                          </span>
                        )}
                      </div>

                      {/* Faculty Details in Admin / View mode */}
                      <div className="flex items-center gap-2 text-xs text-gray-700 mt-1 mb-2 font-medium">
                        <span className="text-blue-600 font-bold flex items-center gap-1">
                          <span>👨‍🏫</span>
                          <span>Faculty: {session.teacher || session.teacherEmail || 'Assigned Professor'}</span>
                        </span>
                        {session.teacherEmail && (
                          <span className="text-gray-400 text-[11px]">({session.teacherEmail})</span>
                        )}
                      </div>

                      {/* Detail notes for substitute or covered classes */}
                      {isSub && (
                        <div className="text-xs text-purple-900 bg-purple-100/70 rounded-lg px-2.5 py-1 my-1.5 inline-block border border-purple-200">
                          <span>👤 <strong>Covering for:</strong> {session.substituteFor}</span>
                          {session.substituteReason && (
                            <span className="text-purple-700 ml-2">({session.substituteReason})</span>
                          )}
                        </div>
                      )}

                      {isCov && (
                        <div className="text-xs text-emerald-900 bg-emerald-100/70 rounded-lg px-2.5 py-1 my-1.5 inline-block border border-emerald-200">
                          <span>✓ <strong>Assigned Substitute:</strong> {session.coveredBy} (Accepted & covering this class)</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-blue-500">🕒</span>
                          <span>{session.time} <span className="text-gray-400">({session.duration})</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-red-500">📍</span>
                          <span>{session.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span className="text-green-500">👥</span>
                          <span>{session.students} Enrolled Students</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:ml-4 flex-shrink-0">
                      {isSub ? (
                        <span className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 border border-purple-300 rounded-lg flex items-center justify-center gap-1.5">
                          <span>✓</span>
                          <span>Assigned Cover Duty</span>
                        </span>
                      ) : isCov ? (
                        <span className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5">
                          <span>✓</span>
                          <span>Coverage Arranged</span>
                        </span>
                      ) : userType === 'teacher' ? (
                        <button
                          onClick={() => onRequestAdjustment?.(session)}
                          className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>🔄</span>
                          <span>Request Cover</span>
                        </button>
                      ) : (
                        <span className="w-full sm:w-auto px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center gap-1">
                          <span>🏛️</span>
                          <span>Scheduled Session</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
