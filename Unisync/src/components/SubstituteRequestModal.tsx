import { useState, useEffect, useMemo } from "react";
import { 
  getScheduleForDate, 
  getAvailableTeachersForSlot, 
  getTeacherSubject, 
  ClassSession 
} from "@/utils/scheduleUtils";
import { API_BASE_URL } from "@/config/api";

interface SubstituteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: SubstituteRequest) => void;
  userEmail: string;
  preselectedClass?: any; // Prop to support pre-selected class slot from schedule
}

export interface SubstituteRequest {
  id: string;
  classId: string;
  className: string;
  originalDate: string;
  originalTime: string;
  substituteTeacher: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export const SubstituteRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
  preselectedClass
}: SubstituteRequestModalProps) => {

  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    originalDate: new Date().toISOString().split('T')[0],
    originalTime: '',
    substituteTeacher: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [allLeaves, setAllLeaves] = useState<any[]>([]);

  // Fetch teachers and active leaves for availability conflict checking
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [teachersRes, leavesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/teachers`),
          fetch(`${API_BASE_URL}/api/leaves`)
        ]);
        
        if (teachersRes.ok) {
          const teacherData = await teachersRes.json();
          // Exclude currently logged in teacher
          setTeachers(Array.isArray(teacherData) ? teacherData.filter((t: any) => t.email?.toLowerCase() !== userEmail.toLowerCase()) : []);
        }

        if (leavesRes.ok) {
          const leavesData = await leavesRes.json();
          setAllLeaves(Array.isArray(leavesData) ? leavesData : []);
        }
      } catch (err) {
        console.error("Error fetching resources in SubstituteRequestModal:", err);
      }
    };

    if (isOpen) {
      fetchResources();

      // If opened via schedule slot ("Request Cover"), pre-fill slot details
      if (preselectedClass) {
        setFormData({
          classId: preselectedClass.id || '',
          className: preselectedClass.subject || '',
          originalDate: preselectedClass.date || new Date().toISOString().split('T')[0],
          originalTime: preselectedClass.time || '',
          substituteTeacher: '',
          reason: ''
        });
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        setFormData({
          classId: '',
          className: '',
          originalDate: todayStr,
          originalTime: '',
          substituteTeacher: '',
          reason: ''
        });
      }
    }
  }, [isOpen, userEmail, preselectedClass]);

  // Dynamically retrieve the teacher's scheduled classes for the selected date
  const classesOnSelectedDate: ClassSession[] = useMemo(() => {
    if (!formData.originalDate || !userEmail) return [];
    try {
      const parsedDate = new Date(formData.originalDate + "T00:00:00");
      return getScheduleForDate(userEmail, parsedDate);
    } catch {
      return [];
    }
  }, [formData.originalDate, userEmail]);

  // When a class is selected from the dropdown (if not preselected)
  const handleClassSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const foundClass = classesOnSelectedDate.find(c => c.id === selectedId);
    if (foundClass) {
      setFormData(prev => ({
        ...prev,
        classId: foundClass.id,
        className: foundClass.subject,
        originalTime: foundClass.time,
        substituteTeacher: '' // reset substitute selection on slot change
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        classId: '',
        className: '',
        originalTime: '',
        substituteTeacher: ''
      }));
    }
  };

  // ✅ CRITICAL LOGIC: Filter teachers so ONLY faculty who have a LEISURE (FREE) PERIOD at that exact slot are shown
  const leisureTeachers = useMemo(() => {
    if (!formData.originalDate || !formData.originalTime) return [];
    return getAvailableTeachersForSlot(
      teachers,
      formData.originalDate,
      formData.originalTime,
      userEmail,
      undefined,
      allLeaves
    );
  }, [teachers, formData.originalDate, formData.originalTime, userEmail, allLeaves]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.className || !formData.originalTime) {
      alert("Please select a class session to substitute.");
      return;
    }

    if (!formData.substituteTeacher) {
      alert("Please select an available faculty member who has a leisure period.");
      return;
    }

    setIsSubmitting(true);

    const newRequest: SubstituteRequest = {
      id: Date.now().toString(),
      classId: formData.classId || "adj-" + Date.now().toString(),
      className: formData.className,
      originalDate: formData.originalDate,
      originalTime: formData.originalTime,
      substituteTeacher: formData.substituteTeacher,
      reason: formData.reason,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/leaves/substitute/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...newRequest,
          teacherEmail: userEmail
        })
      });

      if (res.ok) {
        alert("Substitute Request Submitted! The substitute faculty will receive an SMS notification and can accept directly. 💬");
        onSubmit(newRequest);
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit substitution request.");
      }

    } catch (err) {
      console.error("Error submitting substitute request:", err);
      alert("Error sending request to backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-gray-100">

        {/* MODAL HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
              🔄
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Request Peer Substitution</h2>
              <p className="text-xs text-gray-500">Direct class delegation to available colleagues</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-gray-200/80 text-gray-400 hover:text-gray-700 flex items-center justify-center text-lg font-semibold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* LOGIC NOTICE BANNER */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
            <span className="text-base leading-none mt-0.5">ℹ️</span>
            <div>
              <p className="font-semibold text-blue-950">Peer-to-Peer Substitution Logistics</p>
              <p className="text-blue-800 text-[11px] mt-0.5 leading-relaxed">
                Substitution requests are private agreements between faculty. They do <strong>not</strong> require administrator approval and will appear under <strong>Substitute Coverages</strong> once accepted.
              </p>
            </div>
          </div>

          {/* PRESELECTED CLASS CARD OR DYNAMIC PICKER */}
          {preselectedClass ? (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-xl border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Target Class Session</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                  {preselectedClass.type || 'Lecture'}
                </span>
              </div>
              <p className="font-bold text-gray-900 text-base">{preselectedClass.subject}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 pt-1">
                <span>🕒 <strong>Time:</strong> {preselectedClass.time} ({preselectedClass.duration || '1h 30m'})</span>
                <span>📅 <strong>Date:</strong> {formData.originalDate}</span>
                <span>📍 <strong>Room:</strong> {preselectedClass.room || 'Room 204'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  1. Date of Class
                </label>
                <input 
                  type="date"
                  name="originalDate"
                  value={formData.originalDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    handleChange(e);
                    // Reset selected class on date change
                    setFormData(prev => ({
                      ...prev,
                      originalDate: e.target.value,
                      classId: '',
                      className: '',
                      originalTime: '',
                      substituteTeacher: ''
                    }));
                  }}
                  required
                  className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  2. Select Class to Delegate
                </label>
                <select 
                  name="classId" 
                  value={formData.classId} 
                  onChange={handleClassSelection} 
                  required 
                  className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">-- Choose from your scheduled classes --</option>
                  {classesOnSelectedDate.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.subject} ({cls.time}) • {cls.room}
                    </option>
                  ))}
                </select>
                {classesOnSelectedDate.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    No classes found on your timetable for the selected date.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* FACULTY PICKER - ONLY TEACHERS WITH LEISURE AT THIS TIME */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Substitute Teacher (Leisure Filtered)
              </label>
              {formData.originalTime && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {leisureTeachers.length} faculty free at {formData.originalTime}
                </span>
              )}
            </div>

            <select 
              name="substituteTeacher" 
              value={formData.substituteTeacher} 
              onChange={handleChange} 
              required 
              disabled={!formData.originalTime}
              className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {!formData.originalTime ? (
                <option value="">Select a class first to verify teacher leisure periods</option>
              ) : leisureTeachers.length === 0 ? (
                <option value="">No faculty members are free during this time slot</option>
              ) : (
                <>
                  <option value="">-- Choose a teacher with a leisure period --</option>
                  {leisureTeachers.map((f: any) => (
                    <option key={f.id || f._id || f.email} value={f.email}>
                      {f.name} — {getTeacherSubject(f)} ({f.department || 'CSE'}) • [Free Period]
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* Informational callout regarding leisure period filtering */}
            {formData.originalTime && leisureTeachers.length === 0 ? (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  All registered faculty members have teaching assignments during <strong>{formData.originalTime}</strong>. No leisure period available.
                </span>
              </div>
            ) : formData.originalTime && leisureTeachers.length > 0 ? (
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Only showing faculty with a verified free/leisure period during {formData.originalTime}.</span>
              </p>
            ) : null}
          </div>

          {/* REASON FOR SUBSTITUTION */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Reason for Substitution Request
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g. Urgent research presentation, scheduled medical checkup, university committee meeting"
              required
              rows={3}
              className="w-full border border-gray-300 px-3.5 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
            />
          </div>

          {/* MODAL ACTIONS */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !formData.substituteTeacher || leisureTeachers.length === 0} 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <span>📨</span>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};