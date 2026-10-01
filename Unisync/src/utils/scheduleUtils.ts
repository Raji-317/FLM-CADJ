export interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  students: number;
  type: 'lecture' | 'lab' | 'tutorial';
  teacher?: string;
  teacherEmail?: string;
  department?: string;
  branch?: string;
  section?: string;
  isSubstitution?: boolean;
  substituteFor?: string;
  substituteReason?: string;
  isCovered?: boolean;
  coveredBy?: string;
  date?: string;
}

export interface FacultyProfile {
  name: string;
  email: string;
  department: string;
  specialization: string;
  role: string;
}

export const FACULTY_DIRECTORY: Record<string, FacultyProfile> = {
  'teacher@edu.com': {
    name: 'Prof. Sarah Johnson',
    email: 'teacher@edu.com',
    department: 'Computer Science',
    specialization: 'Cloud Computing & Networks',
    role: 'Professor'
  },
  'harinadhv@edu.com': {
    name: 'Dr. V. Harinadh',
    email: 'harinadhv@edu.com',
    department: 'Computer Science',
    specialization: 'Algorithms & Data Structures',
    role: 'Associate Professor'
  },
  'pradeep@edu.com': {
    name: 'Prof. Pradeep Juluri',
    email: 'pradeep@edu.com',
    department: 'AI & ML',
    specialization: 'Artificial Intelligence & Machine Learning',
    role: 'Assistant Professor'
  },
  'krishnaa@edu.com': {
    name: 'Dr. A. Sri Krishna',
    email: 'krishnaa@edu.com',
    department: 'Computer Science',
    specialization: 'Database Systems & Big Data',
    role: 'Professor & HOD'
  },
  'ppravallikan@edu.com': {
    name: 'Prof. Pravallika Prathikonda',
    email: 'ppravallikan@edu.com',
    department: 'Computer Science',
    specialization: 'Software Engineering & Clean Architecture',
    role: 'Assistant Professor'
  },
  'sailakshmim@edu.com': {
    name: 'Dr. M. Sailakshmi',
    email: 'sailakshmim@edu.com',
    department: 'Mathematics',
    specialization: 'Applied Mathematics & Optimization',
    role: 'Associate Professor'
  },
  'rajeshk@edu.com': {
    name: 'Dr. Rajesh Kumar',
    email: 'rajeshk@edu.com',
    department: 'Electronics & Communication',
    specialization: 'VLSI Design & Embedded Systems',
    role: 'Professor'
  }
};

type WeekdayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

const TEACHER_TIMETABLES: { [email: string]: { [day in WeekdayName]?: ClassSession[] } } = {
  'teacher@edu.com': {
    Monday: [
      { id: 't-mon-1', subject: 'Computer Networks & Security', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 't-mon-2', subject: 'Web Technologies Lab', time: '11:00 AM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 't-mon-3', subject: 'Cloud Computing Architecture', time: '02:00 PM', duration: '1h 30m', room: 'Room 105', students: 40, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 't-mon-4', subject: 'Advanced Programming Tutorial', time: '04:00 PM', duration: '1h', room: 'Room 201', students: 25, type: 'tutorial', branch: 'CSE', section: 'A' }
    ],
    Tuesday: [
      { id: 't-tue-1', subject: 'Distributed Systems Architecture', time: '09:30 AM', duration: '1h 30m', room: 'Room 205', students: 42, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 't-tue-2', subject: 'Network Security & Cryptography', time: '11:30 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 't-tue-3', subject: 'Cloud Computing Hands-on Lab', time: '02:00 PM', duration: '2h', room: 'Lab 301', students: 32, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Wednesday: [
      { id: 't-wed-1', subject: 'Computer Networks (Batch B)', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 40, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 't-wed-2', subject: 'Web App Development Lab', time: '11:00 AM', duration: '2h', room: 'Lab 302', students: 28, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 't-wed-3', subject: 'Internet Protocols & Standards', time: '02:00 PM', duration: '1h 30m', room: 'Room 108', students: 38, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 't-wed-4', subject: 'Network Simulation Tutorial', time: '03:45 PM', duration: '1h', room: 'Room 201', students: 22, type: 'tutorial', branch: 'CSE', section: 'B' }
    ],
    Thursday: [
      { id: 't-thu-1', subject: 'Cloud Infrastructure & DevOps', time: '10:00 AM', duration: '1h 30m', room: 'Room 105', students: 44, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 't-thu-2', subject: 'Web Fullstack Engineering Lab', time: '01:00 PM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'B' },
      { id: 't-thu-3', subject: 'Emerging Web Standards Seminar', time: '03:30 PM', duration: '1h 30m', room: 'Room 204', students: 35, type: 'lecture', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 't-fri-1', subject: 'Cyber Defense & Network Security', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 't-fri-2', subject: 'Cloud Systems Capstone Mentoring', time: '11:00 AM', duration: '1h 30m', room: 'Room 105', students: 25, type: 'tutorial', branch: 'CSE', section: 'A' },
      { id: 't-fri-3', subject: 'Systems Integration Lab', time: '02:00 PM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Saturday: [
      { id: 't-sat-1', subject: 'Industry Case Studies & Tech Talk', time: '10:00 AM', duration: '2h', room: 'Auditorium', students: 60, type: 'lecture', branch: 'CSE', section: 'All' },
      { id: 't-sat-2', subject: 'Capstone Project Evaluation & Lab', time: '01:00 PM', duration: '2h', room: 'Lab 301', students: 28, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Sunday: []
  },

  'harinadhv@edu.com': {
    Monday: [
      { id: 'h-mon-1', subject: 'Data Structures & Algorithms', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'h-mon-2', subject: 'Analysis of Algorithms Lab', time: '11:00 AM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 'h-mon-3', subject: 'Advanced Data Structures', time: '02:00 PM', duration: '1h 30m', room: 'Room 105', students: 40, type: 'lecture', branch: 'CSE', section: 'B' }
    ],
    Tuesday: [
      { id: 'h-tue-1', subject: 'Graph Algorithms & Trees', time: '10:00 AM', duration: '1h 30m', room: 'Room 202', students: 42, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'h-tue-2', subject: 'Competitive Programming Lab', time: '01:30 PM', duration: '2h', room: 'Lab 303', students: 32, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Wednesday: [
      { id: 'h-wed-1', subject: 'Algorithm Complexity Analysis', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'h-wed-2', subject: 'Data Structures Lab (Batch B)', time: '11:30 AM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'B' },
      { id: 'h-wed-3', subject: 'Algorithmic Problem Solving', time: '03:00 PM', duration: '1h', room: 'Room 205', students: 25, type: 'tutorial', branch: 'CSE', section: 'A' }
    ],
    Thursday: [
      { id: 'h-thu-1', subject: 'Advanced Data Structures', time: '10:00 AM', duration: '1h 30m', room: 'Room 105', students: 40, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'h-thu-2', subject: 'Dynamic Programming Masterclass', time: '02:00 PM', duration: '2h', room: 'Room 204', students: 38, type: 'lecture', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 'h-fri-1', subject: 'Design & Analysis of Algorithms', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'h-fri-2', subject: 'Algorithms Lab Examination Prep', time: '11:00 AM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Saturday: [
      { id: 'h-sat-1', subject: 'Coding Olympiad & Hackathon Coaching', time: '10:00 AM', duration: '2h', room: 'Lab 303', students: 35, type: 'lab', branch: 'CSE', section: 'All' }
    ],
    Sunday: []
  },

  'pradeep@edu.com': {
    Monday: [
      { id: 'p-mon-1', subject: 'Machine Learning Fundamentals', time: '10:00 AM', duration: '1h 30m', room: 'Room 301', students: 35, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'p-mon-2', subject: 'Artificial Intelligence Lab', time: '01:00 PM', duration: '2h', room: 'Lab 302', students: 28, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 'p-mon-3', subject: 'Neural Networks Seminar', time: '04:00 PM', duration: '1h', room: 'Room 201', students: 25, type: 'tutorial', branch: 'CSE', section: 'B' }
    ],
    Tuesday: [
      { id: 'p-tue-1', subject: 'Deep Learning & Computer Vision', time: '09:00 AM', duration: '1h 30m', room: 'Room 301', students: 36, type: 'lecture', branch: 'AI & ML', section: 'A' },
      { id: 'p-tue-2', subject: 'PyTorch & TensorFlow Lab', time: '11:30 AM', duration: '2h', room: 'Lab 302', students: 30, type: 'lab', branch: 'AI & ML', section: 'A' }
    ],
    Wednesday: [
      { id: 'p-wed-1', subject: 'Natural Language Processing', time: '10:00 AM', duration: '1h 30m', room: 'Room 301', students: 34, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'p-wed-2', subject: 'AI Models Deployment Lab', time: '02:00 PM', duration: '2h', room: 'Lab 302', students: 28, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Thursday: [
      { id: 'p-thu-1', subject: 'Reinforcement Learning', time: '09:30 AM', duration: '1h 30m', room: 'Room 301', students: 32, type: 'lecture', branch: 'AI & ML', section: 'A' },
      { id: 'p-thu-2', subject: 'Ethics in AI & Research Forum', time: '02:00 PM', duration: '1h 30m', room: 'Room 201', students: 40, type: 'lecture', branch: 'CSE', section: 'All' }
    ],
    Friday: [
      { id: 'p-fri-1', subject: 'Machine Learning Advanced Applications', time: '10:00 AM', duration: '1h 30m', room: 'Room 301', students: 35, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'p-fri-2', subject: 'Applied AI Projects Showcase', time: '01:30 PM', duration: '2h', room: 'Lab 302', students: 30, type: 'lab', branch: 'AI & ML', section: 'A' }
    ],
    Saturday: [
      { id: 'p-sat-1', subject: 'Data Science & Generative AI Workshop', time: '10:00 AM', duration: '2h', room: 'Lab 302', students: 40, type: 'lab', branch: 'AI & ML', section: 'All' }
    ],
    Sunday: []
  },

  'krishnaa@edu.com': {
    Monday: [
      { id: 'k-mon-1', subject: 'Database Management Systems', time: '09:00 AM', duration: '1h 30m', room: 'Room 102', students: 50, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'k-mon-2', subject: 'SQL Programming Lab', time: '11:00 AM', duration: '2h', room: 'Lab 303', students: 32, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Tuesday: [
      { id: 'k-tue-1', subject: 'Distributed Databases', time: '10:00 AM', duration: '1h 30m', room: 'Room 102', students: 44, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'k-tue-2', subject: 'NoSQL & MongoDB Lab', time: '01:30 PM', duration: '2h', room: 'Lab 303', students: 30, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Wednesday: [
      { id: 'k-wed-1', subject: 'Relational Database Design', time: '09:00 AM', duration: '1h 30m', room: 'Room 102', students: 50, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'k-wed-2', subject: 'Database Indexing & Optimization', time: '02:00 PM', duration: '1h 30m', room: 'Room 102', students: 40, type: 'lecture', branch: 'CSE', section: 'B' }
    ],
    Thursday: [
      { id: 'k-thu-1', subject: 'Big Data Storage Systems', time: '11:00 AM', duration: '1h 30m', room: 'Room 102', students: 46, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'k-thu-2', subject: 'Data Warehousing Lab', time: '02:00 PM', duration: '2h', room: 'Lab 303', students: 28, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 'k-fri-1', subject: 'Transaction Processing & Concurrency', time: '09:30 AM', duration: '1h 30m', room: 'Room 102', students: 48, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'k-fri-2', subject: 'SQL Query Optimization Tutorial', time: '01:30 PM', duration: '1h', room: 'Room 201', students: 25, type: 'tutorial', branch: 'CSE', section: 'B' }
    ],
    Saturday: [
      { id: 'k-sat-1', subject: 'Database Administration (DBA) Hands-on', time: '10:00 AM', duration: '2h', room: 'Lab 303', students: 30, type: 'lab', branch: 'CSE', section: 'All' }
    ],
    Sunday: []
  },

  'ppravallikan@edu.com': {
    Monday: [
      { id: 'v-mon-1', subject: 'Software Engineering & Design', time: '09:00 AM', duration: '1h 30m', room: 'Room 201', students: 38, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'v-mon-2', subject: 'Web Application Development', time: '11:00 AM', duration: '2h', room: 'Lab 302', students: 25, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Tuesday: [
      { id: 'v-tue-1', subject: 'Agile & DevOps Practices', time: '10:00 AM', duration: '1h 30m', room: 'Room 201', students: 40, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'v-tue-2', subject: 'Software Testing & Automation Lab', time: '01:30 PM', duration: '2h', room: 'Lab 302', students: 26, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Wednesday: [
      { id: 'v-wed-1', subject: 'Object-Oriented Software Design', time: '09:00 AM', duration: '1h 30m', room: 'Room 201', students: 38, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'v-wed-2', subject: 'UML & System Architecture Lab', time: '02:00 PM', duration: '2h', room: 'Lab 302', students: 25, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Thursday: [
      { id: 'v-thu-1', subject: 'Design Patterns & Clean Code', time: '11:00 AM', duration: '1h 30m', room: 'Room 201', students: 36, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'v-thu-2', subject: 'Software Quality Assurance Tutorial', time: '03:00 PM', duration: '1h', room: 'Room 206', students: 20, type: 'tutorial', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 'v-fri-1', subject: 'Software Project Management', time: '09:30 AM', duration: '1h 30m', room: 'Room 201', students: 40, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'v-fri-2', subject: 'Sprint Review & Demo Lab', time: '01:30 PM', duration: '2h', room: 'Lab 302', students: 30, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Saturday: [
      { id: 'v-sat-1', subject: 'Full Stack Project Mentoring', time: '10:00 AM', duration: '2h', room: 'Lab 302', students: 25, type: 'lab', branch: 'CSE', section: 'All' }
    ],
    Sunday: []
  },

  'sailakshmim@edu.com': {
    Monday: [
      { id: 'm-mon-1', subject: 'Applied Mathematics II', time: '10:00 AM', duration: '1h 30m', room: 'Room 401', students: 55, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'm-mon-2', subject: 'Numerical Methods Lab', time: '02:00 PM', duration: '2h', room: 'Lab 102', students: 30, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Tuesday: [
      { id: 'm-tue-1', subject: 'Discrete Mathematics', time: '09:00 AM', duration: '1h 30m', room: 'Room 401', students: 52, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'm-tue-2', subject: 'Graph Theory & Combinatorics', time: '11:30 AM', duration: '1h 30m', room: 'Room 401', students: 48, type: 'lecture', branch: 'CSE', section: 'A' }
    ],
    Wednesday: [
      { id: 'm-wed-1', subject: 'Linear Algebra for Engineers', time: '10:00 AM', duration: '1h 30m', room: 'Room 401', students: 50, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'm-wed-2', subject: 'Matrix Computation Lab', time: '01:30 PM', duration: '2h', room: 'Lab 102', students: 28, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Thursday: [
      { id: 'm-thu-1', subject: 'Probability & Random Processes', time: '09:00 AM', duration: '1h 30m', room: 'Room 401', students: 55, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'm-thu-2', subject: 'Statistical Computing Tutorial', time: '02:00 PM', duration: '1h', room: 'Room 402', students: 24, type: 'tutorial', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 'm-fri-1', subject: 'Optimization Techniques', time: '10:00 AM', duration: '1h 30m', room: 'Room 401', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'm-fri-2', subject: 'Applied Mathematics Doubt Clearing', time: '02:00 PM', duration: '1h 30m', room: 'Room 401', students: 30, type: 'tutorial', branch: 'CSE', section: 'All' }
    ],
    Saturday: [
      { id: 'm-sat-1', subject: 'Math Olympiad Problem Session', time: '10:00 AM', duration: '2h', room: 'Room 401', students: 25, type: 'tutorial', branch: 'CSE', section: 'All' }
    ],
    Sunday: []
  },

  'rajeshk@edu.com': {
    Monday: [
      { id: 'r-mon-1', subject: 'Digital Electronics & Logic Design', time: '09:00 AM', duration: '1h 30m', room: 'Room 106', students: 48, type: 'lecture', branch: 'ECE', section: 'A' },
      { id: 'r-mon-2', subject: 'Microprocessors & Microcontrollers Lab', time: '11:00 AM', duration: '2h', room: 'Lab 201', students: 30, type: 'lab', branch: 'ECE', section: 'A' }
    ],
    Tuesday: [
      { id: 'r-tue-1', subject: 'Signals & Linear Systems', time: '10:00 AM', duration: '1h 30m', room: 'Room 106', students: 45, type: 'lecture', branch: 'ECE', section: 'B' },
      { id: 'r-tue-2', subject: 'Embedded Systems Programming Lab', time: '01:30 PM', duration: '2h', room: 'Lab 201', students: 28, type: 'lab', branch: 'ECE', section: 'B' }
    ],
    Wednesday: [
      { id: 'r-wed-1', subject: 'VLSI Architecture & CMOS Circuits', time: '09:00 AM', duration: '1h 30m', room: 'Room 106', students: 42, type: 'lecture', branch: 'ECE', section: 'A' },
      { id: 'r-wed-2', subject: 'Communication Engineering Lab', time: '11:30 AM', duration: '2h', room: 'Lab 202', students: 30, type: 'lab', branch: 'ECE', section: 'A' }
    ],
    Thursday: [
      { id: 'r-thu-1', subject: 'Wireless Sensor Networks & IoT', time: '10:00 AM', duration: '1h 30m', room: 'Room 106', students: 44, type: 'lecture', branch: 'ECE', section: 'B' },
      { id: 'r-thu-2', subject: 'FPGA & Verilog Hardware Lab', time: '02:00 PM', duration: '2h', room: 'Lab 201', students: 26, type: 'lab', branch: 'ECE', section: 'B' }
    ],
    Friday: [
      { id: 'r-fri-1', subject: 'IoT Sensors & Embedded Actuators', time: '09:00 AM', duration: '1h 30m', room: 'Room 106', students: 46, type: 'lecture', branch: 'ECE', section: 'A' },
      { id: 'r-fri-2', subject: 'Embedded Systems Capstone Review', time: '01:30 PM', duration: '2h', room: 'Lab 201', students: 25, type: 'lab', branch: 'ECE', section: 'A' }
    ],
    Saturday: [
      { id: 'r-sat-1', subject: 'Robotics & Hardware Automation Workshop', time: '10:00 AM', duration: '2h', room: 'Lab 201', students: 35, type: 'lab', branch: 'ECE', section: 'All' }
    ],
    Sunday: []
  }
};

/**
 * Normalizes time string e.g. '09:00 AM' vs '9:00 AM'
 */
const normalizeTimeSlot = (timeStr: string = '') => {
  return timeStr.replace(/^0+/, '').replace(/\s+/g, ' ').toLowerCase().trim();
};

/**
 * Converts time slot (e.g. '09:00 AM', '01:30 PM') to total minutes for proper chronological sorting
 */
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

const matchesDepartment = (profileDept: string = '', targetDept: string = ''): boolean => {
  if (targetDept === 'All') return true;
  const p = profileDept.toLowerCase();
  const t = targetDept.toLowerCase();
  if (p === t) return true;
  if (t === 'cse' && (p.includes('computer') || p.includes('cse'))) return true;
  if (t === 'ai' && (p.includes('ai') || p.includes('intelligence') || p.includes('aiml') || p.includes('aids'))) return true;
  if (t === 'it' && (p.includes('information') || p === 'it')) return true;
  if (t === 'ece' && (p.includes('electronics') || p === 'ece')) return true;
  if (t === 'eee' && (p.includes('electrical') || p === 'eee')) return true;
  if (t === 'mech' && (p.includes('mechanical') || p === 'mech')) return true;
  if (t === 'civil' && (p.includes('civil') || p === 'ce')) return true;
  return false;
};

const matchesBranch = (sessionBranch: string = '', targetBranch: string = ''): boolean => {
  if (targetBranch === 'All' || !targetBranch) return true;
  const s = sessionBranch.toLowerCase();
  const t = targetBranch.toLowerCase();
  if (s === t) return true;
  if (t === 'cse' && (s === 'cse' || s === 'all')) return true;
  if (t === 'cyber security' && s.includes('cyber')) return true;
  if (t === 'aiml' && (s.includes('aiml') || s.includes('ai & ml') || s === 'ai')) return true;
  if (t === 'aids' && (s.includes('aids') || s.includes('data science') || s.includes('ds'))) return true;
  return false;
};

/**
 * Returns all college sessions scheduled for a given calendar date,
 * dynamically changing day-to-day (Monday through Saturday, with Sunday as weekend).
 * Includes faculty details, department, room, and live substitute coverage annotations.
 */
export const getAllCollegeClassesForDate = (
  date: Date,
  options?: {
    department?: string;
    branch?: string;
    teacherEmail?: string;
    substituteLeaves?: any[];
  }
): ClassSession[] => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }) as WeekdayName;
  if (dayName === 'Sunday') {
    return [];
  }

  const result: ClassSession[] = [];
  const targetTeacher = (options?.teacherEmail || 'All').toLowerCase().trim();
  const targetDept = options?.department || 'All';
  const targetBranch = options?.branch || 'All';
  const substituteLeaves = options?.substituteLeaves || [];

  for (const [email, profile] of Object.entries(FACULTY_DIRECTORY)) {
    const lowerEmail = email.toLowerCase().trim();

    // Check teacher email filter
    if (targetTeacher !== 'all' && targetTeacher !== lowerEmail) {
      continue;
    }

    // Check department filter
    if (!matchesDepartment(profile.department, targetDept)) {
      continue;
    }

    const teacherTimetable = TEACHER_TIMETABLES[lowerEmail];
    if (!teacherTimetable) continue;

    const dayClasses = teacherTimetable[dayName] || [];

    for (const session of dayClasses) {
      // Check branch filter
      if (session.branch && !matchesBranch(session.branch, targetBranch)) {
        continue;
      }

      let isCovered = false;
      let coveredBy = '';

      // Check if this class is covered by an accepted peer substitute on this date
      if (Array.isArray(substituteLeaves)) {
        for (const leave of substituteLeaves) {
          if (leave.teacherEmail && leave.teacherEmail.toLowerCase().trim() === lowerEmail) {
            if (Array.isArray(leave.affectedClasses)) {
              for (const cls of leave.affectedClasses) {
                const isMatchDate = isSameCalendarDate(cls.date || leave.startDate, date);
                const isTimeMatch = normalizeTimeSlot(cls.time) === normalizeTimeSlot(session.time);
                const isAccepted = cls.substituteStatus === 'accepted';

                if (isMatchDate && (session.id === cls.classId || isTimeMatch) && isAccepted && cls.substituteTeacher) {
                  isCovered = true;
                  coveredBy = cls.substituteTeacher;
                }
              }
            }
          }
        }
      }

      result.push({
        ...session,
        id: session.id || `${lowerEmail}-${dayName}-${session.time}`,
        teacher: profile.name,
        teacherEmail: email,
        department: profile.department,
        date: date.toISOString().split('T')[0],
        isCovered,
        coveredBy
      });
    }
  }

  // Also include any accepted substitute coverage where another teacher is filling in
  if (Array.isArray(substituteLeaves)) {
    for (const leave of substituteLeaves) {
      if (Array.isArray(leave.affectedClasses)) {
        for (const cls of leave.affectedClasses) {
          const isMatchDate = isSameCalendarDate(cls.date || leave.startDate, date);
          const isAccepted = cls.substituteStatus === 'accepted';

          if (isMatchDate && isAccepted) {
            const subTeacherEmail = (cls.substituteTeacher || '').toLowerCase().trim();
            const subProfile = FACULTY_DIRECTORY[subTeacherEmail] || {
              name: cls.substituteTeacher || 'Faculty Member',
              email: subTeacherEmail,
              department: 'General',
              specialization: 'Faculty Cover',
              role: 'Teacher'
            };

            if (targetTeacher !== 'all' && targetTeacher !== subTeacherEmail) {
              continue;
            }
            if (targetDept !== 'All' && subProfile.department !== targetDept) {
              continue;
            }
            if (targetBranch !== 'All' && cls.branch && cls.branch !== targetBranch) {
              continue;
            }

            const alreadyExists = result.some(r => 
              r.isSubstitution && 
              r.teacherEmail?.toLowerCase() === subTeacherEmail && 
              normalizeTimeSlot(r.time) === normalizeTimeSlot(cls.time)
            );

            if (!alreadyExists) {
              result.push({
                id: cls.classId || cls._id || `sub-${Math.random()}`,
                subject: cls.subject || 'Cover Class',
                time: cls.time || '10:00 AM',
                duration: cls.duration || '1h 30m',
                room: cls.room || 'Assigned Room',
                students: cls.students || 35,
                type: cls.type || 'lecture',
                branch: cls.branch || 'CSE',
                section: cls.section || 'A',
                teacher: subProfile.name,
                teacherEmail: cls.substituteTeacher,
                department: subProfile.department,
                isSubstitution: true,
                substituteFor: leave.teacherEmail,
                substituteReason: leave.reason,
                date: date.toISOString().split('T')[0]
              });
            }
          }
        }
      }
    }
  }

  return result.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
};

/**
 * Returns the class schedule for a specific teacher on a specific date (day of week)
 */
export const getScheduleForDate = (email: string, date: Date): ClassSession[] => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }) as WeekdayName;
  const lowerEmail = email ? email.toLowerCase().trim() : '';

  // Specific defined faculty timetable
  if (TEACHER_TIMETABLES[lowerEmail]) {
    const dayClasses = TEACHER_TIMETABLES[lowerEmail][dayName];
    return dayClasses ? [...dayClasses] : [];
  }

  // Generic dynamic daily schedule for newly registered or other faculty
  const defaultWeekly: { [day in WeekdayName]?: ClassSession[] } = {
    Monday: [
      { id: 'gen-mon-1', subject: 'Computer Science Core Lecture', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'gen-mon-2', subject: 'Practical Laboratory Session I', time: '11:00 AM', duration: '2h', room: 'Lab 301', students: 30, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 'gen-mon-3', subject: 'Software Systems Architecture', time: '02:00 PM', duration: '1h 30m', room: 'Room 105', students: 40, type: 'lecture', branch: 'CSE', section: 'B' }
    ],
    Tuesday: [
      { id: 'gen-tue-1', subject: 'Programming Paradigms Lecture', time: '10:00 AM', duration: '1h 30m', room: 'Room 202', students: 42, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'gen-tue-2', subject: 'Advanced Coding Laboratory', time: '01:30 PM', duration: '2h', room: 'Lab 302', students: 30, type: 'lab', branch: 'CSE', section: 'A' },
      { id: 'gen-tue-3', subject: 'Department Colloquium', time: '04:00 PM', duration: '1h', room: 'Room 201', students: 25, type: 'tutorial', branch: 'CSE', section: 'All' }
    ],
    Wednesday: [
      { id: 'gen-wed-1', subject: 'Computer Architecture & Org', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 40, type: 'lecture', branch: 'CSE', section: 'B' },
      { id: 'gen-wed-2', subject: 'Hardware & OS Laboratory', time: '11:30 AM', duration: '2h', room: 'Lab 303', students: 28, type: 'lab', branch: 'CSE', section: 'B' }
    ],
    Thursday: [
      { id: 'gen-thu-1', subject: 'Web & Distributed Systems', time: '10:00 AM', duration: '1h 30m', room: 'Room 105', students: 44, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'gen-thu-2', subject: 'Applied Development Workshop', time: '01:00 PM', duration: '2h', room: 'Lab 301', students: 32, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Friday: [
      { id: 'gen-fri-1', subject: 'Information Systems Seminar', time: '09:00 AM', duration: '1h 30m', room: 'Room 204', students: 45, type: 'lecture', branch: 'CSE', section: 'A' },
      { id: 'gen-fri-2', subject: 'Research & Project Lab', time: '11:00 AM', duration: '2h', room: 'Lab 301', students: 28, type: 'lab', branch: 'CSE', section: 'A' }
    ],
    Saturday: [
      { id: 'gen-sat-1', subject: 'Student Mentorship & Project Review', time: '10:00 AM', duration: '2h', room: 'Room 201', students: 25, type: 'tutorial', branch: 'CSE', section: 'All' }
    ],
    Sunday: []
  };

  const genericDayClasses = defaultWeekly[dayName];
  return genericDayClasses ? [...genericDayClasses] : [];
};

/**
 * Safely parses year, month, and day ignoring any time-of-day / timezone offsets
 */
export const parseYearMonthDay = (val: string | Date | undefined): { y: number; m: number; d: number } | null => {
  if (!val) return null;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return { y: val.getFullYear(), m: val.getMonth(), d: val.getDate() };
  }
  const str = String(val).trim();
  // Handle ISO YYYY-MM-DD...
  const ymdMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    return {
      y: parseInt(ymdMatch[1], 10),
      m: parseInt(ymdMatch[2], 10) - 1,
      d: parseInt(ymdMatch[3], 10)
    };
  }
  // Handle DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (dmyMatch) {
    return {
      y: parseInt(dmyMatch[3], 10),
      m: parseInt(dmyMatch[2], 10) - 1,
      d: parseInt(dmyMatch[1], 10)
    };
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
};

/**
 * Helper to check if a date string/Date matches a calendar Date (year, month, day)
 */
export const isSameCalendarDate = (date1: string | Date | undefined, date2: string | Date | undefined): boolean => {
  if (!date1 || !date2) return false;
  const p1 = parseYearMonthDay(date1);
  const p2 = parseYearMonthDay(date2);
  if (!p1 || !p2) return false;
  return p1.y === p2.y && p1.m === p2.m && p1.d === p2.d;
};

/**
 * Returns user regular schedule plus any accepted substitute coverages for a given date.
 * Also marks regular classes that have been covered by someone else.
 */
export const getScheduleWithSubstitutions = (
  userEmail: string,
  date: Date,
  substituteLeaves: any[] = []
): ClassSession[] => {
  const regularClasses = getScheduleForDate(userEmail, date);
  const lowerEmail = (userEmail || '').toLowerCase().trim();

  // 1. Check if the user is covering any class on this day (as substitute)
  const subClasses: ClassSession[] = [];
  if (Array.isArray(substituteLeaves)) {
    substituteLeaves.forEach(leave => {
      if (Array.isArray(leave.affectedClasses)) {
        leave.affectedClasses.forEach((cls: any) => {
          const isCoverForUser = cls.substituteTeacher && cls.substituteTeacher.toLowerCase().trim() === lowerEmail;
          const isAccepted = cls.substituteStatus === 'accepted';
          const isMatchDate = isSameCalendarDate(cls.date || leave.startDate, date);

          if (isCoverForUser && isAccepted && isMatchDate) {
            subClasses.push({
              id: cls.classId || cls._id || `sub-${Math.random()}`,
              subject: cls.subject || 'Substitute Class',
              time: cls.time || '10:00 AM',
              duration: cls.duration || '1h 30m',
              room: cls.room || 'Assigned Room',
              students: cls.students || 35,
              type: cls.type || 'lecture',
              branch: cls.branch,
              section: cls.section,
              isSubstitution: true,
              substituteFor: leave.teacherEmail || 'Faculty Member',
              substituteReason: leave.reason
            });
          }
        });
      }
    });
  }

  // 2. Check if any of the user's OWN classes have been accepted for coverage by another substitute
  const annotatedRegular = regularClasses.map(rc => {
    let isCovered = false;
    let coveredBy = '';

    if (Array.isArray(substituteLeaves)) {
      substituteLeaves.forEach(leave => {
        if (leave.teacherEmail && leave.teacherEmail.toLowerCase().trim() === lowerEmail) {
          if (Array.isArray(leave.affectedClasses)) {
            leave.affectedClasses.forEach((cls: any) => {
              const isMatchDate = isSameCalendarDate(cls.date || leave.startDate, date);
              const isTimeMatch = normalizeTimeSlot(cls.time) === normalizeTimeSlot(rc.time);
              const isAccepted = cls.substituteStatus === 'accepted';

              if (isMatchDate && (rc.id === cls.classId || isTimeMatch) && isAccepted && cls.substituteTeacher) {
                isCovered = true;
                coveredBy = cls.substituteTeacher;
              }
            });
          }
        }
      });
    }

    return {
      ...rc,
      isCovered,
      coveredBy
    };
  });

  return [...annotatedRegular, ...subClasses];
};

/**
 * Finds teachers who are available for a given time slot (free/leisure period)
 */
export const getAvailableTeachersForSlot = (
  teachers: any[],
  classDate: string | Date,
  classTime: string,
  teacherEmail: string,
  _duration?: string,
  allLeaves?: any[]
): any[] => {
  if (!Array.isArray(teachers)) return [];
  const dateObj = new Date(classDate);
  const targetEmail = (teacherEmail || '').toLowerCase().trim();
  const normalizedClassTime = normalizeTimeSlot(classTime);

  return teachers.filter((t: any) => {
    const tEmail = (t.email || '').toLowerCase().trim();
    if (!tEmail || tEmail === targetEmail) return false;
    if (t.status === 'on_leave') return false;

    // Check teacher's normal schedule for that day
    const schedule = getScheduleForDate(t.email, dateObj);
    const hasTimetableConflict = schedule.some(session => 
      normalizeTimeSlot(session.time) === normalizedClassTime
    );
    if (hasTimetableConflict) return false;

    // Check if teacher is already covering another class at that slot
    if (Array.isArray(allLeaves)) {
      const hasCoverageConflict = allLeaves.some(l => 
        Array.isArray(l.affectedClasses) && l.affectedClasses.some((c: any) =>
          c.substituteTeacher &&
          c.substituteTeacher.toLowerCase().trim() === tEmail &&
          (c.substituteStatus === 'accepted' || c.substituteStatus === 'assigned') &&
          isSameCalendarDate(c.date || l.startDate, classDate) &&
          normalizeTimeSlot(c.time) === normalizedClassTime
        )
      );
      if (hasCoverageConflict) return false;
    }

    return true;
  });
};

/**
 * Returns teacher's subject / specialization for display
 */
export const getTeacherSubject = (teacher: any): string => {
  if (!teacher) return 'Faculty';
  return teacher.specialization || teacher.subject || teacher.department || 'Faculty';
};
