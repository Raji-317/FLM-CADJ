import { useState, useMemo } from "react";
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
  year?: string;
  semester?: string;
  section?: string;
  isAdjusted?: boolean;
  adjustmentType?: 'substitute' | 'reschedule' | 'room_change';
  originalTeacher?: string;
  adjustmentReason?: string;
}

interface WeeklySchedule {
  [key: string]: ClassSession[];
}

export const WeeklyScheduleView = ({ selectedDate, userType: _userType }: WeeklyScheduleViewProps) => {
  // ✅ User-specified departments: cse, ai, it, ece, eee, mech, civil
  const departments = ['CSE', 'AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  
  // ✅ User-specified semesters: Sem 1 and Sem 2 (Spring/Fall removed)
  const semesters = ['Sem 1', 'Sem 2'];
  
  // ✅ 1 to 4 years selector
  const years = ['1', '2', '3', '4'];
  const sections = ['A', 'B'];

  const [selectedDepartment, setSelectedDepartment] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('Sem 1');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('A');
  const [currentWeek, setCurrentWeek] = useState(selectedDate);

  // ✅ Branch logic based on user request:
  // - AI department -> branches: AIML and AIDS
  // - CSE department -> branches: CSE and Cyber Security
  // - Remaining departments -> No branch dropdown
  const hasBranch = selectedDepartment === 'CSE' || selectedDepartment === 'AI';

  const branchOptions = useMemo(() => {
    if (selectedDepartment === 'AI') {
      return ['AIML', 'AIDS'];
    }
    if (selectedDepartment === 'CSE') {
      return ['CSE', 'Cyber Security'];
    }
    return [];
  }, [selectedDepartment]);

  // Handle department change and ensure selectedBranch is valid
  const handleDepartmentChange = (newDept: string) => {
    setSelectedDepartment(newDept);
    if (newDept === 'AI') {
      setSelectedBranch('AIML');
    } else if (newDept === 'CSE') {
      setSelectedBranch('CSE');
    } else {
      setSelectedBranch('');
    }
  };

  // ✅ Dynamic curriculum generator for every Department, Branch, Year, Semester & Section
  const weeklySchedule: WeeklySchedule = useMemo(() => {
    const dept = selectedDepartment;
    const branch = hasBranch ? selectedBranch : selectedDepartment;
    const yr = selectedYear;
    const sem = selectedSemester;
    const sec = selectedSection;

    // Helper to generate realistic subject templates
    const getSubjectPool = () => {
      // 1st Year (General Engineering Core)
      if (yr === '1') {
        if (sem === 'Sem 1') {
          return {
            mon: [
              { sub: 'Engineering Mathematics-I', time: '09:00 AM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. M. Sailakshmi', type: 'lecture' },
              { sub: 'Engineering Physics Lab', time: '11:00 AM', dur: '2h', room: 'Lab 101', teacher: 'Dr. Anita Roy', type: 'lab' },
              { sub: 'Basic Electrical Engg (BEE)', time: '02:00 PM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. Rajesh Kumar', type: 'lecture' }
            ],
            tue: [
              { sub: 'C Programming Fundamentals', time: '09:00 AM', dur: '1h 30m', room: 'Room 101', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Engineering Graphics & CAD Lab', time: '11:00 AM', dur: '2h', room: 'CAD Lab 1', teacher: 'Prof. Michael Chen', type: 'lab' },
              { sub: 'Professional Communication', time: '02:00 PM', dur: '1h', room: 'Room 101', teacher: 'Prof. Jane Smith', type: 'tutorial' }
            ],
            wed: [
              { sub: 'Basic Electrical Engg Lab', time: '09:00 AM', dur: '2h', room: 'Lab 201', teacher: 'Dr. Rajesh Kumar', type: 'lab' },
              { sub: 'Engineering Mathematics-I', time: '11:00 AM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. M. Sailakshmi', type: 'lecture' },
              { sub: 'Engineering Physics', time: '02:00 PM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. Anita Roy', type: 'lecture' }
            ],
            thu: [
              { sub: 'C Programming Lab', time: '10:00 AM', dur: '2h', room: 'Lab 301', teacher: 'Prof. Sarah Johnson', type: 'lab' },
              { sub: 'Environmental Science', time: '02:00 PM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. Lisa Anderson', type: 'lecture' }
            ],
            fri: [
              { sub: 'Engineering Physics', time: '09:00 AM', dur: '1h 30m', room: 'Room 101', teacher: 'Dr. Anita Roy', type: 'lecture' },
              { sub: 'Math-I Problem Solving Tutorial', time: '11:00 AM', dur: '1h', room: 'Room 101', teacher: 'Dr. M. Sailakshmi', type: 'tutorial' },
              { sub: 'Workshop Practice Lab', time: '02:00 PM', dur: '2h', room: 'Workshop A', teacher: 'Prof. James Wilson', type: 'lab' }
            ],
            sat: [
              { sub: 'Engineering Induction & Coding Mentoring', time: '10:00 AM', dur: '2h', room: 'Auditorium A', teacher: 'Faculty Core Team', type: 'lecture' }
            ]
          };
        } else {
          return {
            mon: [
              { sub: 'Engineering Mathematics-II', time: '09:00 AM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. M. Sailakshmi', type: 'lecture' },
              { sub: 'Python Programming Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Basic Electronics Engineering', time: '02:00 PM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. Rajesh Kumar', type: 'lecture' }
            ],
            tue: [
              { sub: 'Data Structures Foundation', time: '09:00 AM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. V. Harinadh', type: 'lecture' },
              { sub: 'Applied Chemistry Lab', time: '11:00 AM', dur: '2h', room: 'Lab 103', teacher: 'Dr. Emily Davis', type: 'lab' },
              { sub: 'Engineering Mathematics-II', time: '02:00 PM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. M. Sailakshmi', type: 'lecture' }
            ],
            wed: [
              { sub: 'Data Structures Foundation Lab', time: '09:00 AM', dur: '2h', room: 'Lab 301', teacher: 'Dr. V. Harinadh', type: 'lab' },
              { sub: 'Applied Chemistry', time: '11:00 AM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. Emily Davis', type: 'lecture' },
              { sub: 'Basic Electronics Lab', time: '02:00 PM', dur: '2h', room: 'Lab 202', teacher: 'Dr. Rajesh Kumar', type: 'lab' }
            ],
            thu: [
              { sub: 'Python Programming', time: '10:00 AM', dur: '1h 30m', room: 'Room 102', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Universal Human Values & Ethics', time: '02:00 PM', dur: '1h 30m', room: 'Room 102', teacher: 'Prof. Jane Smith', type: 'lecture' }
            ],
            fri: [
              { sub: 'Basic Electronics', time: '09:00 AM', dur: '1h 30m', room: 'Room 102', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
              { sub: 'Python Mini-Project Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Math-II Doubt Clearing Tutorial', time: '02:00 PM', dur: '1h', room: 'Room 102', teacher: 'Dr. M. Sailakshmi', type: 'tutorial' }
            ],
            sat: [
              { sub: 'Freshman Project Exhibition & Tech Talk', time: '10:00 AM', dur: '2h', room: 'Auditorium B', teacher: 'Faculty Core Team', type: 'lab' }
            ]
          };
        }
      }

      // Department & Branch Specific Curriculums (Years 2, 3, 4)
      if (dept === 'CSE') {
        if (branch === 'Cyber Security') {
          return {
            mon: [
              { sub: 'Fundamentals of Cyber Security', time: '09:00 AM', dur: '1h 30m', room: 'Room 205', teacher: 'Prof. Michael Chen', type: 'lecture' },
              { sub: 'Linux Internals & Security Lab', time: '11:00 AM', dur: '2h', room: 'Lab 304', teacher: 'Dr. Emily Davis', type: 'lab' },
              { sub: 'Computer Networks', time: '02:00 PM', dur: '1h 30m', room: 'Room 205', teacher: 'Prof. Sarah Johnson', type: 'lecture' }
            ],
            tue: [
              { sub: 'Applied Cryptography Basics', time: '09:00 AM', dur: '1h 30m', room: 'Room 205', teacher: 'Dr. Lisa Anderson', type: 'lecture' },
              { sub: 'Network Security Protocols Lab', time: '11:00 AM', dur: '2h', room: 'Lab 304', teacher: 'Prof. Michael Chen', type: 'lab' },
              { sub: 'OS Architecture & Hardening', time: '02:00 PM', dur: '1h 30m', room: 'Room 205', teacher: 'Dr. Robert Wilson', type: 'lecture' }
            ],
            wed: [
              { sub: 'Ethical Hacking & Vulnerability Analysis', time: '09:00 AM', dur: '1h 30m', room: 'Room 205', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Cyber Defense Operations Lab', time: '11:00 AM', dur: '2h', room: 'Lab 304', teacher: 'Prof. Michael Chen', type: 'lab' },
              { sub: 'Database Security & Access Control', time: '02:00 PM', dur: '1h 30m', room: 'Room 205', teacher: 'Dr. A. Sri Krishna', type: 'lecture' }
            ],
            thu: [
              { sub: 'Malware Analysis & Forensics', time: '10:00 AM', dur: '1h 30m', room: 'Room 205', teacher: 'Dr. Lisa Anderson', type: 'lecture' },
              { sub: 'Secure Coding in C/C++ Lab', time: '01:00 PM', dur: '2h', room: 'Lab 304', teacher: 'Dr. Emily Davis', type: 'lab' }
            ],
            fri: [
              { sub: 'Cloud & Infrastructure Security', time: '09:00 AM', dur: '1h 30m', room: 'Room 205', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Penetration Testing Hands-on Lab', time: '11:00 AM', dur: '2h', room: 'Lab 304', teacher: 'Prof. Michael Chen', type: 'lab' },
              { sub: 'Cyber Laws & Incident Response', time: '02:00 PM', dur: '1h', room: 'Room 205', teacher: 'Dr. Robert Wilson', type: 'tutorial' }
            ],
            sat: [
              { sub: 'Capture The Flag (CTF) Coaching', time: '10:00 AM', dur: '2h', room: 'Lab 304', teacher: 'Prof. Michael Chen', type: 'lab' }
            ]
          };
        } else {
          // Standard CSE
          return {
            mon: [
              { sub: 'Data Structures & Algorithms', time: '09:00 AM', dur: '1h 30m', room: 'Room 204', teacher: 'Dr. V. Harinadh', type: 'lecture' },
              { sub: 'Algorithm Design Lab', time: '11:00 AM', dur: '2h', room: 'Lab 301', teacher: 'Dr. V. Harinadh', type: 'lab' },
              { sub: 'Database Systems (DBMS)', time: '02:00 PM', dur: '1h 30m', room: 'Room 105', teacher: 'Dr. A. Sri Krishna', type: 'lecture' }
            ],
            tue: [
              { sub: 'Software Engineering & Design', time: '09:00 AM', dur: '1h 30m', room: 'Room 201', teacher: 'Prof. Pravallika Prathikonda', type: 'lecture' },
              { sub: 'DBMS & SQL Hands-on Lab', time: '11:00 AM', dur: '2h', room: 'Lab 303', teacher: 'Dr. A. Sri Krishna', type: 'lab' },
              { sub: 'Operating Systems & Concurrency', time: '02:00 PM', dur: '1h 30m', room: 'Room 204', teacher: 'Prof. Michael Chen', type: 'lecture' }
            ],
            wed: [
              { sub: 'Computer Networks & Protocols', time: '09:00 AM', dur: '1h 30m', room: 'Room 204', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Web Fullstack Engineering Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pravallika Prathikonda', type: 'lab' },
              { sub: 'Theory of Computation', time: '02:00 PM', dur: '1h 30m', room: 'Room 204', teacher: 'Dr. V. Harinadh', type: 'lecture' }
            ],
            thu: [
              { sub: 'Cloud Infrastructure & DevOps', time: '10:00 AM', dur: '1h 30m', room: 'Room 105', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Operating Systems System Lab', time: '01:00 PM', dur: '2h', room: 'Lab 301', teacher: 'Prof. Michael Chen', type: 'lab' },
              { sub: 'Compiler Design Tutorial', time: '03:00 PM', dur: '1h', room: 'Room 204', teacher: 'Dr. V. Harinadh', type: 'tutorial' }
            ],
            fri: [
              { sub: 'Cyber Defense & Network Security', time: '09:00 AM', dur: '1h 30m', room: 'Room 204', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
              { sub: 'Computer Networks Simulation Lab', time: '11:00 AM', dur: '2h', room: 'Lab 301', teacher: 'Prof. Sarah Johnson', type: 'lab' },
              { sub: 'Agile Software Project Review', time: '02:00 PM', dur: '2h', room: 'Room 201', teacher: 'Prof. Pravallika Prathikonda', type: 'tutorial' }
            ],
            sat: [
              { sub: 'Industry Tech Talk & Hackathon', time: '10:00 AM', dur: '2h', room: 'Auditorium A', teacher: 'Dr. V. Harinadh', type: 'lecture' },
              { sub: 'Capstone Project Evaluation', time: '01:00 PM', dur: '2h', room: 'Lab 301', teacher: 'Prof. Sarah Johnson', type: 'lab' }
            ]
          };
        }
      }

      if (dept === 'AI') {
        if (branch === 'AIDS') {
          return {
            mon: [
              { sub: 'Data Science & Statistical Analysis', time: '09:00 AM', dur: '1h 30m', room: 'Room 303', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Exploratory Data Analysis (EDA) Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Big Data Storage Systems', time: '02:00 PM', dur: '1h 30m', room: 'Room 303', teacher: 'Dr. A. Sri Krishna', type: 'lecture' }
            ],
            tue: [
              { sub: 'Predictive Modeling & Inference', time: '09:00 AM', dur: '1h 30m', room: 'Room 303', teacher: 'Dr. M. Sailakshmi', type: 'lecture' },
              { sub: 'Data Visualization & Tableau Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Database Query Optimization', time: '02:00 PM', dur: '1h 30m', room: 'Room 303', teacher: 'Dr. A. Sri Krishna', type: 'lecture' }
            ],
            wed: [
              { sub: 'Machine Learning for Data Science', time: '09:00 AM', dur: '1h 30m', room: 'Room 303', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Big Data Processing Lab (Hadoop/Spark)', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Dr. A. Sri Krishna', type: 'lab' },
              { sub: 'Cloud Data Warehousing', time: '02:00 PM', dur: '1h 30m', room: 'Room 303', teacher: 'Prof. Sarah Johnson', type: 'lecture' }
            ],
            thu: [
              { sub: 'Natural Language Data Mining', time: '10:00 AM', dur: '1h 30m', room: 'Room 303', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Predictive Analytics Lab', time: '01:00 PM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' }
            ],
            fri: [
              { sub: 'Applied Deep Learning for Analytics', time: '09:00 AM', dur: '1h 30m', room: 'Room 303', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Business Analytics Showcase Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Data Ethics & Governance', time: '02:00 PM', dur: '1h', room: 'Room 303', teacher: 'Dr. Lisa Anderson', type: 'tutorial' }
            ],
            sat: [
              { sub: 'Data Science & GenAI Masterclass', time: '10:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' }
            ]
          };
        } else {
          // Standard AIML
          return {
            mon: [
              { sub: 'Machine Learning Fundamentals', time: '09:00 AM', dur: '1h 30m', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Artificial Intelligence Lab (PyTorch)', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Mathematics for Machine Learning', time: '02:00 PM', dur: '1h 30m', room: 'Room 301', teacher: 'Dr. M. Sailakshmi', type: 'lecture' }
            ],
            tue: [
              { sub: 'Deep Learning & Neural Networks', time: '09:00 AM', dur: '1h 30m', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'TensorFlow & Keras Implementation Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Optimization Techniques for AI', time: '02:00 PM', dur: '1h 30m', room: 'Room 301', teacher: 'Dr. M. Sailakshmi', type: 'lecture' }
            ],
            wed: [
              { sub: 'Natural Language Processing (NLP)', time: '09:00 AM', dur: '1h 30m', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'NLP & Text Analytics Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' },
              { sub: 'Knowledge Representation & Logic', time: '02:00 PM', dur: '1h 30m', room: 'Room 301', teacher: 'Dr. V. Harinadh', type: 'lecture' }
            ],
            thu: [
              { sub: 'Computer Vision Architectures', time: '10:00 AM', dur: '1h 30m', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'Computer Vision OpenCV Lab', time: '01:00 PM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' }
            ],
            fri: [
              { sub: 'Reinforcement Learning & Robotics', time: '09:00 AM', dur: '1h 30m', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'lecture' },
              { sub: 'AI Models Cloud Deployment Lab', time: '11:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Sarah Johnson', type: 'lab' },
              { sub: 'AI Ethics & Alignment Seminar', time: '02:00 PM', dur: '1h', room: 'Room 301', teacher: 'Prof. Pradeep Juluri', type: 'tutorial' }
            ],
            sat: [
              { sub: 'Generative AI & LLMs Hands-on Workshop', time: '10:00 AM', dur: '2h', room: 'Lab 302', teacher: 'Prof. Pradeep Juluri', type: 'lab' }
            ]
          };
        }
      }

      if (dept === 'IT') {
        return {
          mon: [
            { sub: 'Web Technologies & Frameworks', time: '09:00 AM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
            { sub: 'Full Stack Web Development Lab', time: '11:00 AM', dur: '2h', room: 'Lab 303', teacher: 'Prof. Pravallika Prathikonda', type: 'lab' },
            { sub: 'Object Oriented Software Design', time: '02:00 PM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Pravallika Prathikonda', type: 'lecture' }
          ],
          tue: [
            { sub: 'Cloud Computing & Virtualization', time: '09:00 AM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
            { sub: 'Database Administration Lab', time: '11:00 AM', dur: '2h', room: 'Lab 303', teacher: 'Dr. A. Sri Krishna', type: 'lab' },
            { sub: 'Information Security & Privacy', time: '02:00 PM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Michael Chen', type: 'lecture' }
          ],
          wed: [
            { sub: 'Computer Networks & Administration', time: '09:00 AM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Sarah Johnson', type: 'lecture' },
            { sub: 'Cloud DevOps CI/CD Lab', time: '11:00 AM', dur: '2h', room: 'Lab 301', teacher: 'Prof. Sarah Johnson', type: 'lab' },
            { sub: 'Mobile Application Development', time: '02:00 PM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Pravallika Prathikonda', type: 'lecture' }
          ],
          thu: [
            { sub: 'Enterprise System Architecture', time: '10:00 AM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Michael Chen', type: 'lecture' },
            { sub: 'Mobile App Development Lab', time: '01:00 PM', dur: '2h', room: 'Lab 303', teacher: 'Prof. Pravallika Prathikonda', type: 'lab' }
          ],
          fri: [
            { sub: 'Software Testing & Automation', time: '09:00 AM', dur: '1h 30m', room: 'Room 202', teacher: 'Prof. Pravallika Prathikonda', type: 'lecture' },
            { sub: 'Automated Testing Lab', time: '11:00 AM', dur: '2h', room: 'Lab 303', teacher: 'Prof. Pravallika Prathikonda', type: 'lab' },
            { sub: 'IT Project Management Review', time: '02:00 PM', dur: '1h', room: 'Room 202', teacher: 'Prof. Sarah Johnson', type: 'tutorial' }
          ],
          sat: [
            { sub: 'Cloud & Fullstack Project Mentoring', time: '10:00 AM', dur: '2h', room: 'Lab 303', teacher: 'Prof. Sarah Johnson', type: 'lab' }
          ]
        };
      }

      if (dept === 'ECE') {
        return {
          mon: [
            { sub: 'Electronic Devices & Circuits', time: '09:00 AM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Microprocessors & Controllers Lab', time: '11:00 AM', dur: '2h', room: 'Lab 201', teacher: 'Dr. Rajesh Kumar', type: 'lab' },
            { sub: 'Signals & Linear Systems', time: '02:00 PM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' }
          ],
          tue: [
            { sub: 'Analog & Digital Communication', time: '09:00 AM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Digital System Design Lab (Verilog)', time: '11:00 AM', dur: '2h', room: 'Lab 201', teacher: 'Dr. Rajesh Kumar', type: 'lab' },
            { sub: 'Electromagnetic Field Theory', time: '02:00 PM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Anita Roy', type: 'lecture' }
          ],
          wed: [
            { sub: 'VLSI Design & CMOS Circuits', time: '09:00 AM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Communication Engineering Lab', time: '11:00 AM', dur: '2h', room: 'Lab 202', teacher: 'Dr. Rajesh Kumar', type: 'lab' },
            { sub: 'Digital Signal Processing (DSP)', time: '02:00 PM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. M. Sailakshmi', type: 'lecture' }
          ],
          thu: [
            { sub: 'Wireless Sensor Networks & IoT', time: '10:00 AM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'DSP Algorithms MATLAB Lab', time: '01:00 PM', dur: '2h', room: 'Lab 202', teacher: 'Dr. M. Sailakshmi', type: 'lab' }
          ],
          fri: [
            { sub: 'Embedded Systems & Real-Time OS', time: '09:00 AM', dur: '1h 30m', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Embedded Systems Hardware Lab', time: '11:00 AM', dur: '2h', room: 'Lab 201', teacher: 'Dr. Rajesh Kumar', type: 'lab' },
            { sub: 'Antenna & Wave Propagation Tutorial', time: '02:00 PM', dur: '1h', room: 'Room 106', teacher: 'Dr. Rajesh Kumar', type: 'tutorial' }
          ],
          sat: [
            { sub: 'Robotics & Hardware Prototyping Workshop', time: '10:00 AM', dur: '2h', room: 'Lab 201', teacher: 'Dr. Rajesh Kumar', type: 'lab' }
          ]
        };
      }

      if (dept === 'EEE') {
        return {
          mon: [
            { sub: 'Electrical Circuit Analysis', time: '09:00 AM', dur: '1h 30m', room: 'Room 108', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Electrical Machines-I Lab', time: '11:00 AM', dur: '2h', room: 'Machines Lab', teacher: 'Faculty EEE', type: 'lab' },
            { sub: 'DC Machines & Transformers', time: '02:00 PM', dur: '1h 30m', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' }
          ],
          tue: [
            { sub: 'Power Electronics & Drives', time: '09:00 AM', dur: '1h 30m', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' },
            { sub: 'Power Electronics Simulation Lab', time: '11:00 AM', dur: '2h', room: 'Lab 202', teacher: 'Faculty EEE', type: 'lab' },
            { sub: 'Control Systems Engineering', time: '02:00 PM', dur: '1h 30m', room: 'Room 108', teacher: 'Dr. M. Sailakshmi', type: 'lecture' }
          ],
          wed: [
            { sub: 'Power Systems Transmission & Dist.', time: '09:00 AM', dur: '1h 30m', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' },
            { sub: 'Control Systems MATLAB Lab', time: '11:00 AM', dur: '2h', room: 'Lab 202', teacher: 'Dr. M. Sailakshmi', type: 'lab' },
            { sub: 'Renewable Energy Technologies', time: '02:00 PM', dur: '1h 30m', room: 'Room 108', teacher: 'Dr. Anita Roy', type: 'lecture' }
          ],
          thu: [
            { sub: 'Smart Grid & Electric Vehicles', time: '10:00 AM', dur: '1h 30m', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' },
            { sub: 'Measurements & Instrumentation Lab', time: '01:00 PM', dur: '2h', room: 'Machines Lab', teacher: 'Faculty EEE', type: 'lab' }
          ],
          fri: [
            { sub: 'Power System Protection & Switchgear', time: '09:00 AM', dur: '1h 30m', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' },
            { sub: 'High Voltage & Protection Lab', time: '11:00 AM', dur: '2h', room: 'Machines Lab', teacher: 'Faculty EEE', type: 'lab' },
            { sub: 'Electrical Network Synthesis Tutorial', time: '02:00 PM', dur: '1h', room: 'Room 108', teacher: 'Faculty EEE', type: 'tutorial' }
          ],
          sat: [
            { sub: 'EV Powertrain & Smart Energy Seminar', time: '10:00 AM', dur: '2h', room: 'Room 108', teacher: 'Faculty EEE', type: 'lecture' }
          ]
        };
      }

      if (dept === 'MECH') {
        return {
          mon: [
            { sub: 'Engineering Thermodynamics', time: '09:00 AM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' },
            { sub: 'Fluid Mechanics & Machinery Lab', time: '11:00 AM', dur: '2h', room: 'Mech Lab 1', teacher: 'Faculty MECH', type: 'lab' },
            { sub: 'Manufacturing Technology-I', time: '02:00 PM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' }
          ],
          tue: [
            { sub: 'Kinematics & Dynamics of Machinery', time: '09:00 AM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' },
            { sub: 'CAD/CAM SolidWorks Lab', time: '11:00 AM', dur: '2h', room: 'CAD Lab 2', teacher: 'Faculty MECH', type: 'lab' },
            { sub: 'Strength of Materials', time: '02:00 PM', dur: '1h 30m', room: 'Room 110', teacher: 'Dr. Anita Roy', type: 'lecture' }
          ],
          wed: [
            { sub: 'Heat & Mass Transfer', time: '09:00 AM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' },
            { sub: 'Thermal Engineering & IC Engines Lab', time: '11:00 AM', dur: '2h', room: 'Thermal Lab', teacher: 'Faculty MECH', type: 'lab' },
            { sub: 'Design of Machine Elements', time: '02:00 PM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' }
          ],
          thu: [
            { sub: 'Automobile Engineering', time: '10:00 AM', dur: '1h 30m', room: 'Room 110', teacher: 'Faculty MECH', type: 'lecture' },
            { sub: 'Manufacturing Technology Machine Shop', time: '01:00 PM', dur: '2h', room: 'Workshop B', teacher: 'Faculty MECH', type: 'lab' }
          ],
          fri: [
            { sub: 'Robotics & Industrial Automation', time: '09:00 AM', dur: '1h 30m', room: 'Room 110', teacher: 'Dr. Rajesh Kumar', type: 'lecture' },
            { sub: 'Finite Element Analysis (FEA) Lab', time: '11:00 AM', dur: '2h', room: 'CAD Lab 2', teacher: 'Faculty MECH', type: 'lab' },
            { sub: 'Mechanisms Analysis Tutorial', time: '02:00 PM', dur: '1h', room: 'Room 110', teacher: 'Faculty MECH', type: 'tutorial' }
          ],
          sat: [
            { sub: 'Additive Manufacturing & 3D Printing Expo', time: '10:00 AM', dur: '2h', room: 'Workshop B', teacher: 'Faculty MECH', type: 'lab' }
          ]
        };
      }

      // Default CIVIL
      return {
        mon: [
          { sub: 'Surveying & Geomatics', time: '09:00 AM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' },
          { sub: 'Surveying Field Practical Lab', time: '11:00 AM', dur: '2h', room: 'Survey Yard', teacher: 'Faculty CIVIL', type: 'lab' },
          { sub: 'Building Materials & Construction', time: '02:00 PM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' }
        ],
        tue: [
          { sub: 'Strength of Materials & Mechanics', time: '09:00 AM', dur: '1h 30m', room: 'Room 112', teacher: 'Dr. Anita Roy', type: 'lecture' },
          { sub: 'Material Testing Concrete Lab', time: '11:00 AM', dur: '2h', room: 'Concrete Lab', teacher: 'Faculty CIVIL', type: 'lab' },
          { sub: 'Fluid Mechanics in Channels', time: '02:00 PM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' }
        ],
        wed: [
          { sub: 'Structural Analysis-I', time: '09:00 AM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' },
          { sub: 'Hydraulics & Fluid Machinery Lab', time: '11:00 AM', dur: '2h', room: 'Hydraulics Lab', teacher: 'Faculty CIVIL', type: 'lab' },
          { sub: 'Geotechnical Engineering', time: '02:00 PM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' }
        ],
        thu: [
          { sub: 'Transportation & Highway Engg', time: '10:00 AM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' },
          { sub: 'AutoCAD Civil Drafting Lab', time: '01:00 PM', dur: '2h', room: 'CAD Lab 1', teacher: 'Faculty CIVIL', type: 'lab' }
        ],
        fri: [
          { sub: 'Environmental Engineering & Sanitation', time: '09:00 AM', dur: '1h 30m', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'lecture' },
          { sub: 'Soil Mechanics & Geotech Lab', time: '11:00 AM', dur: '2h', room: 'Soil Lab', teacher: 'Faculty CIVIL', type: 'lab' },
          { sub: 'Structural Steel Design Tutorial', time: '02:00 PM', dur: '1h', room: 'Room 112', teacher: 'Faculty CIVIL', type: 'tutorial' }
        ],
        sat: [
          { sub: 'Total Station & GIS Mapping Workshop', time: '10:00 AM', dur: '2h', room: 'Survey Yard', teacher: 'Faculty CIVIL', type: 'lab' }
        ]
      };
    };

    const pool = getSubjectPool();
    const result: WeeklySchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    const convertToSessions = (items: any[], dayName: string): ClassSession[] => {
      return items.map((item, idx) => ({
        id: `${dept}-${branch}-${yr}-${sem}-${sec}-${dayName}-${idx}`,
        subject: item.sub,
        time: item.time,
        duration: item.dur,
        room: item.room,
        teacher: item.teacher,
        students: sec === 'A' ? 45 : 40,
        type: item.type,
        department: dept,
        branch: branch,
        year: yr,
        semester: sem,
        section: sec,
        isAdjusted: idx === 1 && dayName === 'Monday' && sec === 'A',
        adjustmentType: 'substitute',
        originalTeacher: idx === 1 && dayName === 'Monday' ? 'Dr. Emily Davis' : undefined,
        adjustmentReason: idx === 1 && dayName === 'Monday' ? 'Peer substitution' : undefined
      }));
    };

    result.Monday = convertToSessions(pool.mon || [], 'Monday');
    result.Tuesday = convertToSessions(pool.tue || [], 'Tuesday');
    result.Wednesday = convertToSessions(pool.wed || [], 'Wednesday');
    result.Thursday = convertToSessions(pool.thu || [], 'Thursday');
    result.Friday = convertToSessions(pool.fri || [], 'Friday');
    result.Saturday = convertToSessions(pool.sat || [], 'Saturday');
    result.Sunday = []; // Sunday weekend

    return result;
  }, [selectedDepartment, selectedBranch, selectedYear, selectedSemester, selectedSection, hasBranch]);

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
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📊</span> Weekly Class Schedule Grid
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select Department, Academic Year, Semester, and Branch to view the scheduled university timetable.
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
              className="w-full px-3 py-2 text-xs font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                className="w-full px-3 py-2 text-xs font-bold border border-blue-300 bg-blue-50/30 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 text-xs font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Selection Display Banner */}
        <div className="bg-gray-50 border border-gray-200/80 p-3 rounded-xl mb-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-gray-700 font-medium">
            <strong>Current Timetable View:</strong>{' '}
            <span className="text-blue-700 font-bold">{selectedDepartment}</span>
            {hasBranch && <span> ({selectedBranch})</span>} •{' '}
            <span className="font-semibold">Year {selectedYear}</span> •{' '}
            <span className="font-semibold">{selectedSemester}</span> •{' '}
            <span className="font-semibold">Section {selectedSection}</span>
          </p>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {selectedDepartment}{hasBranch ? ` / ${selectedBranch}` : ''} • Year {selectedYear} • {selectedSemester}
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-xs text-gray-600 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Lecture</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Laboratory</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Tutorial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Substituted</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="grid grid-cols-8 gap-0">
          {/* Time Column Header */}
          <div className="bg-gray-50 p-4 border-r border-b font-bold text-gray-800 text-xs uppercase tracking-wider">
            Time Slot
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

          {/* Time Slots */}
          {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
            <React.Fragment key={time}>
              {/* Time Label */}
              <div className="bg-gray-50 p-3.5 border-r border-b text-xs font-bold text-gray-600 flex items-center">
                {time}
              </div>
              
              {/* Day Cells */}
              {dayNames.slice(0, 7).map((day) => {
                const daySchedule = weeklySchedule[day] || [];
                const classAtTime = daySchedule.find(cls => cls.time === time);

                return (
                  <div key={`${day}-${time}`} className="border-r border-b p-2 min-h-[85px] bg-white">
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
                              <span>👥 {classAtTime.students}</span>
                            </div>
                            
                            <div className="font-semibold text-gray-800 text-xs mt-1 pt-1 border-t border-gray-100 flex items-center gap-1">
                              <span>👨‍🏫</span>
                              <span className="truncate">{classAtTime.teacher}</span>
                            </div>
                          </div>
                        </div>

                        {classAtTime.isAdjusted && (
                          <div className="flex items-center gap-1 mt-2 pt-1 border-t border-gray-100">
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
            <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-1">Total Scheduled Classes</h4>
            <p className="text-2xl font-black text-blue-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.length, 0)}
            </p>
            <p className="text-xs text-blue-600/80 mt-0.5">Sessions across Monday - Saturday</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider mb-1">Laboratory Sessions</h4>
            <p className="text-2xl font-black text-emerald-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lab').length, 0)}
            </p>
            <p className="text-xs text-emerald-600/80 mt-0.5">Hands-on practical labs</p>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider mb-1">Lectures & Tutorials</h4>
            <p className="text-2xl font-black text-purple-700">
              {Object.values(weeklySchedule).reduce((acc, curr) => acc + curr.filter(c => c.type === 'lecture' || c.type === 'tutorial').length, 0)}
            </p>
            <p className="text-xs text-purple-600/80 mt-0.5">Theoretical & problem sessions</p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-xl">
            <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-1">Current Academic Year</h4>
            <p className="text-2xl font-black text-amber-700">Year {selectedYear}</p>
            <p className="text-xs text-amber-600/80 mt-0.5">{selectedSemester} Curriculum</p>
          </div>
        </div>
      </div>
    </div>
  );
};
