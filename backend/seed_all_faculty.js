const mongoose = require('mongoose');
const User = require('./models/User');

const ALL_TIMETABLE_FACULTY = [
  // 1. teacher@edu.com (Official timetable faculty: Prof. S. Rajeshwari)
  {
    name: 'Prof. S. Rajeshwari',
    email: 'teacher@edu.com',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Cloud Computing & Networks',
    role: 'teacher',
    employeeId: 'CS100',
    classesAssigned: 17,
    phone: '+91 9876543210'
  },
  // 2. harinadhv@edu.com
  {
    name: 'Dr. V. Harinadh',
    email: 'harinadhv@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Algorithms & Data Structures',
    role: 'teacher',
    employeeId: 'CS001',
    classesAssigned: 12,
    phone: '+91 7536878686'
  },
  // 3. pradeep@edu.com
  {
    name: 'Prof. Pradeep Juluri',
    email: 'pradeep@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Artificial Intelligence & Machine Learning',
    role: 'teacher',
    employeeId: 'CS002',
    classesAssigned: 11,
    phone: '+91 9863427087'
  },
  // 4. krishnaa@edu.com
  {
    name: 'Dr. A. Sri Krishna',
    email: 'krishnaa@edu.com',
    department: 'Computer Science',
    designation: 'Professor & HOD',
    specialization: 'Database Systems & Big Data',
    role: 'teacher',
    employeeId: 'CS003',
    classesAssigned: 11,
    phone: '+91 9988776655'
  },
  // 5. ppravallikan@edu.com
  {
    name: 'Prof. Pravallika Prathikonda',
    email: 'ppravallikan@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Software Engineering & Clean Architecture',
    role: 'teacher',
    employeeId: 'CS004',
    classesAssigned: 11,
    phone: '+91 9900990099'
  },
  // 6. sailakshmim@edu.com
  {
    name: 'Dr. M. Sailakshmi',
    email: 'sailakshmim@edu.com',
    department: 'Mathematics',
    designation: 'Associate Professor',
    specialization: 'Applied Mathematics & Optimization',
    role: 'teacher',
    employeeId: 'MATH001',
    classesAssigned: 11,
    phone: '+91 9808269021'
  },
  // 7. rajeshk@edu.com
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajeshk@edu.com',
    department: 'Electronics & Communication',
    designation: 'Professor',
    specialization: 'VLSI Design & Embedded Systems',
    role: 'teacher',
    employeeId: 'EC001',
    classesAssigned: 11,
    phone: '+91 9848123401'
  },
  // 8. swethak@edu.com
  {
    name: 'Mrs. K. Swetha',
    email: 'swethak@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'CSE(AI&DS) - Class Incharge',
    role: 'teacher',
    employeeId: 'AI001',
    classesAssigned: 10,
    phone: '+91 9848123402'
  },
  // 9. charani@edu.com
  {
    name: 'Dr. P. Sri Charani',
    email: 'charani@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Associate Professor',
    specialization: 'Artificial Intelligence & AI Lab',
    role: 'teacher',
    employeeId: 'AI002',
    classesAssigned: 12,
    phone: '+91 9848123403'
  },
  // 10. bhargavi@edu.com
  {
    name: 'Mrs. M. Bhargavi',
    email: 'bhargavi@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Computer Networks & CN Lab',
    role: 'teacher',
    employeeId: 'AI003',
    classesAssigned: 11,
    phone: '+91 9848123404'
  },
  // 11. srikanthk@edu.com
  {
    name: 'Mr. K. Srikanth',
    email: 'srikanthk@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Computer Organization and Architecture (COA)',
    role: 'teacher',
    employeeId: 'AI004',
    classesAssigned: 11,
    phone: '+91 9848123405'
  },
  // 12. praveenkumar@edu.com
  {
    name: 'Mr. MP. Praveen Kumar',
    email: 'praveenkumar@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Exploratory Data Analysis using Python (EDA)',
    role: 'teacher',
    employeeId: 'AI005',
    classesAssigned: 12,
    phone: '+91 9848123406'
  },
  // 13. towqeer@edu.com
  {
    name: 'Mr. Mohammad Towqeer UL Haq',
    email: 'towqeer@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Full Stack Development-2 (FSD-2)',
    role: 'teacher',
    employeeId: 'AI006',
    classesAssigned: 10,
    phone: '+91 9848123407'
  },
  // 14. rajasekhar@edu.com
  {
    name: 'Mr. K. Rajasekhar',
    email: 'rajasekhar@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'User Interface Design using Flutter (UID)',
    role: 'teacher',
    employeeId: 'AI007',
    classesAssigned: 6,
    phone: '+91 9848123408'
  },
  // 15. kalyansagar@edu.com
  {
    name: 'Mr. K. Kalyan Sagar',
    email: 'kalyansagar@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Renewable Energy Sources (RES)',
    role: 'teacher',
    employeeId: 'AI008',
    classesAssigned: 7,
    phone: '+91 9848123409'
  },
  // 16. venkataramana@edu.com
  {
    name: 'Mr. Ch. Venkata Ramana',
    email: 'venkataramana@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'ARVR & Generative AI - Class Incharge (CSE-CS)',
    role: 'teacher',
    employeeId: 'CS005',
    classesAssigned: 10,
    phone: '+91 9848123410'
  },
  // 17. prasadm@edu.com
  {
    name: 'Dr. M. Prasad',
    email: 'prasadm@edu.com',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Ethical Hacking & Cyber Security',
    role: 'teacher',
    employeeId: 'CS006',
    classesAssigned: 3,
    phone: '+91 9848123411'
  },
  // 18. sujathag@edu.com
  {
    name: 'Mrs. G. Sujatha',
    email: 'sujathag@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Deep Learning - Class Incharge (CSE-B)',
    role: 'teacher',
    employeeId: 'CS007',
    classesAssigned: 12,
    phone: '+91 9848123412'
  },
  // 19. anochb@edu.com
  {
    name: 'Mr. B. Anoch',
    email: 'anochb@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'ARVR - Class Incharge (CSE-A/C)',
    role: 'teacher',
    employeeId: 'CS008',
    classesAssigned: 11,
    phone: '+91 9848123413'
  },
  // 20. surendrag@edu.com
  {
    name: 'Mr. G. Surendra',
    email: 'surendrag@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Block Chain Technology (BCT)',
    role: 'teacher',
    employeeId: 'CS009',
    classesAssigned: 5,
    phone: '+91 9848123414'
  },
  // 21. sonisharmila@edu.com
  {
    name: 'Mrs. K. Soni Sharmila',
    email: 'sonisharmila@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Deep Learning & Ethical Hacking Lab',
    role: 'teacher',
    employeeId: 'CS010',
    classesAssigned: 6,
    phone: '+91 9848123415'
  },
  // 22. ashokk@edu.com
  {
    name: 'Dr. K. Ashok',
    email: 'ashokk@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Prompt Engineering & Prompt Engg Lab',
    role: 'teacher',
    employeeId: 'CS011',
    classesAssigned: 6,
    phone: '+91 9848123416'
  },
  // 23. rameshp@edu.com
  {
    name: 'Mr. P. Ramesh',
    email: 'rameshp@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Human Resources & Project Management',
    role: 'teacher',
    employeeId: 'CS012',
    classesAssigned: 16,
    phone: '+91 9848123417'
  },
  // 24. hemalatha@edu.com
  {
    name: 'Ms. M. Hema Latha',
    email: 'hemalatha@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Fundamentals of VLSI Design',
    role: 'teacher',
    employeeId: 'CS013',
    classesAssigned: 10,
    phone: '+91 9848123418'
  },
  // 25. erpraveen@edu.com
  {
    name: 'Mr. E. R. Praveen Kumar',
    email: 'erpraveen@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Embedded Systems',
    role: 'teacher',
    employeeId: 'CS014',
    classesAssigned: 10,
    phone: '+91 9848123419'
  },
  // 26. challaram@edu.com
  {
    name: 'Dr. G. Challa Ram',
    email: 'challaram@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'VLSI Design',
    role: 'teacher',
    employeeId: 'CS015',
    classesAssigned: 5,
    phone: '+91 9848123420'
  },
  // 27. muralikrishna@edu.com
  {
    name: 'Dr. D. Murali Krishna',
    email: 'muralikrishna@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Embedded Systems',
    role: 'teacher',
    employeeId: 'CS016',
    classesAssigned: 5,
    phone: '+91 9848123421'
  },
  // 28. phaneendra@edu.com
  {
    name: 'Mr. Ch. Phaneendra Varma',
    email: 'phaneendra@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Generative AI',
    role: 'teacher',
    employeeId: 'CS017',
    classesAssigned: 5,
    phone: '+91 9848123422'
  },
  // 29. tsnmurty@edu.com
  {
    name: 'Mr. P. T. S. N. Murty',
    email: 'tsnmurty@edu.com',
    department: 'Computer Science',
    designation: 'Associate Professor',
    specialization: 'Data Analytics with Python (Honors)',
    role: 'teacher',
    employeeId: 'CS018',
    classesAssigned: 5,
    phone: '+91 9848123423'
  },
  // 30. nageswararao@edu.com
  {
    name: 'Mr. A. Nageswara Rao',
    email: 'nageswararao@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Constitution of India (COI)',
    role: 'teacher',
    employeeId: 'CS019',
    classesAssigned: 6,
    phone: '+91 9848123424'
  },
  // 31. nagarajan@edu.com
  {
    name: 'Dr. S. Nagarajan',
    email: 'nagarajan@edu.com',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Domain Training: Moocs(SWAYAM/NPTEL)',
    role: 'teacher',
    employeeId: 'CS020',
    classesAssigned: 9,
    phone: '+91 9848123425'
  },
  // 32. ramaraok@edu.com
  {
    name: 'Dr. K. V. Rama Rao',
    email: 'ramaraok@edu.com',
    department: 'Information Technology',
    designation: 'Professor & HOD',
    specialization: 'Web Technologies & Cloud Computing',
    role: 'teacher',
    employeeId: 'IT001',
    classesAssigned: 8,
    phone: '+91 9848123426'
  },
  // 33. swapnap@edu.com
  {
    name: 'Mrs. P. Swapna',
    email: 'swapnap@edu.com',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    specialization: 'Cloud Computing & Virtualization',
    role: 'teacher',
    employeeId: 'IT002',
    classesAssigned: 7,
    phone: '+91 9848123427'
  },
  // 34. venkateshn@edu.com
  {
    name: 'Mr. N. Venkatesh',
    email: 'venkateshn@edu.com',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    specialization: 'Database Administration & Big Data',
    role: 'teacher',
    employeeId: 'IT003',
    classesAssigned: 6,
    phone: '+91 9848123428'
  },
  // 35. sureshkumarg@edu.com
  {
    name: 'Dr. G. Suresh Kumar',
    email: 'sureshkumarg@edu.com',
    department: 'Information Technology',
    designation: 'Associate Professor',
    specialization: 'Information Security & Cryptography',
    role: 'teacher',
    employeeId: 'IT004',
    classesAssigned: 6,
    phone: '+91 9848123429'
  },
  // 36. sireeshad@edu.com
  {
    name: 'Mrs. D. Sireesha',
    email: 'sireeshad@edu.com',
    department: 'Electronics & Communication',
    designation: 'Assistant Professor',
    specialization: 'Embedded Systems & ARM Controllers',
    role: 'teacher',
    employeeId: 'EC002',
    classesAssigned: 6,
    phone: '+91 9848123430'
  },
  // 37. muralikrishnav@edu.com
  {
    name: 'Dr. V. Murali Krishna',
    email: 'muralikrishnav@edu.com',
    department: 'Electronics & Communication',
    designation: 'Professor',
    specialization: 'Digital Signal Processing & Image Processing',
    role: 'teacher',
    employeeId: 'EC003',
    classesAssigned: 6,
    phone: '+91 9848123431'
  },
  // 38. srinivasch@edu.com
  {
    name: 'Mr. Ch. Srinivas',
    email: 'srinivasch@edu.com',
    department: 'Electronics & Communication',
    designation: 'Assistant Professor',
    specialization: 'Wireless & Cellular Communications',
    role: 'teacher',
    employeeId: 'EC004',
    classesAssigned: 6,
    phone: '+91 9848123432'
  },
  // 39. sudhakararaom@edu.com
  {
    name: 'Dr. M. V. Sudhakara Rao',
    email: 'sudhakararaom@edu.com',
    department: 'Electrical & Electronics',
    designation: 'Professor & HOD',
    specialization: 'Power Electronics & Drives',
    role: 'teacher',
    employeeId: 'EE001',
    classesAssigned: 6,
    phone: '+91 9848123433'
  },
  // 40. bhavanis@edu.com
  {
    name: 'Mrs. S. Bhavani',
    email: 'bhavanis@edu.com',
    department: 'Electrical & Electronics',
    designation: 'Assistant Professor',
    specialization: 'Electrical Machines & Control Systems',
    role: 'teacher',
    employeeId: 'EE002',
    classesAssigned: 6,
    phone: '+91 9848123434'
  },
  // 41. saikiranv@edu.com
  {
    name: 'Mr. V. Sai Kiran',
    email: 'saikiranv@edu.com',
    department: 'Electrical & Electronics',
    designation: 'Assistant Professor',
    specialization: 'Smart Grid & Electric Vehicles',
    role: 'teacher',
    employeeId: 'EE003',
    classesAssigned: 6,
    phone: '+91 9848123435'
  },
  // 42. satyanarayana@edu.com
  {
    name: 'Dr. K. Satyanarayana',
    email: 'satyanarayana@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Professor & HOD',
    specialization: 'Applied Thermodynamics & Thermal Engineering',
    role: 'teacher',
    employeeId: 'ME001',
    classesAssigned: 6,
    phone: '+91 9848123436'
  },
  // 43. prasadrajup@edu.com
  {
    name: 'Mr. P. Prasad Raju',
    email: 'prasadrajup@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Assistant Professor',
    specialization: 'Fluid Mechanics & Hydraulic Machinery',
    role: 'teacher',
    employeeId: 'ME002',
    classesAssigned: 5,
    phone: '+91 9848123437'
  },
  // 44. ravisankarm@edu.com
  {
    name: 'Dr. M. Ravi Sankar',
    email: 'ravisankarm@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Associate Professor',
    specialization: 'Kinematics of Machinery & Robotics',
    role: 'teacher',
    employeeId: 'ME003',
    classesAssigned: 6,
    phone: '+91 9848123438'
  },
  // 45. ramamurthyp@edu.com
  {
    name: 'Dr. P. Rama Murthy',
    email: 'ramamurthyp@edu.com',
    department: 'Civil Engineering',
    designation: 'Professor & HOD',
    specialization: 'Advanced Surveying & GIS Mapping',
    role: 'teacher',
    employeeId: 'CE001',
    classesAssigned: 5,
    phone: '+91 9848123439'
  },
  // 46. srilalithab@edu.com
  {
    name: 'Mrs. B. Sri Lalitha',
    email: 'srilalithab@edu.com',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    specialization: 'Strength of Materials & Structural Design',
    role: 'teacher',
    employeeId: 'CE002',
    classesAssigned: 6,
    phone: '+91 9848123440'
  },
  // 47. jagadeeshk@edu.com
  {
    name: 'Mr. K. Jagadeesh',
    email: 'jagadeeshk@edu.com',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    specialization: 'Structural Analysis & RCC Design',
    role: 'teacher',
    employeeId: 'CE003',
    classesAssigned: 5,
    phone: '+91 9848123441'
  },
  // 48. priyankar@edu.com
  {
    name: 'Ms. R. D. Priyanka',
    email: 'priyankar@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Class Incharge - CSE(AI&ML)-B',
    role: 'teacher',
    employeeId: 'AI009',
    classesAssigned: 2,
    phone: '+91 9848123442'
  },
  // 49. gayatrifac@edu.com
  {
    name: 'Mrs. Y. Gayatri',
    email: 'gayatrifac@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Information Retrieval Systems (IRS)',
    role: 'teacher',
    employeeId: 'AI010',
    classesAssigned: 7,
    phone: '+91 9848123443'
  },
  // 50. saidivya@edu.com
  {
    name: 'Ms. J. Sai Divya',
    email: 'saidivya@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Computer Networks (CN)',
    role: 'teacher',
    employeeId: 'AI011',
    classesAssigned: 7,
    phone: '+91 9848123444'
  },
  // 51. swaroopk@edu.com
  {
    name: 'Mr. K. Swaroop',
    email: 'swaroopk@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Operating Systems (OS)',
    role: 'teacher',
    employeeId: 'AI012',
    classesAssigned: 5,
    phone: '+91 9848123445'
  },
  // 52. saradar@edu.com
  {
    name: 'Mrs. R. Sarada',
    email: 'saradar@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Exploratory Data Analysis using Python (EDA)',
    role: 'teacher',
    employeeId: 'AI013',
    classesAssigned: 5,
    phone: '+91 9848123446'
  },
  // 53. veerababu@edu.com
  {
    name: 'Mr. S. Veera Babu',
    email: 'veerababu@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Renewable Energy Sources (RES)',
    role: 'teacher',
    employeeId: 'AI014',
    classesAssigned: 5,
    phone: '+91 9848123447'
  },
  // 54. pradeepj@edu.com
  {
    name: 'Mr. J. Pradeep',
    email: 'pradeepj@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'Full Stack development-II (FSD-II)',
    role: 'teacher',
    employeeId: 'AI015',
    classesAssigned: 5,
    phone: '+91 9848123448'
  },
  // 55. anandd@edu.com
  {
    name: 'Mr. D. Anand',
    email: 'anandd@edu.com',
    department: 'Artificial Intelligence',
    designation: 'Assistant Professor',
    specialization: 'User Interface Design using Flutter',
    role: 'teacher',
    employeeId: 'AI016',
    classesAssigned: 4,
    phone: '+91 9848123449'
  },

  // Additional official college faculty from Weekly Timetables
  {
    name: 'Mrs. T. Anitha',
    email: 'anithat@edu.com',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    specialization: 'Web Technologies & Database Systems',
    role: 'teacher',
    employeeId: 'IT005',
    classesAssigned: 4,
    phone: '+91 9848123450'
  },
  {
    name: 'Mr. B. Ravi Teja',
    email: 'ravitejab@edu.com',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    specialization: 'Cloud Computing & Web Technologies',
    role: 'teacher',
    employeeId: 'IT006',
    classesAssigned: 4,
    phone: '+91 9848123451'
  },
  {
    name: 'Mrs. K. Himabindu',
    email: 'himabinduk@edu.com',
    department: 'Electronics & Communication',
    designation: 'Assistant Professor',
    specialization: 'Digital Signal Processing',
    role: 'teacher',
    employeeId: 'EC005',
    classesAssigned: 4,
    phone: '+91 9848123452'
  },
  {
    name: 'Mr. S. Satyanarayana',
    email: 'satyanarayanas@edu.com',
    department: 'Electronics & Communication',
    designation: 'Assistant Professor',
    specialization: 'Microprocessors & Embedded Systems',
    role: 'teacher',
    employeeId: 'EC006',
    classesAssigned: 4,
    phone: '+91 9848123453'
  },
  {
    name: 'Dr. P. Naresh Kumar',
    email: 'nareshkumarp@edu.com',
    department: 'Electrical & Electronics',
    designation: 'Associate Professor',
    specialization: 'Power Electronics & Renewable Energy',
    role: 'teacher',
    employeeId: 'EE004',
    classesAssigned: 4,
    phone: '+91 9848123454'
  },
  {
    name: 'Mrs. R. Gayathri',
    email: 'gayathrir@edu.com',
    department: 'Electrical & Electronics',
    designation: 'Assistant Professor',
    specialization: 'Electrical Machines & Control',
    role: 'teacher',
    employeeId: 'EE005',
    classesAssigned: 4,
    phone: '+91 9848123455'
  },
  {
    name: 'Mrs. V. Madhavi',
    email: 'madhaviv@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Assistant Professor',
    specialization: 'Thermal Engineering & Fluid Mechanics',
    role: 'teacher',
    employeeId: 'ME004',
    classesAssigned: 4,
    phone: '+91 9848123456'
  },
  {
    name: 'Mr. T. Surya Prakash',
    email: 'suryaprakasht@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Assistant Professor',
    specialization: 'Robotics & Hydraulic Machinery',
    role: 'teacher',
    employeeId: 'ME005',
    classesAssigned: 4,
    phone: '+91 9848123457'
  },
  {
    name: 'Mr. B. Vinod Kumar',
    email: 'vinodkumarb@edu.com',
    department: 'Mechanical Engineering',
    designation: 'Assistant Professor',
    specialization: 'Machine Design & Kinematics',
    role: 'teacher',
    employeeId: 'ME006',
    classesAssigned: 4,
    phone: '+91 9848123458'
  },
  {
    name: 'Mrs. N. Harika',
    email: 'harikan@edu.com',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    specialization: 'Concrete Technology & Surveying',
    role: 'teacher',
    employeeId: 'CE004',
    classesAssigned: 4,
    phone: '+91 9848123459'
  },
  {
    name: 'Mr. R. Mohan Krishna',
    email: 'mohankrishnar@edu.com',
    department: 'Civil Engineering',
    designation: 'Assistant Professor',
    specialization: 'Structural Engineering & GIS',
    role: 'teacher',
    employeeId: 'CE005',
    classesAssigned: 4,
    phone: '+91 9848123460'
  },
  {
    name: 'Dr. S. Vijaya Kumar',
    email: 'vijayakumars@edu.com',
    department: 'Civil Engineering',
    designation: 'Associate Professor',
    specialization: 'Advanced Surveying & Structural Analysis',
    role: 'teacher',
    employeeId: 'CE006',
    classesAssigned: 4,
    phone: '+91 9848123461'
  },
  {
    name: 'Mrs. G. R. L. M. Tayaru',
    email: 'tayarum@edu.com',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Prompt Engineering & AI Lab',
    role: 'teacher',
    employeeId: 'CS021',
    classesAssigned: 4,
    phone: '+91 9848123462'
  }
];

async function seedAllFaculty() {
  await mongoose.connect('mongodb://127.0.0.1:27017/unisync');
  console.log('Connected to MongoDB.');

  let addedCount = 0;
  let updatedCount = 0;

  for (const fac of ALL_TIMETABLE_FACULTY) {
    const existing = await User.findOne({ email: fac.email.toLowerCase().trim() });
    if (!existing) {
      const newUser = new User({
        name: fac.name,
        email: fac.email.toLowerCase().trim(),
        password: 'Teach@UniSync#2026',
        role: fac.role || 'teacher',
        department: fac.department,
        designation: fac.designation || 'Assistant Professor',
        specialization: fac.specialization,
        employeeId: fac.employeeId,
        classesAssigned: fac.classesAssigned || 10,
        classesAdjusted: 0,
        phone: fac.phone || '+91 9876543210',
        status: 'active',
        joinDate: '2021-08-15',
        address: 'SVECW Campus, Bhimavaram',
        qualifications: fac.designation && fac.designation.includes('Dr.') ? 'PhD in Engineering' : 'M.Tech, B.Tech',
        experience: '8+ years'
      });
      await newUser.save();
      addedCount++;
      console.log(`[+] Added faculty: ${fac.name} (${fac.email}) - Dept: ${fac.department}`);
    } else {
      // Update info like name, department, designation, specialization, employeeId, classesAssigned, status
      let changed = false;
      if (existing.name !== fac.name) { existing.name = fac.name; changed = true; }
      if (existing.department !== fac.department) { existing.department = fac.department; changed = true; }
      if (existing.specialization !== fac.specialization) { existing.specialization = fac.specialization; changed = true; }
      if (existing.designation !== fac.designation) { existing.designation = fac.designation; changed = true; }
      if (existing.employeeId !== fac.employeeId) { existing.employeeId = fac.employeeId; changed = true; }
      if (existing.classesAssigned !== fac.classesAssigned) { existing.classesAssigned = fac.classesAssigned; changed = true; }
      if (existing.status !== 'active' && existing.status !== 'on_leave') { existing.status = 'active'; changed = true; }

      if (changed) {
        await existing.save();
        updatedCount++;
        console.log(`[*] Updated faculty: ${fac.name} (${fac.email})`);
      }
    }
  }

  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalAll = await User.countDocuments({});
  console.log(`\n==========================================`);
  console.log(`Seeding complete: ${addedCount} added, ${updatedCount} updated.`);
  console.log(`Total Teachers in DB: ${totalTeachers}`);
  console.log(`Total Users in DB: ${totalAll}`);
  console.log(`==========================================`);

  await mongoose.disconnect();
}

module.exports = { ALL_TIMETABLE_FACULTY, seedAllFaculty };

if (require.main === module) {
  seedAllFaculty().catch(console.error);
}
