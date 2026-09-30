export interface ClassSession {
  id: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
  students: number;
  type: 'lecture' | 'lab' | 'tutorial';
  branch?: string;
  section?: string;
  isSubstitution?: boolean;
  substituteFor?: string;
  substituteReason?: string;
  isCovered?: boolean;
  coveredBy?: string;
  date?: string;
}

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
  }
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
 * Normalizes time string e.g. '09:00 AM' vs '9:00 AM'
 */
const normalizeTimeSlot = (timeStr: string = '') => {
  return timeStr.replace(/^0+/, '').replace(/\s+/g, ' ').toLowerCase().trim();
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
