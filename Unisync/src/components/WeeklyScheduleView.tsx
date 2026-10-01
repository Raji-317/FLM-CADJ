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
          { id: 'aids-3-fri-4', subject: 'LIB (Library & Self Study)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Faculty Incharge', students: 45, type: 'tutorial', department: dept, branch, incharge },
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
    // 2. AIML 3RD YEAR 1ST SEM (CLASS: CSE(AIML)-B & A)
    // As requested: "aiml b third year"
    // -------------------------------------------------------------
    if (dept === 'AI' && branch === 'AIML' && yr === '3' && sem === 'Sem 1') {
      const roomNo = sec === 'B' ? 'C-302' : 'C-301';
      const incharge = sec === 'B' ? 'Dr. P. Sri Charani' : 'Mrs. M. Bhargavi';

      return {
        Monday: [
          { id: 'aiml-3-mon-1', subject: 'AI (Artificial Intelligence)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-2', subject: 'CN (Computer Networks)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-3', subject: 'FSD-2 (Full Stack Development-2)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-4', subject: 'COA (Computer Organization and Architecture)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-5', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-mon-6', subject: 'AI LAB (Artificial Intelligence Lab)', time: '01:50 PM', duration: '1h 40m', room: 'Lab 302', teacher: 'Dr. P. Sri Charani & Ms. R.D. Priyanka', students: 45, type: 'lab', department: dept, branch, incharge }
        ],
        Tuesday: [
          { id: 'aiml-3-tue-1', subject: 'EDA (Exploratory Data Analysis using Python)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-2', subject: 'COA (Computer Organization and Architecture)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-3', subject: 'AI (Artificial Intelligence)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-4', subject: 'CN (Computer Networks)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-5', subject: 'UID using Flutter', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Rajasekhar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-6', subject: 'RES (Renewable Energy Sources)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-tue-7', subject: 'FSD-2 (Full Stack Development-2)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Wednesday: [
          { id: 'aiml-3-wed-1', subject: 'RES (Renewable Energy Sources)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-2', subject: 'FSD-2 LAB (Full Stack Development-2 Lab)', time: '08:50 AM', duration: '2h 50m', room: 'Lab 301', teacher: 'Mr. Mohammad Towqeer UL Haq & Mr. MP. Praveen Kumar', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aiml-3-wed-5', subject: 'COA (Computer Organization and Architecture)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-6', subject: 'CN (Computer Networks)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-wed-7', subject: 'AI (Artificial Intelligence)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Thursday: [
          { id: 'aiml-3-thu-1', subject: 'CN (Computer Networks)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-2', subject: 'AI (Artificial Intelligence)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-3', subject: 'EDA (Exploratory Data Analysis using Python)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-4', subject: 'RES (Renewable Energy Sources)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-thu-5', subject: 'UID using Flutter LAB (Tinkering Lab)', time: '01:00 PM', duration: '1h 40m', room: 'Lab 303', teacher: 'Mr. K. Rajasekhar & Mr. D. Anand', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aiml-3-thu-7', subject: 'COA (Computer Organization and Architecture)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge }
        ],
        Friday: [
          { id: 'aiml-3-fri-1', subject: 'COA (Computer Organization and Architecture)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-2', subject: 'UID using Flutter', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Rajasekhar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-3', subject: 'RES (Renewable Energy Sources)', time: '10:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Kalyan Sagar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-4', subject: 'CN (Computer Networks)', time: '10:50 AM', duration: '50m', room: roomNo, teacher: 'Mrs. M. Bhargavi', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-5', subject: 'FSD-2 (Full Stack Development-2)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-6', subject: 'EDA (Exploratory Data Analysis using Python)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-fri-7', subject: 'LIB (Library & Self Study)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Faculty Incharge', students: 45, type: 'tutorial', department: dept, branch, incharge }
        ],
        Saturday: [
          { id: 'aiml-3-sat-1', subject: 'FSD-2 (Full Stack Development-2)', time: '08:00 AM', duration: '50m', room: roomNo, teacher: 'Mr. Mohammad Towqeer UL Haq', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-sat-2', subject: 'COA (Computer Organization and Architecture)', time: '08:50 AM', duration: '50m', room: roomNo, teacher: 'Mr. K. Srikanth', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-sat-3', subject: 'CN LAB / AI LAB (Hands-on Practice Lab)', time: '10:00 AM', duration: '1h 40m', room: 'Lab 302', teacher: 'Mrs. M. Bhargavi & Dr. P. Sri Charani', students: 45, type: 'lab', department: dept, branch, incharge },
          { id: 'aiml-3-sat-5', subject: 'COUN (Counselling & Mentoring)', time: '01:00 PM', duration: '50m', room: roomNo, teacher: incharge, students: 45, type: 'tutorial', department: dept, branch, incharge },
          { id: 'aiml-3-sat-6', subject: 'AI (Artificial Intelligence)', time: '01:50 PM', duration: '50m', room: roomNo, teacher: 'Dr. P. Sri Charani', students: 45, type: 'lecture', department: dept, branch, incharge },
          { id: 'aiml-3-sat-7', subject: 'EDA (Exploratory Data Analysis using Python)', time: '02:40 PM', duration: '50m', room: roomNo, teacher: 'Mr. MP. Praveen Kumar', students: 45, type: 'lecture', department: dept, branch, incharge }
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
          { id: 'cs-4-fri-7', subject: 'LIB (Library & Technical Reading)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Faculty Incharge', students: 45, type: 'tutorial', department: dept, branch, incharge }
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
          { id: 'cseb-4-tue-7', subject: 'LIB (Library & Self Study)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Faculty Incharge', students: 45, type: 'tutorial', department: dept, branch, incharge }
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
          { id: 'csea-4-fri-7', subject: 'LIB (Library & Self Study)', time: '03:30 PM', duration: '50m', room: roomNo, teacher: 'Faculty Incharge', students: 45, type: 'tutorial', department: dept, branch, incharge }
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
    // 7. DEFAULT CURRICULUM FOR OTHER YEARS / DEPARTMENTS
    // -------------------------------------------------------------
    const getGeneralSubject = (slotIdx: number, dayName: string) => {
      const prefix = yr === '1' ? 'Engg' : dept;
      const subjectsMap: Record<string, string[]> = {
        IT: ['Web Technologies', 'Cloud Computing', 'Database Administration', 'Information Security', 'DevOps & CI/CD', 'Mobile App Development'],
        ECE: ['VLSI Design', 'Embedded Systems', 'Digital Signal Processing', 'Microprocessors Lab', 'Wireless Communication', 'Signals & Systems'],
        EEE: ['Power Electronics', 'Electrical Machines', 'Control Systems', 'Smart Grid & EV', 'Power Transmission', 'Renewable Energy'],
        MECH: ['Thermodynamics', 'Fluid Mechanics Lab', 'Kinematics of Machinery', 'CAD/CAM SolidWorks Lab', 'Heat & Mass Transfer', 'Automobile Engg'],
        CIVIL: ['Surveying & Geomatics', 'Strength of Materials', 'Concrete Technology Lab', 'Structural Analysis', 'Geotechnical Engineering', 'Hydraulics Lab'],
        CSE: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Compiler Design'],
        AI: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Big Data Analytics', 'AI Ethics']
      };

      const list = subjectsMap[dept] || subjectsMap['CSE'];
      return list[slotIdx % list.length] + (dayName === 'Wednesday' && slotIdx === 2 ? ' Lab' : '');
    };

    const generalTimes = ['08:50 AM', '09:40 AM', '10:50 AM', '11:40 AM', '01:50 PM', '02:40 PM', '03:30 PM'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const generalResult: WeeklySchedule = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [] };

    days.forEach(day => {
      generalResult[day] = generalTimes.slice(0, 5).map((time, idx) => {
        const isLab = idx === 2 && (day === 'Tuesday' || day === 'Thursday');
        return {
          id: `gen-${dept}-${yr}-${sem}-${day}-${idx}`,
          subject: getGeneralSubject(idx, day),
          time,
          duration: isLab ? '2h' : '50m',
          room: isLab ? 'Lab Core 1' : 'Room 201',
          teacher: 'Department Faculty',
          students: 45,
          type: isLab ? 'lab' : idx === 4 ? 'tutorial' : 'lecture',
          department: dept,
          branch,
          year: yr,
          semester: sem,
          section: sec
        };
      });
    });

    return generalResult;
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
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-xl font-bold text-gray-900">
                Official University Timetable
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                W.E.F: 29.06.2026
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select Department, Academic Year (1-4), Semester (Sem 1 / Sem 2), and Branch to view the exact scheduled timetable.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => navigateWeek('prev')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors"
            >
              ← Previous Week
            </button>
            <span className="text-xs font-bold text-gray-700 bg-gray-50 border px-3 py-1.5 rounded-lg font-mono">
              {formatWeekRange()}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Next Week →
            </button>
          </div>
        </div>

        {/* Dynamic Filters Row */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${hasBranch ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 mb-4`}>
          {/* 1. Department Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* 2. Small Buttons to choose 1 to 4 Years */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Academic Year
            </label>
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              {years.map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedYear === yr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/70'
                  }`}
                  title={`Year ${yr}`}
                >
                  Yr {yr}
                </button>
              ))}
            </div>
          </div>
          
          {/* 3. Semester Dropdown (Sem 1 and Sem 2) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          
          {/* 4. Branch Dropdown (Rendered ONLY for CSE and AI departments) */}
          {hasBranch && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Branch ({selectedDepartment})
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold border border-blue-300 bg-blue-50/40 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                {branchOptions.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          )}
          
          {/* 5. Section Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-2xs"
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Selection & College Incharge Display Banner */}
        <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/70 p-3.5 rounded-xl mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-900 font-bold flex items-center gap-1.5">
              <span>🏛️</span>
              <span>
                {selectedDepartment}{hasBranch ? ` (${selectedBranch})` : ''} • Year {selectedYear} • {selectedSemester} • Section {selectedSection}
              </span>
            </p>
            <p className="text-[11px] text-gray-500">
              {currentRoom && <span>Room: <strong className="text-gray-700">{currentRoom}</strong> • </span>}
              {currentIncharge && <span>Class Incharge: <strong className="text-blue-800">{currentIncharge}</strong></span>}
            </p>
          </div>
          
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow-2xs whitespace-nowrap">
            {selectedDepartment} {hasBranch ? selectedBranch : ''} - Sec {selectedSection} (Year {selectedYear})
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-xs text-gray-600 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Lecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
            <span>Laboratory</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Tutorial / Honors / Mentorship</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* Time Column Header */}
          <div className="bg-gray-50 p-4 border-r border-b font-bold text-gray-800 text-xs uppercase tracking-wider">
            Period / Time
          </div>
          
          {/* Day Headers */}
          {dayNames.slice(0, 7).map((day, index) => (
            <div key={day} className="bg-gray-50 p-3.5 border-r border-b font-bold text-gray-800 text-center">
              <div className="text-xs uppercase tracking-wider">{day}</div>
              <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                {weekDays[index]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}

          {/* Time Slots Rows */}
          {activeTimeSlots.map((time) => (
            <React.Fragment key={time}>
              {/* Time Label */}
              <div className="bg-gray-50 p-3.5 border-r border-b text-xs font-bold text-gray-700 flex items-center">
                {time}
              </div>
              
              {/* Day Cells */}
              {dayNames.slice(0, 7).map((day) => {
                const daySchedule = weeklySchedule[day] || [];
                const classAtTime = daySchedule.find(cls => cls.time === time);

                return (
                  <div key={`${day}-${time}`} className="border-r border-b p-2 min-h-[90px] bg-white">
                    {classAtTime ? (
                      <div className="bg-white border rounded-lg p-2.5 shadow-2xs hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <h4 className="text-xs font-bold text-gray-900 leading-tight">
                              {classAtTime.subject}
                            </h4>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getTypeColor(classAtTime.type)}`}>
                              {classAtTime.type}
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-gray-600 space-y-0.5 mt-1.5">
                            <div className="flex items-center justify-between font-medium">
                              <span>📍 {classAtTime.room}</span>
                              <span>🕒 {classAtTime.duration}</span>
                            </div>
                            
                            <div className="font-semibold text-gray-800 text-xs mt-1 pt-1 border-t border-gray-100 flex items-center gap-1">
                              <span>👨‍🏫</span>
                              <span className="truncate" title={classAtTime.teacher}>{classAtTime.teacher}</span>
                            </div>
                          </div>
                        </div>

                        {classAtTime.isAdjusted && (
                          <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-gray-100">
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                              🔄 Peer Covered
                            </span>
                          </div>
                        )}
                      </div>
                    ) : day === 'Sunday' ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-gray-400 italic font-medium">
                        Weekend
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Adjustments Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          Timetable Summary • {selectedDepartment}{hasBranch ? ` (${selectedBranch})` : ''} • Year {selectedYear} ({selectedSemester}) • Section {selectedSection}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50/60 border border-blue-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-1">Total Scheduled Periods</h4>
            <p className="text-2xl font-black text-blue-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.length, 0)}
            </p>
            <p className="text-xs text-blue-600/80 mt-0.5">Sessions across Monday - Saturday</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-1">Practical Lab Periods</h4>
            <p className="text-2xl font-black text-emerald-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lab').length, 0)}
            </p>
            <p className="text-xs text-emerald-600/80 mt-0.5">Laboratory & Tinkering sessions</p>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider mb-1">Lectures & Tutorials</h4>
            <p className="text-2xl font-black text-purple-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lecture' || c.type === 'tutorial').length, 0)}
            </p>
            <p className="text-xs text-purple-600/80 mt-0.5">Core theory, honors & mentoring</p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-1">Classroom Assigned</h4>
            <p className="text-2xl font-black text-amber-700">{currentRoom || 'Assigned Hall'}</p>
            <p className="text-xs text-amber-600/80 mt-0.5">{currentIncharge ? `Incharge: ${currentIncharge}` : 'Department Room'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
