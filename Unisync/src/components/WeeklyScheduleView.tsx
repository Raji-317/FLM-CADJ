import { useState, useMemo } from "react";
import React from "react";

interface WeeklyScheduleViewProps {
  selectedDate: Date;
  userType: 'teacher' | 'admin';
}

interface ClassSession {
  id: string;
  subject: string;
  code?: string;
  time: string;
  duration: string;
  room: string;
  teacher: string;
  students: number;
  type: 'lecture' | 'lab' | 'tutorial';
  department: string;
  branch?: string;
  year?: string;
  semester?: string;
  section?: string;
  incharge?: string;
  isAdjusted?: boolean;
  adjustmentType?: 'substitute' | 'reschedule' | 'room_change';
  originalTeacher?: string;
  adjustmentReason?: string;
}

interface WeeklySchedule {
  [key: string]: ClassSession[];
}

// Convert time string to minutes from midnight for sorting
const timeToMinutes = (timeStr: string = ''): number => {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 9999;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Convert duration string (e.g. '50m', '1h 30m', '2h 50m') to total minutes
const parseDurationMinutes = (durStr: string = ''): number => {
  let total = 0;
  const hMatch = durStr.match(/(\d+)\s*h/i);
  if (hMatch) total += parseInt(hMatch[1], 10) * 60;
  const mMatch = durStr.match(/(\d+)\s*m/i);
  if (mMatch) total += parseInt(mMatch[1], 10);
  return total || 50;
};

export const WeeklyScheduleView = ({ selectedDate, userType: _userType }: WeeklyScheduleViewProps) => {
  // ✅ User-specified departments: cse, ai, it, ece, eee, mech, civil
  const departments = ['CSE', 'AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  
  // ✅ User-specified semesters: Sem 1 and Sem 2
  const semesters = ['Sem 1', 'Sem 2'];
  
  // ✅ 1 to 4 years selector
  const years = ['1', '2', '3', '4'];
  const sections = ['A', 'B'];

  const [selectedDepartment, setSelectedDepartment] = useState('AI');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('Sem 1');
  const [selectedBranch, setSelectedBranch] = useState('AIDS');
  const [selectedSection, setSelectedSection] = useState('A');
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  // ✅ Branch logic based on user request:
  // - AI department -> branches: AIML and AIDS
  // - CSE department -> branches: CSE and Cyber Security (cs means cyber security)
  // - Remaining departments -> No branch dropdown
  const hasBranch = selectedDepartment === 'CSE' || selectedDepartment === 'AI';

  const branchOptions = useMemo(() => {
    if (selectedDepartment === 'AI') {
      return ['AIDS', 'AIML'];
    }
    if (selectedDepartment === 'CSE') {
      return ['CSE', 'Cyber Security'];
    }
    return [];
  }, [selectedDepartment]);

  const handleDepartmentChange = (newDept: string) => {
    setSelectedDepartment(newDept);
    if (newDept === 'AI') {
      setSelectedBranch('AIDS');
    } else if (newDept === 'CSE') {
      setSelectedBranch('CSE');
    } else {
      setSelectedBranch('');
    }
  };

  // ✅ OFFICIAL UNIVERSITY TIMETABLES AS GIVEN IN IMAGES
  const weeklySchedule: WeeklySchedule = useMemo(() => {
    const dept = selectedDepartment;
    const branch = hasBranch ? selectedBranch : selectedDepartment;
    const yr = selectedYear;
    const sem = selectedSemester;
    const sec = selectedSection;

    // -------------------------------------------------------------
    // 1. AIDS 3RD YEAR 1ST SEM (CLASS: CSE(AI&DS)-A, ROOM: C-303)
    // As per Image 1 & Image 2
    // -------------------------------------------------------------
    if (dept === 'AI' && branch === 'AIDS' && yr === '3' && sem === 'Sem 1') {
      const roomNo = 'C-303';
      const incharge = 'Mrs. K. Swetha';

      return {
        Monday: [
          { id: 'aids-3-mon-1', subject: 'EDA (Exploratory Data Analysis using Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-2', subject: 'COA (Computer Organization and Architecture)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-3', subject: 'UID using Flutter', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Rajasekhar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-4', subject: 'RES (Renewable Energy Sources)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-5', subject: 'CN (Computer Networks)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-6', subject: 'AI (Artificial Intelligence)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-mon-7', subject: 'FSD-2 (Full Stack Development-2)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'aids-3-tue-1', subject: 'CN (Computer Networks)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-tue-2', subject: 'AI (Artificial Intelligence)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-tue-3', subject: 'EDA (Exploratory Data Analysis using Python)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-tue-4', subject: 'COA (Computer Organization and Architecture)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-tue-5', subject: 'FSD-2 LAB (Full Stack Development-2 Lab)', time: '01:00 PM', duration: '2h 30m', room: 'Lab 301', teacher: 'Mr. Mohammad Towqeer UL Haq & Mr. MP. Praveen Kumar', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'aids-3-wed-1', subject: 'FSD-2 (Full Stack Development-2)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-wed-2', subject: 'AI LAB / CN LAB (Artificial Intelligence & CN Lab)', time: '08:50 AM', duration: '2h 50m', room: 'Lab 302', teacher: 'Dr. P. Sri Charani & Mrs. M. Bhargavi', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aids-3-wed-5', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-wed-6', subject: 'RES (Renewable Energy Sources)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-wed-7', subject: 'COA (Computer Organization and Architecture)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'aids-3-thu-1', subject: 'RES (Renewable Energy Sources)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-thu-2', subject: 'EDA (Exploratory Data Analysis using Python)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-thu-3', subject: 'UID using Flutter LAB (Tinkering Lab)', time: '10:00 AM', duration: '1h 40m', room: 'Lab 303', teacher: 'Mr. K. Rajasekhar & Mr. D. Anand', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aids-3-thu-5', subject: 'AI (Artificial Intelligence)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-thu-6', subject: 'COA (Computer Organization and Architecture)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-thu-7', subject: 'CN (Computer Networks)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'aids-3-fri-1', subject: 'AI (Artificial Intelligence)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-fri-2', subject: 'RES (Renewable Energy Sources)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-fri-3', subject: 'CN (Computer Networks)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-fri-4', subject: 'LIB (Library & Self Study)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'aids-3-fri-5', subject: 'UID using Flutter', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Rajasekhar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-fri-6', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-fri-7', subject: 'FSD-2 (Full Stack Development-2)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'aids-3-sat-1', subject: 'COA (Computer Organization and Architecture)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-sat-2', subject: 'AI (Artificial Intelligence)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-sat-3', subject: 'CN (Computer Networks)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aids-3-sat-4', subject: 'COUN (Counselling & Mentorship)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'aids-3-sat-5', subject: 'CN LAB / AI LAB (Batch Evaluation Lab)', time: '01:00 PM', duration: '2h 30m', room: 'Lab 302', teacher: 'Mrs. M. Bhargavi & Dr. P. Sri Charani', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 2. AIML 3RD YEAR 1ST SEM (CLASS: CSE(AI&ML)-B, ROOM: C-215)
    // As per Official Timetable Image: Class Incharge: Ms. R. D. Priyanka
    // -------------------------------------------------------------
    if (dept === 'AI' && branch === 'AIML' && yr === '3' && sem === 'Sem 1') {
      const roomNo = sec === 'B' ? 'C-215' : 'C-214';
      const incharge = sec === 'B' ? 'Ms. R. D. Priyanka' : 'Mrs. Y. Gayatri';

      return {
        Monday: [
          { id: 'aiml-3-mon-1', subject: 'RES (Renewable Energy Sources)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. S. Veera Babu', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-2', subject: 'IRS (Information Retrieval Systems)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. Y. Gayatri', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-3', subject: 'CN (Computer Networks)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Ms. J. Sai Divya', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-4', subject: 'OS (Operating Systems)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Swaroop', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-5', subject: 'CN (Computer Networks)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Ms. J. Sai Divya', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-6', subject: 'Flutter LAB (User Interface Design Using Flutter Lab)', time: '01:50 PM', duration: '1h 40m', room: 'Lab C-215', teacher: 'Mr. D. Anand & Mr. K. Rajasekhar', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'aiml-3-tue-1', subject: 'FSD-II (Full Stack development-II)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. J. Pradeep', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-2', subject: 'Flutter (User Interface Design using Flutter)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. D. Anand', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-3', subject: 'RES (Renewable Energy Sources)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. S. Veera Babu', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-4', subject: 'EDA (Exploratory Data Analysis using Python)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. R. Sarada', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-5', subject: 'CN (Computer Networks)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Ms. J. Sai Divya', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-6', subject: 'IRS (Information Retrieval Systems)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mrs. Y. Gayatri', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-7', subject: 'OS (Operating Systems)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Swaroop', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'aiml-3-wed-1', subject: 'OS (Operating Systems)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Swaroop', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-2', subject: 'EDA (Exploratory Data Analysis using Python)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. R. Sarada', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-3', subject: 'FSD-II (Full Stack development-II)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. J. Pradeep', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-4', subject: 'EDA (Exploratory Data Analysis using Python)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. R. Sarada', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-5', subject: 'IRS (Information Retrieval Systems)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mrs. Y. Gayatri', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-6', subject: 'RES (Renewable Energy Sources)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. S. Veera Babu', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-7', subject: 'CN (Computer Networks)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Ms. J. Sai Divya', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'aiml-3-thu-1', subject: 'Flutter (User Interface Design using Flutter)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. D. Anand', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-2', subject: 'FSD-II (Full Stack development-II)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. J. Pradeep', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-3', subject: 'OS (Operating Systems)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Swaroop', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-4', subject: 'IRS (Information Retrieval Systems)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. Y. Gayatri', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-5', subject: 'IRS LAB / CN LAB', time: '01:00 PM', duration: '2h 30m', room: 'Lab C-215', teacher: 'Mrs. Y. Gayatri & Ms. J. Sai Divya', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'aiml-3-fri-1', subject: 'FSD-II LAB (Full Stack development-II Lab)', time: '08:00 AM', duration: '2h 50m', room: 'Lab C-215', teacher: 'Mr. J. Pradeep & Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aiml-3-fri-4', subject: 'LIB (Library & Self Study)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'aiml-3-fri-5', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mrs. R. Sarada', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-6', subject: 'RES (Renewable Energy Sources)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. S. Veera Babu', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-7', subject: 'OS (Operating Systems)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Swaroop', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'aiml-3-sat-1', subject: 'CN LAB / IRS LAB', time: '08:00 AM', duration: '2h 50m', room: 'Lab C-215', teacher: 'Ms. J. Sai Divya & Mrs. Y. Gayatri', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aiml-3-sat-4', subject: 'COUN (Counselling & Mentoring)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'aiml-3-sat-5', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mrs. R. Sarada', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-sat-6', subject: 'CN (Computer Networks)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Ms. J. Sai Divya', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-sat-7', subject: 'IRS (Information Retrieval Systems)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mrs. Y. Gayatri', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 3. CSE CYBER SECURITY 4TH YEAR 1ST SEM (CLASS: CSE-CS, ROOM: B-204)
    // As per Image 3 ("cs means cyber security")
    // -------------------------------------------------------------
    if (dept === 'CSE' && branch === 'Cyber Security' && yr === '4' && sem === 'Sem 1') {
      const roomNo = 'B-204';
      const incharge = 'Mr. Ch. Venkata Ramana';

      return {
        Monday: [
          { id: 'cs-4-mon-1', subject: 'ES (Embedded Systems)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-mon-2', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-mon-3', subject: 'VLSI (Fundamentals of VLSI Design)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-mon-4', subject: 'DT (Domain Training: Moocs / SWAYAM / NPTEL)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-mon-5', subject: 'BCT (Block Chain Technology)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. G. Surendra', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-mon-6', subject: 'DL (Deep Learning)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mrs. K. Soni Sharmila', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-mon-7', subject: 'HRM (Human Resources Management)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'cs-4-tue-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-tue-1', subject: 'BCT (Block Chain Technology)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. G. Surendra', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-2', subject: 'ES (Embedded Systems)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-3', subject: 'DL (Deep Learning)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. K. Soni Sharmila', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-4', subject: 'VLSI (Fundamentals of VLSI Design)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-5', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-6', subject: 'EH (Ethical Hacking)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. M. Prasad', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-tue-7', subject: 'HRM (Human Resources Management)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'cs-4-wed-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-wed-1', subject: 'DL (Deep Learning)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. K. Soni Sharmila', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-wed-2', subject: 'HRM (Human Resources Management)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-wed-3', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-wed-4', subject: 'VLSI (Fundamentals of VLSI Design)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-wed-5', subject: 'ES (Embedded Systems)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-wed-6', subject: 'DT (Domain Training: Moocs)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-wed-7', subject: 'BCT (Block Chain Technology)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. G. Surendra', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'cs-4-thu-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-thu-1', subject: 'EH (Ethical Hacking)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. M. Prasad', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-2', subject: 'DL (Deep Learning)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mrs. K. Soni Sharmila', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-3', subject: 'BCT (Block Chain Technology)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. G. Surendra', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-4', subject: 'ES (Embedded Systems)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-5', subject: 'HRM (Human Resources Management)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-6', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-thu-7', subject: 'VLSI (Fundamentals of VLSI Design)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'cs-4-fri-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-fri-1', subject: 'VLSI (Fundamentals of VLSI Design)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-fri-2', subject: 'EH LAB (Ethical Hacking Lab [D-310])', time: '09:40 AM', duration: '2h 50m', room: 'Lab D-310', teacher: 'Dr. M. Prasad & Mrs. K. Soni Sharmila', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'cs-4-fri-5', subject: 'DL (Deep Learning)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mrs. K. Soni Sharmila', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-fri-6', subject: 'COI (Constitution of India)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-fri-7', subject: 'LIB (Library & Technical Reading)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'cs-4-sat-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-sat-1', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-sat-2', subject: 'DT (Domain Training: Moocs)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-sat-3', subject: 'HRM (Human Resources Management)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-sat-4', subject: 'COUN (Counselling & Career Guidance)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cs-4-sat-5', subject: 'COI (Constitution of India)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-sat-6', subject: 'BCT (Block Chain Technology)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. G. Surendra', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cs-4-sat-7', subject: 'ES (Embedded Systems)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 4. CSE 4TH YEAR 1ST SEM - SECTION B (CLASS: CSE-B, ROOM: D-303)
    // As per Image 5
    // -------------------------------------------------------------
    if (dept === 'CSE' && (branch === 'CSE' || !hasBranch) && yr === '4' && sem === 'Sem 1' && sec === 'B') {
      const roomNo = 'D-303';
      const incharge = 'Mrs. G. Sujatha';

      return {
        Monday: [
          { id: 'cseb-4-mon-1', subject: 'DL (Deep Learning)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-2', subject: 'HRPM (Human Resources & Project Management)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-3', subject: 'VLSI (Fundamentals of VLSI Design)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. G. Challa Ram', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-4', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-5', subject: 'PE (Prompt Engineering)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. K. Ashok', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-6', subject: 'ES (Embedded Systems)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. D. Murali Krishna', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-mon-7', subject: 'GAI (Generative AI)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'cseb-4-tue-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-tue-1', subject: 'ES (Embedded Systems)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. D. Murali Krishna', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-tue-2', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-tue-3', subject: 'HRPM (Human Resources & Project Management)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-tue-4', subject: 'GAI (Generative AI)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-tue-5', subject: 'DL (Deep Learning)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-tue-6', subject: 'DT (Domain Training: Moocs)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-tue-7', subject: 'LIB (Library & Self Study)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'cseb-4-wed-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-wed-1', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-2', subject: 'ES (Embedded Systems)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. D. Murali Krishna', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-3', subject: 'VLSI (Fundamentals of VLSI Design)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. G. Challa Ram', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-4', subject: 'DL (Deep Learning)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-5', subject: 'HRPM (Human Resources & Project Management)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-6', subject: 'GAI (Generative AI)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-wed-7', subject: 'COI (Constitution of India)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'cseb-4-thu-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-thu-1', subject: 'VLSI (Fundamentals of VLSI Design)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. G. Challa Ram', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-thu-2', subject: 'COI (Constitution of India)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-thu-3', subject: 'DL (Deep Learning)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-thu-4', subject: 'DT (Domain Training: Moocs)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-thu-5', subject: 'PE LAB (Prompt Engineering Lab [D-310])', time: '01:50 PM', duration: '2h 30m', room: 'Lab D-310', teacher: 'Dr. K. Ashok & Mrs. G. R. L. M. Tayaru', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'cseb-4-fri-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-fri-1', subject: 'GAI (Generative AI)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-fri-2', subject: 'ES (Embedded Systems)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. D. Murali Krishna', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-fri-3', subject: 'HRPM (Human Resources & Project Management)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-fri-4', subject: 'DT (Domain Training: Moocs)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-fri-5', subject: 'VLSI (Fundamentals of VLSI Design)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. G. Challa Ram', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-fri-6', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-fri-7', subject: 'DL (Deep Learning)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'cseb-4-sat-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-sat-1', subject: 'HRPM (Human Resources & Project Management)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-sat-2', subject: 'PE (Prompt Engineering)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. K. Ashok', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-sat-3', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-sat-4', subject: 'COUN (Counselling & Mentorship)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cseb-4-sat-5', subject: 'GAI (Generative AI)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Venkata Ramana', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-sat-6', subject: 'VLSI (Fundamentals of VLSI Design)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. G. Challa Ram', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cseb-4-sat-7', subject: 'ES (Embedded Systems)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Dr. D. Murali Krishna', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 5. CSE 4TH YEAR 1ST SEM - SECTION A (CLASS: CSE-A/C, ROOM: D-304)
    // As per Image 4
    // -------------------------------------------------------------
    if (dept === 'CSE' && (branch === 'CSE' || !hasBranch) && yr === '4' && sem === 'Sem 1') {
      const roomNo = 'D-304';
      const incharge = 'Mr. B. Anoch';

      return {
        Monday: [
          { id: 'csea-4-mon-1', subject: 'VLSI (Fundamentals of VLSI Design)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-mon-2', subject: 'GAI (Generative AI)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Phaneendra Varma', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-mon-3', subject: 'HRPM (Human Resources & Project Management)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-mon-4', subject: 'DL (Deep Learning)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-mon-5', subject: 'DT (Domain Training: Moocs)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-mon-6', subject: 'ES (Embedded Systems)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-mon-7', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'csea-4-tue-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-tue-1', subject: 'ES (Embedded Systems)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-2', subject: 'COI (Constitution of India)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-3', subject: 'DL (Deep Learning)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-4', subject: 'GAI (Generative AI)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Phaneendra Varma', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-5', subject: 'HRPM (Human Resources & Project Management)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-6', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-tue-7', subject: 'VLSI (Fundamentals of VLSI Design)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'csea-4-wed-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-wed-1', subject: 'HRPM (Human Resources & Project Management)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-2', subject: 'VLSI (Fundamentals of VLSI Design)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-3', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-4', subject: 'ES (Embedded Systems)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-5', subject: 'PE (Prompt Engineering)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. K. Ashok', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-6', subject: 'DL (Deep Learning)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-wed-7', subject: 'GAI (Generative AI)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Phaneendra Varma', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'csea-4-thu-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-thu-1', subject: 'DL (Deep Learning)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-thu-2', subject: 'DT (Domain Training: Moocs)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-thu-3', subject: 'GAI (Generative AI)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Phaneendra Varma', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-thu-4', subject: 'HRPM (Human Resources & Project Management)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-thu-5', subject: 'VLSI (Fundamentals of VLSI Design)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-thu-6', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-thu-7', subject: 'ES (Embedded Systems)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'csea-4-fri-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-fri-1', subject: 'GAI (Generative AI)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Ch. Phaneendra Varma', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-fri-2', subject: 'PE LAB (Prompt Engineering Lab [D-211])', time: '09:40 AM', duration: '2h 50m', room: 'Lab D-211', teacher: 'Dr. K. Ashok & Mrs. G. Sujatha', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'csea-4-fri-5', subject: 'HRPM (Human Resources & Project Management)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. P. Ramesh', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-fri-6', subject: 'PE (Prompt Engineering)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. K. Ashok', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-fri-7', subject: 'LIB (Library & Self Study)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'csea-4-sat-0', subject: 'HONORS (Data Analytics with Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. P. T. S. N. Murty', students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-sat-1', subject: 'ARVR (Augmented Reality and Virtual Reality)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. B. Anoch', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-sat-2', subject: 'COI (Constitution of India)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. A. Nageswara Rao', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-sat-3', subject: 'VLSI (Fundamentals of VLSI Design)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Ms. M. Hema Latha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-sat-4', subject: 'COUN (Counselling & Career Guidance)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'csea-4-sat-5', subject: 'ES (Embedded Systems)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. E. R. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-sat-6', subject: 'DL (Deep Learning)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mrs. G. Sujatha', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'csea-4-sat-7', subject: 'DT (Domain Training: Moocs)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Dr. S. Nagarajan', students: 45, type: 'tutorial', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 6. CSE 3RD YEAR 1ST SEM (CLASS: CSE 3rd Year)
    // -------------------------------------------------------------
    if (dept === 'CSE' && yr === '3' && sem === 'Sem 1') {
      const isCyber = branch === 'Cyber Security';
      const roomNo = isCyber ? 'B-205' : 'Room 204';
      const incharge = isCyber ? 'Dr. M. Prasad' : 'Mrs. M. Bhargavi';

      return {
        Monday: [
          { id: 'cse-3-mon-1', subject: isCyber ? 'CNS (Cryptography & Network Security)' : 'CN (Computer Networks)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: isCyber ? 'Dr. M. Prasad' : 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-mon-2', subject: 'AI (Artificial Intelligence)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-mon-3', subject: isCyber ? 'Linux Security & OS Internals' : 'COA (Computer Organization and Architecture)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: isCyber ? 'Dr. M. Prasad' : 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-mon-4', subject: 'RES (Renewable Energy Sources)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-mon-5', subject: 'FSD-2 (Full Stack Development-2)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-mon-6', subject: 'EDA (Exploratory Data Analysis using Python)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'cse-3-tue-1', subject: 'COA (Computer Organization and Architecture)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-tue-2', subject: isCyber ? 'CNS (Cryptography & Network Security)' : 'CN (Computer Networks)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: isCyber ? 'Dr. M. Prasad' : 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-tue-3', subject: 'FSD-2 LAB (Full Stack Development-2 Lab)', time: '10:50 AM', duration: '2h 30m', room: 'Lab 301', teacher: 'Mr. Mohammad Towqeer UL Haq & Mr. MP. Praveen Kumar', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'cse-3-tue-5', subject: 'AI (Artificial Intelligence)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-tue-6', subject: 'RES (Renewable Energy Sources)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'cse-3-wed-1', subject: 'FSD-2 (Full Stack Development-2)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-wed-2', subject: isCyber ? 'Network Security Lab' : 'CN LAB / AI LAB', time: '09:40 AM', duration: '2h 50m', room: isCyber ? 'Lab D-310' : 'Lab 302', teacher: isCyber ? 'Dr. M. Prasad' : 'Mrs. M. Bhargavi & Dr. P. Sri Charani', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'cse-3-wed-5', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-wed-6', subject: 'COA (Computer Organization and Architecture)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'cse-3-thu-1', subject: 'AI (Artificial Intelligence)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-thu-2', subject: 'RES (Renewable Energy Sources)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-thu-3', subject: isCyber ? 'Cyber Security Tinkering Lab' : 'UID using Flutter LAB', time: '10:50 AM', duration: '1h 40m', room: 'Lab 303', teacher: isCyber ? 'Dr. M. Prasad' : 'Mr. K. Rajasekhar', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'cse-3-thu-5', subject: 'CN (Computer Networks)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-thu-6', subject: 'FSD-2 (Full Stack Development-2)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'cse-3-fri-1', subject: 'CN (Computer Networks)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-fri-2', subject: 'EDA (Exploratory Data Analysis using Python)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-fri-3', subject: 'COA (Computer Organization and Architecture)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-fri-4', subject: 'LIB (Library & Self Study)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cse-3-fri-5', subject: 'AI (Artificial Intelligence)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-fri-6', subject: 'RES (Renewable Energy Sources)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'cse-3-sat-1', subject: 'COA (Computer Organization and Architecture)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-sat-2', subject: 'AI (Artificial Intelligence)', time: '09:40 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'cse-3-sat-3', subject: 'CN LAB / AI LAB (Examination Prep Lab)', time: '10:50 AM', duration: '1h 40m', room: 'Lab 302', teacher: 'Mrs. M. Bhargavi & Dr. P. Sri Charani', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'cse-3-sat-5', subject: 'COUN (Counselling & Review)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'cse-3-sat-6', subject: 'FSD-2 (Full Stack Development-2)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Sunday: []
      };
    }

    // -------------------------------------------------------------
    // 7. REALISTIC CURRICULUM WITH INDIAN FACULTY NAMES FOR REMAINING DEPARTMENTS & YEARS
    // (IT, ECE, EEE, MECH, CIVIL, and general years)
    // -------------------------------------------------------------
    interface DeptCourse {
      code: string;
      subject: string;
      teacher: string;
      type: 'lecture' | 'lab' | 'tutorial';
    }

    interface DeptCurriculum {
      room: string;
      incharge: string;
      courses: DeptCourse[];
    }

    const deptCurriculumMap: Record<string, DeptCurriculum> = {
      IT: {
        room: 'IT-204',
        incharge: 'Dr. K. V. Rama Rao',
        courses: [
          { code: 'WT', subject: 'WT (Web Technologies)', teacher: 'Dr. K. V. Rama Rao', type: 'lecture' },
          { code: 'CC', subject: 'CC (Cloud Computing & Virtualization)', teacher: 'Mrs. P. Swapna', type: 'lecture' },
          { code: 'DBA', subject: 'DBA (Database Administration & Big Data)', teacher: 'Mr. N. Venkatesh', type: 'lecture' },
          { code: 'IS', subject: 'IS (Information Security & Cryptography)', teacher: 'Dr. G. Suresh Kumar', type: 'lecture' },
          { code: 'DEVOPS', subject: 'DEVOPS (DevOps & CI/CD Pipelines)', teacher: 'Mrs. T. Anitha', type: 'lecture' },
          { code: 'MAD', subject: 'MAD (Mobile Application Development)', teacher: 'Mr. B. Ravi Teja', type: 'lecture' },
          { code: 'WT LAB', subject: 'WT LAB (Web Technologies Lab)', teacher: 'Dr. K. V. Rama Rao & Mrs. P. Swapna', type: 'lab' },
          { code: 'MAD LAB', subject: 'MAD LAB (Mobile Application Development Lab)', teacher: 'Mr. B. Ravi Teja & Mrs. T. Anitha', type: 'lab' }
        ]
      },
      ECE: {
        room: 'EC-106',
        incharge: 'Dr. Rajesh Kumar',
        courses: [
          { code: 'VLSI', subject: 'VLSI (VLSI System Design & Verilog)', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
          { code: 'ES', subject: 'ES (Embedded Systems & Microcontrollers)', teacher: 'Mrs. D. Sireesha', type: 'lecture' },
          { code: 'DSP', subject: 'DSP (Digital Signal Processing)', teacher: 'Dr. V. Murali Krishna', type: 'lecture' },
          { code: 'WC', subject: 'WC (Wireless & Cellular Communications)', teacher: 'Mr. Ch. Srinivas', type: 'lecture' },
          { code: 'SS', subject: 'SS (Signals and Systems Analysis)', teacher: 'Mrs. K. Himabindu', type: 'lecture' },
          { code: 'DIP', subject: 'DIP (Digital Image Processing)', teacher: 'Mr. S. Satyanarayana', type: 'lecture' },
          { code: 'DSP LAB', subject: 'DSP LAB (Digital Signal Processing Lab)', teacher: 'Dr. V. Murali Krishna & Mrs. K. Himabindu', type: 'lab' },
          { code: 'MP LAB', subject: 'MP LAB (Microprocessors & Microcontrollers Lab)', teacher: 'Mr. S. Satyanarayana & Mrs. D. Sireesha', type: 'lab' }
        ]
      },
      EEE: {
        room: 'EE-205',
        incharge: 'Dr. M. V. Sudhakara Rao',
        courses: [
          { code: 'PE', subject: 'PE (Power Electronics & Inverters)', teacher: 'Dr. M. V. Sudhakara Rao', type: 'lecture' },
          { code: 'EM', subject: 'EM (Electrical Machines-II)', teacher: 'Mrs. S. Bhavani', type: 'lecture' },
          { code: 'CS', subject: 'CS (Control Systems & State Space)', teacher: 'Dr. P. Naresh Kumar', type: 'lecture' },
          { code: 'EV', subject: 'EV (Smart Grid & Electric Vehicles)', teacher: 'Mr. V. Sai Kiran', type: 'lecture' },
          { code: 'PTD', subject: 'PTD (Power Transmission & Distribution)', teacher: 'Mrs. R. Gayathri', type: 'lecture' },
          { code: 'RES', subject: 'RES (Renewable Energy Sources & Solar)', teacher: 'Mr. K. Kalyan Sagar', type: 'lecture' },
          { code: 'EM LAB', subject: 'EM LAB (Electrical Machines Laboratory)', teacher: 'Mrs. S. Bhavani & Mr. V. Sai Kiran', type: 'lab' },
          { code: 'PE LAB', subject: 'PE LAB (Power Electronics & Drives Lab)', teacher: 'Dr. M. V. Sudhakara Rao & Dr. P. Naresh Kumar', type: 'lab' }
        ]
      },
      MECH: {
        room: 'ME-301',
        incharge: 'Dr. K. Satyanarayana',
        courses: [
          { code: 'TD', subject: 'TD (Applied Thermodynamics)', teacher: 'Dr. K. Satyanarayana', type: 'lecture' },
          { code: 'FM', subject: 'FM (Fluid Mechanics & Machinery)', teacher: 'Mr. P. Prasad Raju', type: 'lecture' },
          { code: 'KM', subject: 'KM (Kinematics of Machinery)', teacher: 'Dr. M. Ravi Sankar', type: 'lecture' },
          { code: 'HMT', subject: 'HMT (Heat and Mass Transfer)', teacher: 'Mrs. V. Madhavi', type: 'lecture' },
          { code: 'AE', subject: 'AE (Automobile Engineering)', teacher: 'Mr. T. Surya Prakash', type: 'lecture' },
          { code: 'MT', subject: 'MT (Manufacturing Technology)', teacher: 'Mr. B. Vinod Kumar', type: 'lecture' },
          { code: 'CAD LAB', subject: 'CAD LAB (SolidWorks & ANSYS Simulation Lab)', teacher: 'Mr. B. Vinod Kumar & Dr. M. Ravi Sankar', type: 'lab' },
          { code: 'FM LAB', subject: 'FM LAB (Fluid Mechanics Laboratory)', teacher: 'Mr. P. Prasad Raju & Mr. T. Surya Prakash', type: 'lab' }
        ]
      },
      CIVIL: {
        room: 'CE-102',
        incharge: 'Dr. P. Rama Murthy',
        courses: [
          { code: 'SURV', subject: 'SURV (Advanced Surveying & GIS)', teacher: 'Dr. P. Rama Murthy', type: 'lecture' },
          { code: 'SOM', subject: 'SOM (Strength of Materials)', teacher: 'Mrs. B. Sri Lalitha', type: 'lecture' },
          { code: 'SA', subject: 'SA (Structural Analysis & RCC)', teacher: 'Mr. K. Jagadeesh', type: 'lecture' },
          { code: 'GE', subject: 'GE (Geotechnical Engineering)', teacher: 'Mrs. N. Harika', type: 'lecture' },
          { code: 'HWR', subject: 'HWR (Hydraulics & Water Resources)', teacher: 'Mr. R. Mohan Krishna', type: 'lecture' },
          { code: 'CT', subject: 'CT (Concrete Technology & Testing)', teacher: 'Dr. S. Vijaya Kumar', type: 'lecture' },
          { code: 'CT LAB', subject: 'CT LAB (Concrete & Material Testing Lab)', teacher: 'Dr. S. Vijaya Kumar & Mrs. B. Sri Lalitha', type: 'lab' },
          { code: 'SURV LAB', subject: 'SURV LAB (Total Station Surveying Lab)', teacher: 'Dr. P. Rama Murthy & Mr. K. Jagadeesh', type: 'lab' }
        ]
      },
      CSE: {
        room: 'Room 201',
        incharge: 'Dr. A. Sri Krishna',
        courses: [
          { code: 'DSA', subject: 'DSA (Data Structures & Algorithms)', teacher: 'Dr. V. Harinadh', type: 'lecture' },
          { code: 'DBMS', subject: 'DBMS (Database Management Systems)', teacher: 'Dr. A. Sri Krishna', type: 'lecture' },
          { code: 'OS', subject: 'OS (Operating Systems & System Calls)', teacher: 'Prof. Pravallika Prathikonda', type: 'lecture' },
          { code: 'CN', subject: 'CN (Computer Networks)', teacher: 'Mrs. M. Bhargavi', type: 'lecture' },
          { code: 'SE', subject: 'SE (Software Engineering)', teacher: 'Mr. G. Surendra', type: 'lecture' },
          { code: 'CD', subject: 'CD (Compiler Design)', teacher: 'Dr. K. Ashok', type: 'lecture' },
          { code: 'DSA LAB', subject: 'DSA LAB (Data Structures & Algorithms Lab)', teacher: 'Dr. V. Harinadh & Prof. Pravallika Prathikonda', type: 'lab' },
          { code: 'DBMS LAB', subject: 'DBMS LAB (Database Systems Lab)', teacher: 'Dr. A. Sri Krishna & Mr. G. Surendra', type: 'lab' }
        ]
      },
      AI: {
        room: 'AI-101',
        incharge: 'Dr. P. Sri Charani',
        courses: [
          { code: 'AI', subject: 'AI (Artificial Intelligence Principles)', teacher: 'Dr. P. Sri Charani', type: 'lecture' },
          { code: 'ML', subject: 'ML (Machine Learning Foundations)', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
          { code: 'EDA', subject: 'EDA (Exploratory Data Analysis using Python)', teacher: 'Mr. MP. Praveen Kumar', type: 'lecture' },
          { code: 'COA', subject: 'COA (Computer Organization and Architecture)', teacher: 'Mr. K. Srikanth', type: 'lecture' },
          { code: 'CN', subject: 'CN (Computer Networks)', teacher: 'Mrs. M. Bhargavi', type: 'lecture' },
          { code: 'FSD', subject: 'FSD (Full Stack Development)', teacher: 'Mr. Mohammad Towqeer UL Haq', type: 'lecture' },
          { code: 'AI LAB', subject: 'AI LAB (Artificial Intelligence Lab)', teacher: 'Dr. P. Sri Charani & Ms. R. D. Priyanka', type: 'lab' },
          { code: 'EDA LAB', subject: 'EDA LAB (Python Data Science Lab)', teacher: 'Mr. MP. Praveen Kumar & Mr. K. Srikanth', type: 'lab' }
        ]
      }
    };

    const cur = deptCurriculumMap[dept] || deptCurriculumMap['IT'];
    const courses = cur.courses;
    const roomNo = cur.room;
    const incharge = cur.incharge;

    return {
      Monday: [
        { id: `gen-${dept}-mon-1`, subject: courses[0].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[0].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-mon-2`, subject: courses[1].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-mon-3`, subject: courses[2].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-mon-4`, subject: courses[3].subject, time: '11:40 AM', duration: '50m', room: roomNo, teacher: courses[3].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-mon-5`, subject: courses[4].subject, time: '01:50 PM', duration: '50m', room: roomNo, teacher: courses[4].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-mon-6`, subject: courses[5].subject, time: '02:40 PM', duration: '50m', room: roomNo, teacher: courses[5].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Tuesday: [
        { id: `gen-${dept}-tue-1`, subject: courses[1].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-tue-2`, subject: courses[2].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-tue-3`, subject: courses[0].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[0].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-tue-4`, subject: courses[4].subject, time: '11:40 AM', duration: '50m', room: roomNo, teacher: courses[4].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-tue-5`, subject: courses[6].subject, time: '01:50 PM', duration: '2h', room: `${roomNo} Lab`, teacher: courses[6].teacher, students: 45, type: 'lab', department: dept, branch, incharge },
        { id: `gen-${dept}-tue-6`, subject: courses[3].subject, time: '03:30 PM', duration: '50m', room: roomNo, teacher: courses[3].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Wednesday: [
        { id: `gen-${dept}-wed-1`, subject: courses[3].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[3].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-wed-2`, subject: courses[4].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[4].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-wed-3`, subject: courses[1].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-wed-4`, subject: courses[2].subject, time: '11:40 AM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-wed-5`, subject: courses[0].subject, time: '01:50 PM', duration: '50m', room: roomNo, teacher: courses[0].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-wed-6`, subject: courses[5].subject, time: '02:40 PM', duration: '50m', room: roomNo, teacher: courses[5].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Thursday: [
        { id: `gen-${dept}-thu-1`, subject: courses[4].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[4].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-thu-2`, subject: courses[0].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[0].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-thu-3`, subject: courses[5].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[5].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-thu-4`, subject: courses[1].subject, time: '11:40 AM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-thu-5`, subject: courses[7].subject, time: '01:50 PM', duration: '2h', room: `${roomNo} Lab`, teacher: courses[7].teacher, students: 45, type: 'lab', department: dept, branch, incharge },
        { id: `gen-${dept}-thu-6`, subject: courses[2].subject, time: '03:30 PM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Friday: [
        { id: `gen-${dept}-fri-1`, subject: courses[2].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-fri-2`, subject: courses[3].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[3].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-fri-3`, subject: courses[5].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[5].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-fri-4`, subject: 'LIB (Library & Technical Reading)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
        { id: `gen-${dept}-fri-5`, subject: courses[1].subject, time: '01:50 PM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-fri-6`, subject: courses[4].subject, time: '02:40 PM', duration: '50m', room: roomNo, teacher: courses[4].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Saturday: [
        { id: `gen-${dept}-sat-1`, subject: courses[5].subject, time: '08:50 AM', duration: '50m', room: roomNo, teacher: courses[5].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-sat-2`, subject: courses[0].subject, time: '09:40 AM', duration: '50m', room: roomNo, teacher: courses[0].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-sat-3`, subject: courses[3].subject, time: '10:50 AM', duration: '50m', room: roomNo, teacher: courses[3].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-sat-4`, subject: 'COUN (Mentorship & Career Counselling)', time: '11:40 AM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
        { id: `gen-${dept}-sat-5`, subject: courses[2].subject, time: '01:50 PM', duration: '50m', room: roomNo, teacher: courses[2].teacher, students: 45, type: 'lecture', department: dept, branch, incharge },
        { id: `gen-${dept}-sat-6`, subject: courses[1].subject, time: '02:40 PM', duration: '50m', room: roomNo, teacher: courses[1].teacher, students: 45, type: 'lecture', department: dept, branch, incharge }
      ],
      Sunday: []
    };
  }, [selectedDepartment, selectedBranch, selectedYear, selectedSemester, selectedSection, hasBranch]);

  // Dynamic list of periods/time slots that have sessions for this timetable
  const activeTimeSlots = useMemo(() => {
    const times = new Set<string>();
    Object.values(weeklySchedule).forEach(dayList => {
      dayList.forEach(cls => {
        if (cls.time) times.add(cls.time);
      });
    });

    if (times.size === 0) {
      return ['08:00 AM', '08:50 AM', '09:40 AM', '10:00 AM', '10:50 AM', '11:40 AM', '01:00 PM', '01:50 PM', '02:40 PM', '03:30 PM'];
    }

    return Array.from(times).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  }, [weeklySchedule]);

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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Find incharge and room if defined in schedule
  const currentIncharge = Object.values(weeklySchedule).flat().find(c => c.incharge)?.incharge;
  const currentRoom = Object.values(weeklySchedule).flat().find(c => c.room && c.room.startsWith('Room'))?.room || Object.values(weeklySchedule).flat()[0]?.room;

  return (
    <div className="space-y-3">
      {/* Header Controls - Compact */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200/90 p-3 sm:p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">📊</span>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Official University Timetable
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              W.E.F: 29.06.2026
            </span>
          </div>
          
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => navigateWeek('prev')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[11px] font-bold rounded-md transition-colors"
              title="Previous Week"
            >
              ← Prev
            </button>
            <span className="text-[11px] font-bold text-gray-700 bg-gray-50 border px-2.5 py-1 rounded-md font-mono">
              {formatWeekRange()}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[11px] font-bold rounded-md transition-colors"
              title="Next Week"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Dynamic Filters Row - Compact */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 ${hasBranch ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-2 mb-2`}>
          {/* 1. Department */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-2 py-1 text-xs font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* 2. Academic Year */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
              Academic Year
            </label>
            <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200">
              {years.map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`flex-1 py-0.5 text-[11px] font-bold rounded transition-all ${
                    selectedYear === yr
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                  title={`Year ${yr}`}
                >
                  Yr {yr}
                </button>
              ))}
            </div>
          </div>
          
          {/* 3. Semester */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-2 py-1 text-xs font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          
          {/* 4. Branch */}
          {hasBranch && (
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                Branch ({selectedDepartment})
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-2 py-1 text-xs font-bold border border-blue-300 bg-blue-50/40 text-blue-900 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {branchOptions.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* 5. Section */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-2 py-1 text-xs font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Combined Selection Banner & Legend - Single Sleek Strip */}
        <div className="bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-700 font-medium">
            <span className="font-bold text-gray-900 flex items-center gap-1">
              <span>🏛️</span>
              <span>{selectedDepartment}{hasBranch ? ` (${selectedBranch})` : ''} • Y{selectedYear} • {selectedSemester} • Sec {selectedSection}</span>
            </span>
            {currentRoom && (
              <span className="text-gray-500">| Room: <strong className="text-gray-800">{currentRoom}</strong></span>
            )}
            {currentIncharge && (
              <span className="text-gray-500">| Incharge: <strong className="text-blue-700">{currentIncharge}</strong></span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-[10px] text-gray-600 font-medium shrink-0">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-blue-100 border border-blue-400 rounded-xs"></span>
              <span>Lecture</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-400 rounded-xs"></span>
              <span>Lab</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 bg-purple-100 border border-purple-400 rounded-xs"></span>
              <span>Tutorial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid: Table-Fixed, No Horizontal Scroll, Compact Heights */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left table-fixed">
            <thead>
              <tr className="border-b border-gray-200">
                {/* Top-Left Corner: Day Header */}
                <th className="bg-slate-100 text-slate-800 p-1.5 text-center border-r border-slate-200 w-20 sm:w-24 shrink-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    DAY \ TIME
                  </div>
                </th>

                {/* Horizontal Period / Time Headers */}
                {activeTimeSlots.map((time, idx) => (
                  <th 
                    key={time} 
                    className="bg-slate-50 text-slate-800 p-1.5 text-center border-r border-slate-200 overflow-hidden"
                  >
                    <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight leading-none">
                      P{idx + 1}
                    </div>
                    <div className="text-[10px] font-bold text-gray-800 mt-0.5 truncate flex items-center justify-center gap-0.5">
                      <span className="text-[9px]">🕒</span>
                      <span>{time}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(() => {
                const hasSundayClasses = (weeklySchedule['Sunday'] || []).length > 0;
                const displayDays = hasSundayClasses ? dayNames.slice(0, 7) : dayNames.slice(0, 6);

                return displayDays.map((day, dayIdx) => {
                  const isSunday = day === 'Sunday';
                  const daySchedule = weeklySchedule[day] || [];
                  const dayDate = weekDays[dayIdx];
                  const dateStr = dayDate ? dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                  const isToday = dayDate ? dayDate.toDateString() === new Date().toDateString() : false;

                  return (
                    <tr 
                      key={day} 
                      className={`group transition-colors ${isToday ? 'bg-blue-50/25' : 'hover:bg-gray-50/40'}`}
                    >
                      {/* Day Column */}
                      <td className={`p-1 border-r border-slate-200 text-center w-20 sm:w-24 shrink-0 ${
                        isToday ? 'bg-blue-50/70' : 'bg-slate-50/40 group-hover:bg-slate-50'
                      }`}>
                        <div className="font-bold text-xs text-gray-900 leading-tight">
                          {day.slice(0, 3)}
                          <span className="hidden sm:inline">{day.slice(3)}</span>
                        </div>
                        <div className="text-[9px] text-gray-500 font-medium">
                          {dateStr}
                        </div>
                        <div className="mt-0.5">
                          {isSunday ? (
                            <span className="text-[8px] font-bold px-1 py-0.2 rounded-full bg-amber-100 text-amber-800">
                              Weekend
                            </span>
                          ) : (
                            <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                              {daySchedule.length} P
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Time Slot Columns */}
                      {isSunday ? (
                        <td colSpan={activeTimeSlots.length} className="py-1 px-2 text-center bg-slate-50/60">
                          <div className="flex items-center justify-center gap-1.5 text-gray-400 font-medium text-[10px]">
                            <span>🏖️</span>
                            <span>Sunday • University Weekend (No scheduled sessions)</span>
                          </div>
                        </td>
                      ) : (
                        activeTimeSlots.map((time) => {
                          const classAtTime = daySchedule.find(cls => cls.time === time);
                          
                          // Check if an earlier class covers this period (e.g. 2h or 3h lab)
                          const currentMinutes = timeToMinutes(time);
                          const ongoingClass = !classAtTime && daySchedule.find(cls => {
                            const startMin = timeToMinutes(cls.time);
                            const durMin = parseDurationMinutes(cls.duration);
                            return currentMinutes > startMin && currentMinutes < startMin + durMin;
                          });

                          return (
                            <td 
                              key={`${day}-${time}`} 
                              className="p-1 border-r border-slate-200 align-top overflow-hidden"
                            >
                              {classAtTime ? (
                                <div className="bg-white border border-gray-200/90 rounded-md p-1 shadow-2xs hover:shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between min-h-[46px] h-full">
                                  <div>
                                    {/* Subject Title & Type Badge */}
                                    <div className="flex items-start justify-between gap-1 mb-0.5">
                                      <h4 
                                        className="text-[9.5px] font-bold text-gray-900 leading-tight line-clamp-2"
                                        title={classAtTime.subject}
                                      >
                                        {classAtTime.subject}
                                      </h4>
                                      <span className={`px-1 py-0.2 rounded text-[7px] font-extrabold uppercase shrink-0 border leading-none ${getTypeColor(classAtTime.type)}`}>
                                        {classAtTime.type === 'lecture' ? 'LEC' : classAtTime.type === 'lab' ? 'LAB' : 'TUT'}
                                      </span>
                                    </div>
                                    
                                    {/* Room & Duration */}
                                    <div className="flex items-center justify-between text-[8.5px] text-gray-500 font-medium">
                                      <span className="truncate text-gray-700" title={`Room ${classAtTime.room}`}>
                                        📍 {classAtTime.room}
                                      </span>
                                      <span className="font-mono text-[7.5px] text-gray-400 shrink-0">
                                        {classAtTime.duration}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Teacher Name */}
                                  <div 
                                    className="text-[8.5px] font-semibold text-gray-700 truncate pt-0.5 mt-0.5 border-t border-gray-100 flex items-center gap-0.5"
                                    title={classAtTime.teacher}
                                  >
                                    <span className="text-blue-500 text-[8px]">👤</span>
                                    <span className="truncate">{classAtTime.teacher}</span>
                                  </div>

                                  {classAtTime.isAdjusted && (
                                    <div className="text-[7px] font-bold text-orange-700 bg-orange-50 px-1 py-0.2 rounded border border-orange-200 flex items-center gap-0.5 mt-0.5">
                                      <span>🔄</span> Sub Covered
                                    </div>
                                  )}
                                </div>
                              ) : ongoingClass ? (
                                <div className="h-full min-h-[46px] bg-emerald-50/40 border border-dashed border-emerald-300 rounded-md p-1 flex flex-col justify-center items-center text-center">
                                  <span className="text-[8px]">🔬</span>
                                  <span className="text-[8.5px] font-bold text-emerald-800 leading-tight truncate w-full" title={ongoingClass.subject}>
                                    {ongoingClass.subject.split('(')[0].trim()}
                                  </span>
                                  <span className="text-[7.5px] font-medium text-emerald-600 leading-none mt-0.5">
                                    Lab Contd.
                                  </span>
                                </div>
                              ) : (
                                <div className="h-full min-h-[46px] flex items-center justify-center text-gray-300 text-[9px] font-mono hover:bg-gray-50/50 rounded transition-colors group/cell">
                                  <span className="group-hover/cell:hidden text-gray-300">—</span>
                                  <span className="hidden group-hover/cell:inline text-[8px] text-gray-400 font-sans font-medium">Free</span>
                                </div>
                              )}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustments Summary - Compact Bar */}
      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 p-2.5 sm:p-3">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
          <h3 className="text-xs font-bold text-gray-900">
            Timetable Stats • {selectedDepartment}{hasBranch ? ` (${selectedBranch})` : ''} • Year {selectedYear} ({selectedSemester}) • Sec {selectedSection}
          </h3>
          <span className="text-[10px] text-gray-500 font-medium">
            Room: <strong className="text-gray-800">{currentRoom || 'N/A'}</strong> • Incharge: <strong className="text-gray-800">{currentIncharge || 'N/A'}</strong>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-blue-50/60 border border-blue-200/50 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-[9px] font-bold text-blue-900 uppercase">Total Periods</span>
              <span className="text-[9px] text-blue-600/80">Mon - Sat</span>
            </div>
            <span className="text-base sm:text-lg font-black text-blue-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.length, 0)}
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/50 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-[9px] font-bold text-emerald-900 uppercase">Practical Labs</span>
              <span className="text-[9px] text-emerald-600/80">Lab Sessions</span>
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lab').length, 0)}
            </span>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/50 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-[9px] font-bold text-purple-900 uppercase">Lectures & Tut</span>
              <span className="text-[9px] text-purple-600/80">Theory & Mentoring</span>
            </div>
            <span className="text-base sm:text-lg font-black text-purple-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lecture' || c.type === 'tutorial').length, 0)}
            </span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/50 px-2.5 py-1.5 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-[9px] font-bold text-amber-900 uppercase">Assigned Hall</span>
              <span className="text-[9px] text-amber-600/80 truncate max-w-[100px] block">{currentIncharge || 'Dept Room'}</span>
            </div>
            <span className="text-xs sm:text-sm font-black text-amber-700 truncate">{currentRoom || 'Hall'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
