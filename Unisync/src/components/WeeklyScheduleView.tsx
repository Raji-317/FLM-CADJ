import { useState } from "react";
import React from "react";

interface WeeklyScheduleViewProps {
  selectedDate: Date;
  userType: 'teacher' | 'admin';
}

interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  teacher: string;
  students: number;
  type: 'lecture' | 'lab' | 'tutorial';
  department: string;
  branch?: string;
  section?: string;
  isAdjusted?: boolean;
  adjustmentType?: 'substitute' | 'reschedule' | 'room_change';
  originalTeacher?: string;
  adjustmentReason?: string;
}

interface WeeklySchedule {
  [key: string]: ClassSession[];
}

export const WeeklyScheduleView = ({ selectedDate, userType }: WeeklyScheduleViewProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science');
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Economics'
  ];

  const semesters = [
    'Fall 2024',
    'Spring 2024',
    'Summer 2024',
    'Fall 2023',
    'Spring 2023'
  ];

  const branches = [
    'CSE', // Computer Science Engineering
    'CSM', // Computer Science and Mathematics
    'ECE', // Electronics and Communication Engineering
    'EEE', // Electrical and Electronics Engineering
    'ME',  // Mechanical Engineering
    'CE',  // Civil Engineering
    'IT',  // Information Technology
    'Cyber Security',
    'Data Science',
    'AI & ML' // Artificial Intelligence & Machine Learning
  ];

  const sections = ['A', 'B'];

  // Mock weekly schedule data with branch and section information
  const weeklySchedule: WeeklySchedule = {
    'Monday': [
      {
        id: '1',
        subject: 'Data Structures',
        time: '09:00 AM',
        duration: '1h 30m',
        room: 'Room 204',
        teacher: 'Dr. Sarah Johnson',
        students: 45,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '2',
        subject: 'Algorithm Lab',
        time: '11:00 AM',
        duration: '2h',
        room: 'Lab 301',
        teacher: 'Prof. Michael Chen',
        students: 30,
        type: 'lab',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A',
        isAdjusted: true,
        adjustmentType: 'substitute',
        originalTeacher: 'Dr. Emily Davis',
        adjustmentReason: 'Original teacher on medical leave'
      },
      {
        id: '3',
        subject: 'Database Systems',
        time: '02:00 PM',
        duration: '1h 30m',
        room: 'Room 105',
        teacher: 'Dr. Robert Wilson',
        students: 40,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '9',
        subject: 'Programming Fundamentals',
        time: '09:00 AM',
        duration: '1h 30m',
        room: 'Room 205',
        teacher: 'Prof. Jane Smith',
        students: 42,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      }
    ],
    'Tuesday': [
      {
        id: '4',
        subject: 'Software Engineering',
        time: '09:00 AM',
        duration: '1h 30m',
        room: 'Room 201',
        teacher: 'Dr. Lisa Anderson',
        students: 35,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '5',
        subject: 'Web Development',
        time: '11:00 AM',
        duration: '2h',
        room: 'Lab 302',
        teacher: 'Prof. James Wilson',
        students: 25,
        type: 'lab',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A',
        isAdjusted: true,
        adjustmentType: 'room_change',
        adjustmentReason: 'Original room under maintenance'
      },
      {
        id: '10',
        subject: 'Object Oriented Programming',
        time: '10:00 AM',
        duration: '1h 30m',
        room: 'Room 206',
        teacher: 'Dr. Mark Johnson',
        students: 38,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      }
    ],
    'Wednesday': [
      {
        id: '6',
        subject: 'Machine Learning',
        time: '10:00 AM',
        duration: '1h 30m',
        room: 'Room 301',
        teacher: 'Dr. Sarah Johnson',
        students: 30,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '11',
        subject: 'Computer Graphics',
        time: '11:00 AM',
        duration: '1h 30m',
        room: 'Lab 303',
        teacher: 'Prof. Alex Brown',
        students: 35,
        type: 'lab',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      }
    ],
    'Thursday': [
      {
        id: '7',
        subject: 'Computer Networks',
        time: '09:00 AM',
        duration: '1h 30m',
        room: 'Room 204',
        teacher: 'Prof. Michael Chen',
        students: 42,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '12',
        subject: 'System Design',
        time: '02:00 PM',
        duration: '1h 30m',
        room: 'Room 207',
        teacher: 'Dr. Rachel Green',
        students: 40,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      }
    ],
    'Friday': [
      {
        id: '8',
        subject: 'Project Presentation',
        time: '02:00 PM',
        duration: '2h',
        room: 'Auditorium A',
        teacher: 'Dr. Robert Wilson',
        students: 60,
        type: 'tutorial',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: '13',
        subject: 'Capstone Project',
        time: '03:00 PM',
        duration: '2h',
        room: 'Auditorium B',
        teacher: 'Prof. David Lee',
        students: 45,
        type: 'tutorial',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      }
    ],
    'Saturday': [
      {
        id: 'sat-1',
        subject: 'Industry Case Studies & Tech Talk',
        time: '10:00 AM',
        duration: '2h',
        room: 'Auditorium A',
        teacher: 'Prof. Sarah Johnson',
        students: 60,
        type: 'lecture',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: 'sat-2',
        subject: 'Coding Olympiad & Hackathon Coaching',
        time: '11:00 AM',
        duration: '2h',
        room: 'Lab 303',
        teacher: 'Dr. V. Harinadh',
        students: 35,
        type: 'lab',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'B'
      },
      {
        id: 'sat-3',
        subject: 'Full Stack Project Mentoring Lab',
        time: '01:00 PM',
        duration: '2h',
        room: 'Lab 301',
        teacher: 'Prof. Pravallika Prathikonda',
        students: 30,
        type: 'lab',
        department: 'Computer Science',
        branch: 'CSE',
        section: 'A'
      },
      {
        id: 'sat-4',
        subject: 'Data Science & Generative AI Workshop',
        time: '10:00 AM',
        duration: '2h',
        room: 'Lab 302',
        teacher: 'Prof. Pradeep Juluri',
        students: 40,
        type: 'lab',
        department: 'Computer Science',
        branch: 'AI & ML',
        section: 'A'
      }
    ],
    'Sunday': []
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800';
      case 'lab':
        return 'bg-green-100 text-green-800';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdjustmentColor = (type?: string) => {
    switch (type) {
      case 'substitute':
        return 'bg-orange-100 text-orange-800';
      case 'reschedule':
        return 'bg-yellow-100 text-yellow-800';
      case 'room_change':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Weekly Class Schedule</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek('prev')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Previous Week
            </button>
            <span className="text-sm font-medium text-gray-600">
              {formatWeekRange()}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Next Week →
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[oklch(0.546_0.245_262.881)] focus:border-transparent"
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            <strong>Current View:</strong> {selectedDepartment} • {selectedSemester} • {selectedBranch} • Section {selectedSection}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Lecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Lab</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span>Tutorial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-100 rounded"></div>
            <span>Adjusted</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* Time Column Header */}
          <div className="bg-gray-50 p-4 border-r border-b font-medium text-gray-900">
            Time
          </div>
          
          {/* Day Headers */}
          {dayNames.slice(0, 7).map((day, index) => (
            <div key={day} className="bg-gray-50 p-4 border-r border-b font-medium text-gray-900 text-center">
              <div>{day}</div>
              <div className="text-xs text-gray-500 mt-1">
                {weekDays[index]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Time Slots */}
          {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
            <React.Fragment key={time}>
              {/* Time Label */}
              <div className="bg-gray-50 p-4 border-r border-b text-sm font-medium text-gray-700">
                {time}
              </div>
              
              {/* Day Cells */}
              {dayNames.slice(0, 7).map((day) => {
                const daySchedule = weeklySchedule[day] || [];
                const classAtTime = daySchedule.find(cls => 
                  cls.time === time && 
                  cls.department === selectedDepartment &&
                  (cls as any).branch === selectedBranch &&
                  (cls as any).section === selectedSection
                );

                return (
                  <div key={`${day}-${time}`} className="border-r border-b p-2 min-h-[80px]">
                    {classAtTime && (
                      <div className="bg-white border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-xs font-semibold text-gray-900 truncate">
                            {classAtTime.subject}
                          </h4>
                          <span className={`px-1 py-0.5 rounded text-xs font-medium ${getTypeColor(classAtTime.type)}`}>
                            {classAtTime.type}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span>{classAtTime.room}</span>
                            <span>{classAtTime.students} students</span>
                          </div>
                          
                          <div className="font-medium text-gray-800">
                            {classAtTime.isAdjusted ? (
                              <div className="space-y-1">
                                <div className="text-green-600">
                                  {classAtTime.teacher}
                                </div>
                                {classAtTime.originalTeacher && (
                                  <div className="text-red-500 line-through text-xs">
                                    {classAtTime.originalTeacher}
                                  </div>
                                )}
                                <span className={`px-1 py-0.5 rounded text-xs ${getAdjustmentColor(classAtTime.adjustmentType)}`}>
                                  {classAtTime.adjustmentType?.replace('_', ' ')}
                                </span>
                              </div>
                            ) : (
                              classAtTime.teacher
                            )}
                          </div>
                        </div>

                        {classAtTime.isAdjusted && (
                          <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-gray-100">
                            <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                              🔄 Peer Covered
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Adjustments Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Adjustments Summary - {selectedBranch} Section {selectedSection} ({selectedSemester})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Substitute Teachers</h4>
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-orange-600">Active this week</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Rescheduled Classes</h4>
            <p className="text-2xl font-bold text-yellow-600">1</p>
            <p className="text-sm text-yellow-600">This week</p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-medium text-pink-800 mb-2">Room Changes</h4>
            <p className="text-2xl font-bold text-pink-600">2</p>
            <p className="text-sm text-pink-600">This week</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Total Classes</h4>
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-blue-600">{selectedBranch} - Sec {selectedSection}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
