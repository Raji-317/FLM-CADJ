import { useState, useEffect } from "react";
import { 
  getScheduleForDate, 
  getAvailableTeachersForSlot, 
  getTeacherSubject, 
  ClassSession 
} from "@/utils/scheduleUtils";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: LeaveRequest) => void;
  userEmail: string;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  affectedClasses?: ClassSession[];
  substituteRequests?: SubstituteRequest[];
  isEmergency?: boolean;
}

interface SubstituteRequest {
  id: string;
  classId: string;
  substituteTeacher: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AffectedClassWithSubstitute extends ClassSession {
  date?: string;
  substituteTeacher: string;
}

export const LeaveRequestModal = ({ isOpen, onClose, onSubmit, userEmail }: LeaveRequestModalProps) => {
  const [step, setStep] = useState<'details' | 'timetable'>('details');

  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    isEmergency: false
  });

  const [teachers, setTeachers] = useState<any[]>([]);
  const [affectedClasses, setAffectedClasses] = useState<AffectedClassWithSubstitute[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [bulkSubstituteTeacher, setBulkSubstituteTeacher] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch faculty list for substitution dropdowns
  useEffect(() => {
    if (isOpen) {
      const fetchTeachers = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/teachers");
          const data = await res.json();
          if (res.ok && Array.isArray(data)) {
            setTeachers(data);
          }
        } catch (err) {
          console.error("Error fetching teachers in Leave modal:", err);
        }
      };
      fetchTeachers();
    }
  }, [isOpen]);

  // Calculate duration in days
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return null;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const durationDays = calculateDuration();

  // Handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // If start date is set after end date, adjust end date
        ...(name === 'startDate' && prev.endDate && value > prev.endDate ? { endDate: value } : {})
      }));
    }
  };

  // Step 1 -> Step 2: Dynamically calculate all classes across the requested dates
  const handleProceedToTimetable = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    // Iterate through all days in the date range
    const classes: AffectedClassWithSubstitute[] = [];
    const cur = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    while (cur <= end) {
      // Don't schedule classes on Sundays
      if (cur.getDay() !== 0) {
        const dayClasses = getScheduleForDate(userEmail, cur);
        const dateStr = cur.toISOString().split('T')[0];

        dayClasses.forEach(c => {
          classes.push({
            ...c,
            id: `${c.id}-${dateStr}`,
            date: dateStr,
            substituteTeacher: ''
          });
        });
      }
      cur.setDate(cur.getDate() + 1);
    }

    setAffectedClasses(classes);
    setSelectedClassIds(classes.map(c => c.id)); // Default to select all for teacher comfort!
    setBulkSubstituteTeacher('');
    setStep('timetable');
  };

  // Toggle select all affected classes
  const toggleSelectAll = () => {
    if (selectedClassIds.length === affectedClasses.length) {
      setSelectedClassIds([]);
    } else {
      setSelectedClassIds(affectedClasses.map(c => c.id));
    }
  };

  // Toggle selection for a single class
  const toggleSelectClass = (id: string) => {
    setSelectedClassIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Bulk assign chosen teacher to all selected classes (respecting leisure periods)
  const handleBulkAssign = () => {
    if (!bulkSubstituteTeacher) {
      alert("Please choose a colleague from the dropdown to assign to the selected classes.");
      return;
    }
    if (selectedClassIds.length === 0) {
      alert("Please select at least one class session.");
      return;
    }

    let assignedCount = 0;
    let conflictCount = 0;

    setAffectedClasses(prev => prev.map(cls => {
      if (!selectedClassIds.includes(cls.id)) return cls;

      const freeTeachers = getAvailableTeachersForSlot(
        teachers,
        cls.date || formData.startDate || new Date(),
        cls.time,
        userEmail
      );

      const isFree = freeTeachers.some(t => t.email.toLowerCase() === bulkSubstituteTeacher.toLowerCase());
      if (isFree) {
        assignedCount++;
        return { ...cls, substituteTeacher: bulkSubstituteTeacher };
      } else {
        conflictCount++;
        return cls;
      }
    }));

    if (conflictCount > 0) {
      alert(`Assigned to ${assignedCount} session(s). ${conflictCount} session(s) could not be assigned because this colleague has a class conflict at that slot.`);
    } else {
      alert(`Successfully assigned substitute to all ${assignedCount} selected class session(s)! ✅`);
    }
  };

  // 1-Click Auto-assign best available free faculty for each selected class
  const handleAutoAssignFree = () => {
    if (selectedClassIds.length === 0) {
      alert("Please select at least one class session.");
      return;
    }

    let assignedCount = 0;
    let noFreeCount = 0;

    setAffectedClasses(prev => prev.map(cls => {
      if (!selectedClassIds.includes(cls.id)) return cls;

      const freeTeachers = getAvailableTeachersForSlot(
        teachers,
        cls.date || formData.startDate || new Date(),
        cls.time,
        userEmail
      );

      if (freeTeachers.length > 0) {
        assignedCount++;
        return { ...cls, substituteTeacher: freeTeachers[0].email };
      } else {
        noFreeCount++;
        return cls;
      }
    }));

    alert(`Automatically assigned leisure-period faculty for ${assignedCount} session(s)!${noFreeCount > 0 ? ` (${noFreeCount} slots currently have no free colleagues and will be reviewed by Admin)` : ''} 🎯`);
  };

  // Clear substitutes for selected classes
  const handleClearSelected = () => {
    setAffectedClasses(prev => prev.map(cls => 
      selectedClassIds.includes(cls.id) ? { ...cls, substituteTeacher: '' } : cls
    ));
  };

  // Update chosen substitute teacher for a class
  const handleSubstituteSelect = (classId: string, teacherEmail: string) => {
    setAffectedClasses(prev => prev.map(cls => 
      cls.id === classId ? { ...cls, substituteTeacher: teacherEmail } : cls
    ));
  };

  // Final submit to backend
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        teacherEmail: userEmail,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        isEmergency: formData.isEmergency,
        affectedClasses: affectedClasses.map(cls => ({
          classId: cls.id,
          subject: cls.subject,
          date: cls.date,
          time: cls.time,
          duration: cls.duration,
          room: cls.room,
          substituteTeacher: cls.substituteTeacher || '',
          assignedBy: 'Teacher',
          substituteStatus: cls.substituteTeacher ? 'pending' : 'pending'
        })),
        substituteRequests: affectedClasses
          .filter(cls => cls.substituteTeacher)
          .map(cls => ({
            classId: cls.id,
            substituteTeacher: cls.substituteTeacher,
            status: 'pending' as const
          }))
      };

      const res = await fetch("http://localhost:5000/api/leaves/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit leave application.");
        return;
      }

      alert("Official Leave Application Submitted Successfully! ✅");

      onSubmit({
        id: (data.leave?._id || Date.now()).toString(),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: "pending",
        submittedAt: new Date().toISOString(),
        affectedClasses: affectedClasses,
        isEmergency: formData.isEmergency
      });

      // Reset state and close
      setFormData({
        type: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
        isEmergency: false
      });
      setStep('details');
      setAffectedClasses([]);
      setSelectedClassIds([]);
      setBulkSubstituteTeacher('');
      onClose();

    } catch (err) {
      console.error("Error submitting leave:", err);
      alert("Network error while submitting leave.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h2 className="text-xl font-bold">Apply for Faculty Leave</h2>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Submit your formal leave request and assign peer coverage for impacted lecture hours.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        {/* STEP PROGRESS INDICATOR */}
        <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setStep('details')}
            className={`flex items-center gap-2 font-semibold ${
              step === 'details' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>1</span>
            <span>Leave Details</span>
          </button>

          <span className="text-gray-300">→</span>

          <div
            className={`flex items-center gap-2 font-semibold ${
              step === 'timetable' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              step === 'timetable' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>2</span>
            <span>Class Substitutions ({affectedClasses.length})</span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'details' ? (
            <form onSubmit={handleProceedToTimetable} className="space-y-4">
              
              {/* LEAVE TYPE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Leave Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-gray-800"
                >
                  <option value="casual">Casual Leave (CL) — Standard Personal Off</option>
                  <option value="sick">Medical / Sick Leave (ML) — Health & Treatment</option>
                  <option value="duty">Academic / On Duty Leave (OD) — Seminar, Exam or Conference</option>
                  <option value="earned">Earned Leave (EL) — Accumulated Annual Privilege</option>
                  <option value="personal">Special Urgent Leave — Unforeseen Emergency</option>
                </select>
              </div>

              {/* DATE RANGE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {durationDays !== null && durationDays > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900 font-medium">
                  <div className="flex items-center gap-2">
                    <span>🗓️</span>
                    <span>Total Duration: <strong>{durationDays} {durationDays === 1 ? 'Day' : 'Days'}</strong></span>
                  </div>
                  <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    {formData.startDate} to {formData.endDate}
                  </span>
                </div>
              )}

              {/* REASON */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Reason for Leave
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Specify clear academic or personal reasons for taking leave..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* EMERGENCY CHECKBOX */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="isEmergency"
                  name="isEmergency"
                  checked={formData.isEmergency}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                />
                <label htmlFor="isEmergency" className="text-xs text-amber-900 cursor-pointer">
                  <strong className="block font-bold">🚨 Mark as Emergency / Urgent Leave</strong>
                  <span className="text-amber-800">
                    Emergency leaves notify the department head immediately and allow fast-track substitute approval.
                  </span>
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Review Affected Classes</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
                <h4 className="font-bold flex items-center gap-1.5">
                  <span>💡</span> Faculty Timetable Coverage Allocation
                </h4>
                <p className="mt-1 text-blue-800">
                  Select a substitute faculty member for each lecture or lab period during your leave. 
                  <strong> Only faculty who have leisure period (free slot) during that exact time are shown.</strong>
                </p>
              </div>

              {affectedClasses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 border border-dashed rounded-xl space-y-2">
                  <div className="text-4xl">🎉</div>
                  <h4 className="font-bold text-gray-800 text-sm">No Teaching Sessions Impacted</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    You have no scheduled lectures or laboratory sessions during these leave dates. You may proceed to submit your leave application directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* SELECT ALL & BULK ACTION TOOLBAR */}
                  <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 p-4 rounded-xl border border-blue-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-blue-200/60">
                      <label className="flex items-center gap-2.5 cursor-pointer font-bold text-sm text-gray-900 select-none">
                        <input
                          type="checkbox"
                          checked={affectedClasses.length > 0 && selectedClassIds.length === affectedClasses.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Select All Sessions ({affectedClasses.length})</span>
                      </label>

                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {selectedClassIds.length} of {affectedClasses.length} Selected
                        </span>
                        {selectedClassIds.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearSelected}
                            className="text-xs text-red-600 hover:text-red-700 font-medium underline transition-colors"
                          >
                            Clear Assignments
                          </button>
                        )}
                      </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-0.5">
                      <div className="flex-1 min-w-[220px]">
                        <select
                          value={bulkSubstituteTeacher}
                          onChange={(e) => setBulkSubstituteTeacher(e.target.value)}
                          disabled={selectedClassIds.length === 0}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">-- Choose Colleague to Assign to Selected --</option>
                          {teachers
                            .filter((t: any) => t.email?.toLowerCase() !== userEmail.toLowerCase())
                            .map((t: any) => {
                              const freeCount = affectedClasses
                                .filter(c => selectedClassIds.includes(c.id))
                                .filter(c => {
                                  const freeList = getAvailableTeachersForSlot(
                                    teachers,
                                    c.date || formData.startDate || new Date(),
                                    c.time,
                                    userEmail
                                  );
                                  return freeList.some(ft => ft.email === t.email);
                                }).length;

                              const totalSelected = selectedClassIds.length || affectedClasses.length;
                              return (
                                <option key={t.email} value={t.email}>
                                  {t.name} — {getTeacherSubject(t)} • [Free for {freeCount}/{totalSelected} slots]
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleBulkAssign}
                          disabled={selectedClassIds.length === 0 || !bulkSubstituteTeacher}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs whitespace-nowrap"
                        >
                          Apply to Selected
                        </button>

                        <button
                          type="button"
                          onClick={handleAutoAssignFree}
                          disabled={selectedClassIds.length === 0}
                          title="Automatically matches the first available leisure-period faculty for each slot"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>⚡</span>
                          <span>Auto-Assign Free</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-blue-800 leading-tight">
                      💡 <strong>Comfort Tip:</strong> Check <strong>"Select All"</strong> and click <strong>"Apply to Selected"</strong> or <strong>"Auto-Assign Free"</strong> to assign all class slots at once without picking each slot individually!
                    </p>
                  </div>

                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Impacted Sessions ({affectedClasses.length}):
                  </p>

                  {affectedClasses.map((cls) => {
                    const freeTeachers = getAvailableTeachersForSlot(
                      teachers,
                      cls.date || formData.startDate || new Date(),
                      cls.time,
                      userEmail
                    );

                    return (
                      <div 
                        key={cls.id} 
                        className={`border rounded-xl p-3.5 transition-colors space-y-2.5 ${
                          selectedClassIds.includes(cls.id) 
                            ? 'border-blue-300 bg-blue-50/20' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedClassIds.includes(cls.id)}
                              onChange={() => toggleSelectClass(cls.id)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="font-bold text-gray-900 text-sm">{cls.subject}</span>
                            <span className="ml-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {cls.type}
                            </span>
                          </label>
                          <span className="text-xs text-gray-500 font-mono">
                            📅 {cls.date} • 🕒 {cls.time} ({cls.duration}) • 📍 {cls.room}
                          </span>
                        </div>

                        {/* SELECT SUBSTITUTE FOR THIS SPECIFIC SLOT */}
                        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <label className="text-xs text-gray-600 font-medium">
                            Assign Substitute:
                          </label>
                          <div className="w-full sm:w-auto flex-1 max-w-md">
                            <select
                              value={cls.substituteTeacher || ""}
                              onChange={(e) => handleSubstituteSelect(cls.id, e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                              <option value="">
                                {freeTeachers.length > 0 
                                  ? `-- Select Free Faculty (${freeTeachers.length} available) --`
                                  : `-- No faculty free at ${cls.time} (Admin will assign) --`}
                              </option>
                              {freeTeachers.map(t => (
                                <option key={t.email} value={t.email}>
                                  {t.name} — {getTeacherSubject(t)} ({t.department || 'CSE'}) • [Free]
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                              {freeTeachers.length > 0 
                                ? `✓ Showing only ${freeTeachers.length} faculty who have leisure period during this time.`
                                : `⚠️ No peer faculty free during this slot. Admin will review.`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>Submit Leave Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};