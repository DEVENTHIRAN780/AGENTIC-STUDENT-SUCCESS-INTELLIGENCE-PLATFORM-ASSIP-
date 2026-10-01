import { 
  User, Student, Course, Enrollment, Intervention, 
  Goal, StudyPlan, NotificationItem, AuditLog, AIInsight, 
  AgentActivityItem, DepartmentName, RiskLevel 
} from '../types/index.js';

// Pre-hashed password or simple token verification
// For demo purposes, we will support bcrypt or plain check "demo123"
export const DEMO_PASSWORD = 'password123';

export const DEPARTMENTS: DepartmentName[] = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];

export function generateSeedData() {
  const users: User[] = [
    {
      id: 'usr-student-1',
      email: 'student@demo.com',
      role: 'student',
      name: 'Alex Kumar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      department: 'IT',
      phone: '+91 98451 22340',
      studentId: 'ST2024-1001',
      createdAt: '2024-08-01T09:00:00Z',
    },
    {
      id: 'usr-faculty-1',
      email: 'faculty@demo.com',
      role: 'faculty',
      name: 'Dr. Sunita Ramanathan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      department: 'CSE',
      phone: '+91 98452 44551',
      createdAt: '2023-01-15T09:00:00Z',
    },
    {
      id: 'usr-advisor-1',
      email: 'advisor@demo.com',
      role: 'advisor',
      name: 'Prof. Rajeshwar Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      department: 'IT',
      phone: '+91 98453 66772',
      createdAt: '2022-06-10T09:00:00Z',
    },
    {
      id: 'usr-admin-1',
      email: 'admin@demo.com',
      role: 'admin',
      name: 'Dr. Meenakshi Sundaram',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
      department: 'CSE',
      phone: '+91 98454 88993',
      createdAt: '2021-03-01T09:00:00Z',
    }
  ];

  // 10 Advisors
  const advisors = [
    { id: 'adv-1', name: 'Prof. Rajeshwar Kulkarni', dept: 'IT' as DepartmentName, email: 'rajeshwar.k@univ.edu' },
    { id: 'adv-2', name: 'Dr. Anita Deshmukh', dept: 'CSE' as DepartmentName, email: 'anita.d@univ.edu' },
    { id: 'adv-3', name: 'Prof. Venkat Subramaniam', dept: 'ECE' as DepartmentName, email: 'venkat.s@univ.edu' },
    { id: 'adv-4', name: 'Dr. Pradeep Sen', dept: 'EEE' as DepartmentName, email: 'pradeep.sen@univ.edu' },
    { id: 'adv-5', name: 'Prof. Ramesh Gokhale', dept: 'Mechanical' as DepartmentName, email: 'ramesh.g@univ.edu' },
    { id: 'adv-6', name: 'Dr. Shalini Hegde', dept: 'Civil' as DepartmentName, email: 'shalini.h@univ.edu' },
    { id: 'adv-7', name: 'Prof. Arvind Nambiar', dept: 'CSE' as DepartmentName, email: 'arvind.n@univ.edu' },
    { id: 'adv-8', name: 'Dr. Kavita Pillai', dept: 'IT' as DepartmentName, email: 'kavita.p@univ.edu' },
    { id: 'adv-9', name: 'Prof. Suresh Varma', dept: 'ECE' as DepartmentName, email: 'suresh.v@univ.edu' },
    { id: 'adv-10', name: 'Dr. Geeta Chawla', dept: 'Mechanical' as DepartmentName, email: 'geeta.c@univ.edu' }
  ];

  // 20 Faculty
  const facultyList = [
    { id: 'fac-1', name: 'Dr. Sunita Ramanathan', dept: 'CSE' as DepartmentName },
    { id: 'fac-2', name: 'Prof. Anand Vardhan', dept: 'CSE' as DepartmentName },
    { id: 'fac-3', name: 'Dr. Ritu Bhatnagar', dept: 'IT' as DepartmentName },
    { id: 'fac-4', name: 'Prof. Harish Nair', dept: 'IT' as DepartmentName },
    { id: 'fac-5', name: 'Dr. Prakash Narayan', dept: 'ECE' as DepartmentName },
    { id: 'fac-6', name: 'Prof. Deepa Soni', dept: 'ECE' as DepartmentName },
    { id: 'fac-7', name: 'Dr. K. Srinivas', dept: 'EEE' as DepartmentName },
    { id: 'fac-8', name: 'Prof. Manisha Patil', dept: 'EEE' as DepartmentName },
    { id: 'fac-9', name: 'Dr. Ajay Mathur', dept: 'Mechanical' as DepartmentName },
    { id: 'fac-10', name: 'Prof. Vikram Chauhan', dept: 'Mechanical' as DepartmentName },
    { id: 'fac-11', name: 'Dr. Neeraja Reddy', dept: 'Civil' as DepartmentName },
    { id: 'fac-12', name: 'Prof. Sudhir Joshi', dept: 'Civil' as DepartmentName },
    { id: 'fac-13', name: 'Dr. B. K. Mishra', dept: 'CSE' as DepartmentName },
    { id: 'fac-14', name: 'Prof. Archana Sengupta', dept: 'IT' as DepartmentName },
    { id: 'fac-15', name: 'Dr. Mohan Das', dept: 'ECE' as DepartmentName },
    { id: 'fac-16', name: 'Prof. Rekha Menon', dept: 'EEE' as DepartmentName },
    { id: 'fac-17', name: 'Dr. Tarun Ghosh', dept: 'Mechanical' as DepartmentName },
    { id: 'fac-18', name: 'Prof. Alok Mukherjee', dept: 'Civil' as DepartmentName },
    { id: 'fac-19', name: 'Dr. Smita Prabhu', dept: 'CSE' as DepartmentName },
    { id: 'fac-20', name: 'Prof. Vinay Kulkarni', dept: 'IT' as DepartmentName }
  ];

  // 30 Courses
  const courses: Course[] = [
    // CSE / IT
    {
      id: 'crs-1',
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      department: 'CSE',
      credits: 4,
      semester: 3,
      facultyId: 'fac-1',
      facultyName: 'Dr. Sunita Ramanathan',
      enrollmentCount: 124,
      avgScore: 72,
      passRate: 91,
      failureRate: 9,
      avgAttendance: 88,
      assignmentCompletionRate: 84,
      riskDistribution: { low: 78, moderate: 31, high: 11, critical: 4 },
      flags: ['Midterm score variance high', 'Assignment 3 submission delayed by 12%']
    },
    {
      id: 'crs-2',
      code: 'IT302',
      name: 'Operating Systems & System Programming',
      department: 'IT',
      credits: 4,
      semester: 5,
      facultyId: 'fac-3',
      facultyName: 'Dr. Ritu Bhatnagar',
      enrollmentCount: 112,
      avgScore: 68,
      passRate: 85,
      failureRate: 15,
      avgAttendance: 81,
      assignmentCompletionRate: 76,
      riskDistribution: { low: 64, moderate: 28, high: 14, critical: 6 },
      flags: ['Assignment completion has declined for the last three weeks', 'Attendance drop in Friday lab']
    },
    {
      id: 'crs-3',
      code: 'CS303',
      name: 'Database Management Systems',
      department: 'CSE',
      credits: 4,
      semester: 4,
      facultyId: 'fac-2',
      facultyName: 'Prof. Anand Vardhan',
      enrollmentCount: 130,
      avgScore: 77,
      passRate: 94,
      failureRate: 6,
      avgAttendance: 89,
      assignmentCompletionRate: 91,
      riskDistribution: { low: 95, moderate: 23, high: 9, critical: 3 },
      flags: ['Healthy participation', 'Lab project submissions on schedule']
    },
    {
      id: 'crs-4',
      code: 'IT401',
      name: 'Computer Networks & Security',
      department: 'IT',
      credits: 3,
      semester: 5,
      facultyId: 'fac-4',
      facultyName: 'Prof. Harish Nair',
      enrollmentCount: 105,
      avgScore: 74,
      passRate: 89,
      failureRate: 11,
      avgAttendance: 86,
      assignmentCompletionRate: 88,
      riskDistribution: { low: 72, moderate: 21, high: 9, critical: 3 },
      flags: ['Packet tracer practical quiz upcoming']
    },
    {
      id: 'crs-5',
      code: 'CS502',
      name: 'Artificial Intelligence & Machine Learning',
      department: 'CSE',
      credits: 4,
      semester: 5,
      facultyId: 'fac-1',
      facultyName: 'Dr. Sunita Ramanathan',
      enrollmentCount: 140,
      avgScore: 79,
      passRate: 93,
      failureRate: 7,
      avgAttendance: 90,
      assignmentCompletionRate: 92,
      riskDistribution: { low: 102, moderate: 24, high: 10, critical: 4 },
      flags: ['High student interest', 'Kaggle challenge ongoing']
    },
    {
      id: 'crs-6',
      code: 'CS201',
      name: 'Object Oriented Programming with Java',
      department: 'CSE',
      credits: 4,
      semester: 2,
      facultyId: 'fac-13',
      facultyName: 'Dr. B. K. Mishra',
      enrollmentCount: 145,
      avgScore: 71,
      passRate: 87,
      failureRate: 13,
      avgAttendance: 84,
      assignmentCompletionRate: 82,
      riskDistribution: { low: 92, moderate: 33, high: 14, critical: 6 },
      flags: ['Multithreading lab requires supplementary tutorials']
    },
    {
      id: 'crs-7',
      code: 'IT503',
      name: 'Cloud Computing & DevOps',
      department: 'IT',
      credits: 3,
      semester: 6,
      facultyId: 'fac-14',
      facultyName: 'Prof. Archana Sengupta',
      enrollmentCount: 98,
      avgScore: 81,
      passRate: 96,
      failureRate: 4,
      avgAttendance: 92,
      assignmentCompletionRate: 94,
      riskDistribution: { low: 76, moderate: 15, high: 5, critical: 2 },
      flags: ['AWS credits distributed']
    },
    {
      id: 'crs-8',
      code: 'CS404',
      name: 'Theory of Computation & Automata',
      department: 'CSE',
      credits: 4,
      semester: 4,
      facultyId: 'fac-19',
      facultyName: 'Dr. Smita Prabhu',
      enrollmentCount: 120,
      avgScore: 63,
      passRate: 79,
      failureRate: 21,
      avgAttendance: 79,
      assignmentCompletionRate: 71,
      riskDistribution: { low: 58, moderate: 35, high: 18, critical: 9 },
      flags: ['Turing machines chapter shows 28% quiz failure rate']
    },
    // ECE
    {
      id: 'crs-9',
      code: 'EC301',
      name: 'Signals & Systems',
      department: 'ECE',
      credits: 4,
      semester: 3,
      facultyId: 'fac-5',
      facultyName: 'Dr. Prakash Narayan',
      enrollmentCount: 95,
      avgScore: 66,
      passRate: 81,
      failureRate: 19,
      avgAttendance: 83,
      assignmentCompletionRate: 75,
      riskDistribution: { low: 52, moderate: 26, high: 12, critical: 5 },
      flags: ['Fourier transform practice sessions recommended']
    },
    {
      id: 'crs-10',
      code: 'EC402',
      name: 'Microprocessors & Microcontrollers',
      department: 'ECE',
      credits: 4,
      semester: 4,
      facultyId: 'fac-6',
      facultyName: 'Prof. Deepa Soni',
      enrollmentCount: 90,
      avgScore: 73,
      passRate: 88,
      failureRate: 12,
      avgAttendance: 87,
      assignmentCompletionRate: 86,
      riskDistribution: { low: 62, moderate: 18, high: 7, critical: 3 },
      flags: ['ARM assembly kit submissions completed']
    },
    {
      id: 'crs-11',
      code: 'EC501',
      name: 'Digital Communication Systems',
      department: 'ECE',
      credits: 4,
      semester: 5,
      facultyId: 'fac-15',
      facultyName: 'Dr. Mohan Das',
      enrollmentCount: 88,
      avgScore: 75,
      passRate: 90,
      failureRate: 10,
      avgAttendance: 88,
      assignmentCompletionRate: 89,
      riskDistribution: { low: 64, moderate: 16, high: 6, critical: 2 },
      flags: ['Constellation diagrams simulation lab on track']
    },
    {
      id: 'crs-12',
      code: 'EC602',
      name: 'VLSI Circuit Design',
      department: 'ECE',
      credits: 3,
      semester: 6,
      facultyId: 'fac-5',
      facultyName: 'Dr. Prakash Narayan',
      enrollmentCount: 82,
      avgScore: 78,
      passRate: 92,
      failureRate: 8,
      avgAttendance: 89,
      assignmentCompletionRate: 91,
      riskDistribution: { low: 60, moderate: 15, high: 5, critical: 2 },
      flags: ['Cadence tool licensing updated']
    },
    // EEE
    {
      id: 'crs-13',
      code: 'EE301',
      name: 'Power Systems Engineering I',
      department: 'EEE',
      credits: 4,
      semester: 3,
      facultyId: 'fac-7',
      facultyName: 'Dr. K. Srinivas',
      enrollmentCount: 80,
      avgScore: 69,
      passRate: 84,
      failureRate: 16,
      avgAttendance: 85,
      assignmentCompletionRate: 80,
      riskDistribution: { low: 48, moderate: 20, high: 9, critical: 3 },
      flags: ['Fault analysis lab attendance flagged']
    },
    {
      id: 'crs-14',
      code: 'EE402',
      name: 'Control Systems Engineering',
      department: 'EEE',
      credits: 4,
      semester: 4,
      facultyId: 'fac-8',
      facultyName: 'Prof. Manisha Patil',
      enrollmentCount: 84,
      avgScore: 72,
      passRate: 87,
      failureRate: 13,
      avgAttendance: 86,
      assignmentCompletionRate: 83,
      riskDistribution: { low: 54, moderate: 19, high: 8, critical: 3 },
      flags: ['Bode plot review lecture scheduled']
    },
    {
      id: 'crs-15',
      code: 'EE501',
      name: 'Power Electronics & Drives',
      department: 'EEE',
      credits: 4,
      semester: 5,
      facultyId: 'fac-16',
      facultyName: 'Prof. Rekha Menon',
      enrollmentCount: 76,
      avgScore: 74,
      passRate: 89,
      failureRate: 11,
      avgAttendance: 88,
      assignmentCompletionRate: 87,
      riskDistribution: { low: 52, moderate: 16, high: 6, critical: 2 },
      flags: ['Inverter waveforms practical finished']
    },
    // Mechanical
    {
      id: 'crs-16',
      code: 'ME301',
      name: 'Engineering Thermodynamics',
      department: 'Mechanical',
      credits: 4,
      semester: 3,
      facultyId: 'fac-9',
      facultyName: 'Dr. Ajay Mathur',
      enrollmentCount: 85,
      avgScore: 67,
      passRate: 82,
      failureRate: 18,
      avgAttendance: 84,
      assignmentCompletionRate: 77,
      riskDistribution: { low: 50, moderate: 22, high: 10, critical: 3 },
      flags: ['Rankine cycle problem-solving workshop planned']
    },
    {
      id: 'crs-17',
      code: 'ME402',
      name: 'Fluid Mechanics & Machinery',
      department: 'Mechanical',
      credits: 4,
      semester: 4,
      facultyId: 'fac-10',
      facultyName: 'Prof. Vikram Chauhan',
      enrollmentCount: 82,
      avgScore: 71,
      passRate: 86,
      failureRate: 14,
      avgAttendance: 86,
      assignmentCompletionRate: 84,
      riskDistribution: { low: 53, moderate: 18, high: 8, critical: 3 },
      flags: ['Bernoulli experiment reports under review']
    },
    {
      id: 'crs-18',
      code: 'ME501',
      name: 'Heat & Mass Transfer',
      department: 'Mechanical',
      credits: 4,
      semester: 5,
      facultyId: 'fac-17',
      facultyName: 'Dr. Tarun Ghosh',
      enrollmentCount: 78,
      avgScore: 75,
      passRate: 90,
      failureRate: 10,
      avgAttendance: 87,
      assignmentCompletionRate: 88,
      riskDistribution: { low: 55, moderate: 15, high: 6, critical: 2 },
      flags: ['Conduction radiation project models submitted']
    },
    // Civil
    {
      id: 'crs-19',
      code: 'CE301',
      name: 'Structural Analysis I',
      department: 'Civil',
      credits: 4,
      semester: 3,
      facultyId: 'fac-11',
      facultyName: 'Dr. Neeraja Reddy',
      enrollmentCount: 75,
      avgScore: 65,
      passRate: 80,
      failureRate: 20,
      avgAttendance: 82,
      assignmentCompletionRate: 74,
      riskDistribution: { low: 44, moderate: 20, high: 8, critical: 3 },
      flags: ['Moment distribution method tutorial needed']
    },
    {
      id: 'crs-20',
      code: 'CE402',
      name: 'Geotechnical Engineering & Soil Mechanics',
      department: 'Civil',
      credits: 4,
      semester: 4,
      facultyId: 'fac-12',
      facultyName: 'Prof. Sudhir Joshi',
      enrollmentCount: 72,
      avgScore: 73,
      passRate: 88,
      failureRate: 12,
      avgAttendance: 86,
      assignmentCompletionRate: 85,
      riskDistribution: { low: 48, moderate: 16, high: 6, critical: 2 },
      flags: ['Soil permeability lab completed']
    },
    {
      id: 'crs-21',
      code: 'CE501',
      name: 'Environmental Engineering & Water Resources',
      department: 'Civil',
      credits: 3,
      semester: 5,
      facultyId: 'fac-18',
      facultyName: 'Prof. Alok Mukherjee',
      enrollmentCount: 70,
      avgScore: 78,
      passRate: 92,
      failureRate: 8,
      avgAttendance: 89,
      assignmentCompletionRate: 90,
      riskDistribution: { low: 52, moderate: 12, high: 4, critical: 2 },
      flags: ['Water treatment plant site visit scheduled']
    },
    // Common / Foundational Engineering Courses
    {
      id: 'crs-22',
      code: 'MA101',
      name: 'Linear Algebra & Calculus',
      department: 'CSE',
      credits: 4,
      semester: 1,
      facultyId: 'fac-2',
      facultyName: 'Prof. Anand Vardhan',
      enrollmentCount: 220,
      avgScore: 68,
      passRate: 83,
      failureRate: 17,
      avgAttendance: 85,
      assignmentCompletionRate: 81,
      riskDistribution: { low: 140, moderate: 50, high: 22, critical: 8 },
      flags: ['Eigenvalues exam marks lower than historical average']
    },
    {
      id: 'crs-23',
      code: 'PH102',
      name: 'Engineering Physics & Electromagnetics',
      department: 'ECE',
      credits: 3,
      semester: 1,
      facultyId: 'fac-5',
      facultyName: 'Dr. Prakash Narayan',
      enrollmentCount: 210,
      avgScore: 70,
      passRate: 86,
      failureRate: 14,
      avgAttendance: 86,
      assignmentCompletionRate: 85,
      riskDistribution: { low: 145, moderate: 42, high: 16, critical: 7 },
      flags: ['Optics lab reports completed']
    },
    {
      id: 'crs-24',
      code: 'HS201',
      name: 'Professional Ethics & Technical Communication',
      department: 'IT',
      credits: 2,
      semester: 2,
      facultyId: 'fac-4',
      facultyName: 'Prof. Harish Nair',
      enrollmentCount: 240,
      avgScore: 84,
      passRate: 98,
      failureRate: 2,
      avgAttendance: 93,
      assignmentCompletionRate: 96,
      riskDistribution: { low: 215, moderate: 18, high: 5, critical: 2 },
      flags: ['Presentation rubrics released']
    },
    {
      id: 'crs-25',
      code: 'CS601',
      name: 'Compiler Design & Formal Languages',
      department: 'CSE',
      credits: 4,
      semester: 6,
      facultyId: 'fac-19',
      facultyName: 'Dr. Smita Prabhu',
      enrollmentCount: 92,
      avgScore: 69,
      passRate: 84,
      failureRate: 16,
      avgAttendance: 83,
      assignmentCompletionRate: 78,
      riskDistribution: { low: 58, moderate: 22, high: 9, critical: 3 },
      flags: ['Lex & Yacc parser project deadline approaching']
    },
    {
      id: 'crs-26',
      code: 'IT602',
      name: 'Full Stack Web Development & Microservices',
      department: 'IT',
      credits: 4,
      semester: 6,
      facultyId: 'fac-20',
      facultyName: 'Prof. Vinay Kulkarni',
      enrollmentCount: 110,
      avgScore: 82,
      passRate: 95,
      failureRate: 5,
      avgAttendance: 91,
      assignmentCompletionRate: 93,
      riskDistribution: { low: 88, moderate: 16, high: 4, critical: 2 },
      flags: ['High GitHub commit activity']
    },
    {
      id: 'crs-27',
      code: 'EC603',
      name: 'Embedded Systems & Internet of Things (IoT)',
      department: 'ECE',
      credits: 3,
      semester: 6,
      facultyId: 'fac-6',
      facultyName: 'Prof. Deepa Soni',
      enrollmentCount: 86,
      avgScore: 80,
      passRate: 93,
      failureRate: 7,
      avgAttendance: 90,
      assignmentCompletionRate: 91,
      riskDistribution: { low: 66, moderate: 14, high: 4, critical: 2 },
      flags: ['ESP32 hardware kits distributed']
    },
    {
      id: 'crs-28',
      code: 'EE601',
      name: 'Renewable Energy Systems & Smart Grids',
      department: 'EEE',
      credits: 3,
      semester: 6,
      facultyId: 'fac-7',
      facultyName: 'Dr. K. Srinivas',
      enrollmentCount: 74,
      avgScore: 76,
      passRate: 91,
      failureRate: 9,
      avgAttendance: 88,
      assignmentCompletionRate: 89,
      riskDistribution: { low: 55, moderate: 13, high: 4, critical: 2 },
      flags: ['Solar microgrid design seminar held']
    },
    {
      id: 'crs-29',
      code: 'ME602',
      name: 'Computer Aided Design & Finite Element Analysis (FEA)',
      department: 'Mechanical',
      credits: 4,
      semester: 6,
      facultyId: 'fac-9',
      facultyName: 'Dr. Ajay Mathur',
      enrollmentCount: 76,
      avgScore: 74,
      passRate: 89,
      failureRate: 11,
      avgAttendance: 87,
      assignmentCompletionRate: 86,
      riskDistribution: { low: 52, moderate: 16, high: 6, critical: 2 },
      flags: ['ANSYS stress analysis lab evaluation next week']
    },
    {
      id: 'crs-30',
      code: 'CE601',
      name: 'Design of Reinforced Concrete Structures',
      department: 'Civil',
      credits: 4,
      semester: 6,
      facultyId: 'fac-11',
      facultyName: 'Dr. Neeraja Reddy',
      enrollmentCount: 68,
      avgScore: 70,
      passRate: 85,
      failureRate: 15,
      avgAttendance: 84,
      assignmentCompletionRate: 81,
      riskDistribution: { low: 44, moderate: 16, high: 6, critical: 2 },
      flags: ['Limit state design calculations check']
    }
  ];

  // Generate 105 realistic Students
  const firstNames = [
    'Alex', 'Priya', 'Aarav', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Divya', 'Karthik', 'Neha',
    'Aditya', 'Tanvi', 'Rahul', 'Ishaan', 'Meera', 'Varun', 'Pooja', 'Abhishek', 'Shreya', 'Siddharth',
    'Rhea', 'Manish', 'Kavya', 'Gaurav', 'Tara', 'Arjun', 'Simran', 'Nikhil', 'Anushka', 'Harsh',
    'Akash', 'Shruti', 'Deepak', 'Swati', 'Pranav', 'Nisha', 'Aman', 'Bhavna', 'Kunal', 'Ritu',
    'Dev', 'Lavanya', 'Sameer', 'Priti', 'Yash', 'Anjali', 'Mayank', 'Isha', 'Rohit', 'Sakshi',
    'Chirag', 'Pallavi', 'Sanjay', 'Vandana', 'Tejas', 'Deepika', 'Kiran', 'Sonali', 'Tushar', 'Aditi'
  ];

  const lastNames = [
    'Kumar', 'Sharma', 'Patel', 'Iyer', 'Verma', 'Reddy', 'Singh', 'Nair', 'Menon', 'Gupta',
    'Joshi', 'Rao', 'Kulkarni', 'Deshmukh', 'Bhatnagar', 'Sen', 'Gokhale', 'Chawla', 'Nambiar', 'Pillai',
    'Varma', 'Mukherjee', 'Chatterjee', 'Banerjee', 'Bose', 'Dutta', 'Sengupta', 'Ghosh', 'Das', 'Roy',
    'Chauhan', 'Thakur', 'Yadav', 'Pandey', 'Mishra', 'Tripathi', 'Tiwari', 'Shukla', 'Dubey', 'Sinha'
  ];

  const students: Student[] = [];
  const enrollments: Enrollment[] = [];
  const riskFactorsList: any[] = [];

  // Seed Alex Kumar specifically as Student #1
  const alexStudent: Student = {
    id: 'std-1001',
    studentId: 'ST2024-1001',
    userId: 'usr-student-1',
    name: 'Alex Kumar',
    email: 'student@demo.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    department: 'IT',
    program: 'B.Tech Information Technology',
    semester: 5,
    enrollmentYear: 2022,
    gpa: 8.42,
    cgpa: 8.28,
    attendancePct: 91,
    creditsCompleted: 86,
    creditsTotal: 160,
    academicHealth: 82, // 82 / 100 "On Track"
    riskLevel: 'low',
    riskScore: 22,
    riskTrend: 'down',
    riskChange: -4,
    primarySignal: 'Attendance in Operating Systems dropped to 78%',
    advisorId: 'adv-1',
    advisorName: 'Prof. Rajeshwar Kulkarni',
    mentorName: 'Dr. Ritu Bhatnagar',
    tags: ['Dean\'s Honor Roll', 'Hackathon Finalist', 'AI Specialization']
  };
  students.push(alexStudent);

  // Alex's Enrollments
  enrollments.push(
    {
      id: 'enr-alex-1',
      studentId: 'std-1001',
      courseId: 'crs-1',
      courseCode: 'CS301',
      courseName: 'Data Structures & Algorithms',
      semester: 5,
      grade: 'A',
      marksScore: 88,
      attendancePct: 94,
      assignmentsCompleted: 6,
      totalAssignments: 6,
      midtermScore: 90,
      finalExamScore: 86,
      status: 'enrolled'
    },
    {
      id: 'enr-alex-2',
      studentId: 'std-1001',
      courseId: 'crs-2',
      courseCode: 'IT302',
      courseName: 'Operating Systems & System Programming',
      semester: 5,
      grade: 'B+',
      marksScore: 78,
      attendancePct: 78, // Flagged drop
      assignmentsCompleted: 4,
      totalAssignments: 5,
      midtermScore: 74,
      status: 'enrolled'
    },
    {
      id: 'enr-alex-3',
      studentId: 'std-1001',
      courseId: 'crs-4',
      courseCode: 'IT401',
      courseName: 'Computer Networks & Security',
      semester: 5,
      grade: 'A',
      marksScore: 86,
      attendancePct: 92,
      assignmentsCompleted: 5,
      totalAssignments: 5,
      midtermScore: 88,
      status: 'enrolled'
    },
    {
      id: 'enr-alex-4',
      studentId: 'std-1001',
      courseId: 'crs-5',
      courseCode: 'CS502',
      courseName: 'Artificial Intelligence & Machine Learning',
      semester: 5,
      grade: 'A+',
      marksScore: 93,
      attendancePct: 96,
      assignmentsCompleted: 5,
      totalAssignments: 5,
      midtermScore: 95,
      status: 'enrolled'
    }
  );

  // Generate 104 additional realistic students
  for (let i = 2; i <= 105; i++) {
    const fn = firstNames[(i * 7 + 3) % firstNames.length];
    const ln = lastNames[(i * 13 + 5) % lastNames.length];
    const name = `${fn} ${ln}`;
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const sem = 1 + ((i * 3) % 8);
    const yr = 2024 - Math.floor((sem - 1) / 2);
    const stdIdNum = 1000 + i;
    const studentIdStr = `ST2024-${stdIdNum}`;

    // Risk distribution: ~12 critical, ~18 high, ~25 moderate, ~50 low
    let riskLevel: RiskLevel = 'low';
    let riskScore = 15 + (i % 15);
    let riskTrend: 'up' | 'down' | 'stable' = 'stable';
    let riskChange = 0;
    let attendance = 85 + (i % 14);
    let gpa = 7.5 + ((i % 25) / 10);
    let academicHealth = 80 + (i % 18);
    let primarySignal = 'Consistently meeting performance benchmarks';

    if (i % 9 === 0) {
      riskLevel = 'critical';
      riskScore = 82 + (i % 16);
      riskTrend = 'up';
      riskChange = 12 + (i % 8);
      attendance = 55 + (i % 14);
      gpa = 4.8 + ((i % 12) / 10);
      academicHealth = 38 + (i % 15);
      primarySignal = `Attendance dropped ${(15 + (i % 10))}% & ${(2 + (i % 3))} assignments missing`;
    } else if (i % 5 === 0) {
      riskLevel = 'high';
      riskScore = 65 + (i % 14);
      riskTrend = 'up';
      riskChange = 8 + (i % 6);
      attendance = 68 + (i % 10);
      gpa = 5.8 + ((i % 14) / 10);
      academicHealth = 54 + (i % 12);
      primarySignal = `Recent Midterm score ${(14 + (i % 8))}% below class average`;
    } else if (i % 3 === 0) {
      riskLevel = 'moderate';
      riskScore = 38 + (i % 20);
      riskTrend = (i % 2 === 0) ? 'up' : 'down';
      riskChange = (i % 2 === 0) ? 5 : -4;
      attendance = 76 + (i % 9);
      gpa = 6.8 + ((i % 14) / 10);
      academicHealth = 68 + (i % 10);
      primarySignal = `Assignment submission rate dipped in ${dept} core modules`;
    } else {
      riskLevel = 'low';
      riskTrend = (i % 2 === 0) ? 'down' : 'stable';
      riskChange = -3;
    }

    // Credits
    const completedCredits = Math.min(160, sem * 20 - (riskLevel === 'critical' ? 14 : riskLevel === 'high' ? 8 : 2));
    const advisor = advisors[i % advisors.length];

    const studentObj: Student = {
      id: `std-${stdIdNum}`,
      studentId: studentIdStr,
      userId: `usr-gen-${stdIdNum}`,
      name,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@student.univ.edu`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + ((i * 1234567) % 999999999)}?auto=format&fit=crop&q=80&w=250`,
      department: dept,
      program: `B.Tech ${dept === 'CSE' ? 'Computer Science & Engineering' : dept === 'IT' ? 'Information Technology' : dept === 'ECE' ? 'Electronics & Communication' : dept === 'EEE' ? 'Electrical & Electronics' : dept === 'Mechanical' ? 'Mechanical Engineering' : 'Civil Engineering'}`,
      semester: sem,
      enrollmentYear: yr,
      gpa: Number(Math.min(10, Math.max(3.5, gpa)).toFixed(2)),
      cgpa: Number(Math.min(10, Math.max(3.8, gpa - 0.15)).toFixed(2)),
      attendancePct: Math.min(99, Math.max(45, attendance)),
      creditsCompleted: completedCredits,
      creditsTotal: 160,
      academicHealth: Math.min(98, Math.max(25, academicHealth)),
      riskLevel,
      riskScore,
      riskTrend,
      riskChange,
      primarySignal,
      advisorId: advisor.id,
      advisorName: advisor.name,
      mentorName: facultyList[i % facultyList.length].name,
      tags: riskLevel === 'critical' ? ['Immediate Follow-up', 'Dean Alert'] : 
            riskLevel === 'high' ? ['Advisor Action Req.', 'Academic Warning'] :
            riskLevel === 'moderate' ? ['Under Observation'] : ['Good Standing']
    };
    students.push(studentObj);

    // Enroll in 3 relevant courses
    const deptCourses = courses.filter(c => c.department === dept || c.department === 'CSE');
    const assignedCourses = deptCourses.slice(0, 3);
    assignedCourses.forEach((c, idx) => {
      const enrMarks = Math.min(98, Math.max(40, Math.round(studentObj.gpa * 9.5 + (idx % 2 === 0 ? 5 : -5))));
      enrollments.push({
        id: `enr-${stdIdNum}-${idx}`,
        studentId: studentObj.id,
        courseId: c.id,
        courseCode: c.code,
        courseName: c.name,
        semester: sem,
        grade: enrMarks >= 90 ? 'A+' : enrMarks >= 80 ? 'A' : enrMarks >= 70 ? 'B+' : enrMarks >= 60 ? 'B' : enrMarks >= 50 ? 'C' : 'F',
        marksScore: enrMarks,
        attendancePct: Math.min(100, Math.max(45, studentObj.attendancePct + (idx % 2 === 0 ? 3 : -4))),
        assignmentsCompleted: riskLevel === 'critical' ? 2 : riskLevel === 'high' ? 3 : 5,
        totalAssignments: 5,
        midtermScore: enrMarks - (riskLevel === 'critical' ? 15 : 0),
        status: 'enrolled'
      });
    });
  }

  // Realistic Interventions (for Early Warning Queue and Advisor Workflow)
  const interventions: Intervention[] = [
    {
      id: 'intv-101',
      studentId: 'std-1009',
      studentName: 'Rohan Verma',
      studentDept: 'CSE',
      studentSemester: 4,
      riskLevel: 'critical',
      riskScore: 84,
      type: 'Academic Advising',
      status: 'Pending Review',
      priority: 'urgent',
      title: 'Emergency Academic Advising & Attendance Intervention',
      description: 'Student has missed 3 consecutive weeks of Computer Networks and failed Midterm 1. Risk score jumped by +14 points.',
      aiGenerated: true,
      aiExplanation: 'Attendance declined from 82% to 58% over 21 days. Three lab programming assignments remain unsubmitted. Predictive failure probability in CS301 stands at 76%.',
      contributingSignals: [
        'Attendance dropped 24% over past 3 weeks',
        '3 programming assignments missing in CS301',
        'Midterm score (42%) is 30% below course average',
        'LMS portal activity logged 0 hours during exam prep week'
      ],
      recommendedAction: 'Schedule an immediate 1-on-1 advisor check-in, assign a peer mentor from 6th sem CSE, and formulate a 14-day catch-up milestone plan.',
      assignedAdvisorId: 'adv-2',
      assignedAdvisorName: 'Dr. Anita Deshmukh',
      dueDate: '2026-10-06T17:00:00Z',
      createdAt: '2026-09-28T10:15:00Z',
      updatedAt: '2026-09-29T14:30:00Z',
      notes: [
        {
          id: 'note-1',
          authorName: 'Dr. Anita Deshmukh',
          authorRole: 'advisor',
          date: '2026-09-29T14:30:00Z',
          text: 'Sent automated meeting reminder to student email and WhatsApp alert. Awaiting student response for Tuesday slot.'
        }
      ],
      timeline: [
        {
          id: 't-1',
          date: '2026-09-28T09:00:00Z',
          title: 'Critical Risk Signal Detected',
          details: 'Early Warning Agent triggered alert based on compound attendance and lab submission failure.',
          actor: 'Early Warning Agent',
          type: 'alert'
        },
        {
          id: 't-2',
          date: '2026-09-28T10:15:00Z',
          title: 'Intervention Plan Generated',
          details: 'Intervention Agent drafted 1-on-1 Academic Advising protocol with priority URGENT.',
          actor: 'Intervention Agent',
          type: 'action'
        },
        {
          id: 't-3',
          date: '2026-09-29T14:30:00Z',
          title: 'Advisor Review Note Added',
          details: 'Advisor reached out with calendar invite for Tuesday slot.',
          actor: 'Dr. Anita Deshmukh',
          type: 'note'
        }
      ]
    },
    {
      id: 'intv-102',
      studentId: 'std-1015',
      studentName: 'Sneha Reddy',
      studentDept: 'ECE',
      studentSemester: 3,
      riskLevel: 'high',
      riskScore: 72,
      type: 'Tutoring',
      status: 'Approved',
      priority: 'high',
      title: 'Peer Tutoring for Signals & Systems (EC301)',
      description: 'Struggling with Fourier and Laplace transforms in Signals & Systems. Midterm score was 48%.',
      aiGenerated: true,
      aiExplanation: 'Diagnostic assessment indicates conceptual gap in continuous-time frequency analysis. Tutoring in past cohorts improved pass rates by 34%.',
      contributingSignals: [
        'Signals & Systems quiz score 48% vs class avg 72%',
        'Homework 2 & 3 scored below 50%',
        'Student flagged difficulty during LMS self-assessment'
      ],
      recommendedAction: 'Pair with Department Peer Tutor (Rahul Sengupta, 7th sem) for 2 sessions per week until End-Sem exam.',
      assignedAdvisorId: 'adv-3',
      assignedAdvisorName: 'Prof. Venkat Subramaniam',
      dueDate: '2026-10-10T17:00:00Z',
      createdAt: '2026-09-25T11:00:00Z',
      updatedAt: '2026-09-26T09:45:00Z',
      notes: [
        {
          id: 'note-2',
          authorName: 'Prof. Venkat Subramaniam',
          authorRole: 'advisor',
          date: '2026-09-26T09:45:00Z',
          text: 'Approved intervention. Tutor assigned and confirmed first meeting on Oct 2nd at Central Library Room 204.'
        }
      ],
      timeline: [
        {
          id: 't-4',
          date: '2026-09-25T11:00:00Z',
          title: 'Risk Signal Triggered',
          details: 'High-risk threshold crossed following Quiz 2 grading.',
          actor: 'Monitoring Agent',
          type: 'alert'
        },
        {
          id: 't-5',
          date: '2026-09-26T09:45:00Z',
          title: 'Intervention Approved by Advisor',
          details: 'Prof. Venkat Subramaniam approved tutoring plan and designated peer tutor.',
          actor: 'Prof. Venkat Subramaniam',
          type: 'action'
        }
      ]
    },
    {
      id: 'intv-103',
      studentId: 'std-1025',
      studentName: 'Vikram Singh',
      studentDept: 'Mechanical',
      studentSemester: 4,
      riskLevel: 'critical',
      riskScore: 88,
      type: 'Faculty Meeting',
      status: 'In Progress',
      priority: 'urgent',
      title: 'Joint Faculty Review on Thermodynamics Lab Safety & Submissions',
      description: 'Missed 4 mandatory lab practicals. Risk of institutional debarment from semester final exam due to university 75% attendance rule.',
      aiGenerated: true,
      aiExplanation: 'Attendance is currently 58%, below statutory minimum of 75%. Without remedial attendance practicals, student will face academic penalty.',
      contributingSignals: [
        'Lab attendance is 58% (Threshold: 75%)',
        '4 experiment reports unsubmitted',
        'Sudden drop in general classroom responsiveness'
      ],
      recommendedAction: 'Convene immediate 3-party meeting with Dr. Ajay Mathur, Head of Department, and Student to determine remedial schedule.',
      assignedAdvisorId: 'adv-5',
      assignedAdvisorName: 'Prof. Ramesh Gokhale',
      dueDate: '2026-10-04T12:00:00Z',
      createdAt: '2026-09-20T08:30:00Z',
      updatedAt: '2026-09-28T16:00:00Z',
      notes: [
        {
          id: 'note-3',
          authorName: 'Prof. Ramesh Gokhale',
          authorRole: 'advisor',
          date: '2026-09-28T16:00:00Z',
          text: 'Meeting held on Sept 27. Student explained medical absence (dengue fever). Medical certificate submitted. 2 compensatory weekend labs scheduled.'
        }
      ],
      timeline: [
        {
          id: 't-6',
          date: '2026-09-20T08:30:00Z',
          title: 'Critical Debarment Alert Triggered',
          details: 'Early Warning Agent identified breach of 75% regulatory requirement.',
          actor: 'Early Warning Agent',
          type: 'alert'
        },
        {
          id: 't-7',
          date: '2026-09-22T10:00:00Z',
          title: 'Approved by HoD & Advisor',
          details: 'Formal hearing convened.',
          actor: 'Prof. Ramesh Gokhale',
          type: 'review'
        },
        {
          id: 't-8',
          date: '2026-09-27T15:00:00Z',
          title: 'Remedial Labs Approved',
          details: 'Student presented medical certificate and signed recovery agreement.',
          actor: 'Dr. Ajay Mathur',
          type: 'action'
        }
      ]
    },
    {
      id: 'intv-104',
      studentId: 'std-1035',
      studentName: 'Ananya Iyer',
      studentDept: 'Civil',
      studentSemester: 5,
      riskLevel: 'moderate',
      riskScore: 45,
      type: 'Career Guidance',
      status: 'Completed',
      priority: 'medium',
      title: 'Career Pathway Mentorship & Structural Software Certification',
      description: 'Student has solid GPA (8.1) but expressed uncertainty in career alignment. Recommend BIM & Revit certification roadmap.',
      aiGenerated: true,
      aiExplanation: 'Career Guidance Agent correlated strong performance in Structural Analysis with high industry placement demand in BIM technology.',
      contributingSignals: [
        'A+ in Structural Analysis I and Mechanics of Materials',
        'Student profile lacks industry technical certifications',
        'Expressed interest in infrastructure consultancy during survey'
      ],
      recommendedAction: 'Enroll student in sponsored Autodesk Revit & STAAD Pro university certification module.',
      assignedAdvisorId: 'adv-6',
      assignedAdvisorName: 'Dr. Shalini Hegde',
      dueDate: '2026-09-25T17:00:00Z',
      createdAt: '2026-09-10T11:00:00Z',
      updatedAt: '2026-09-26T18:00:00Z',
      notes: [
        {
          id: 'note-4',
          authorName: 'Dr. Shalini Hegde',
          authorRole: 'advisor',
          date: '2026-09-26T18:00:00Z',
          text: 'Student completed Level 1 Autodesk certification. Added to Department Placement Cell elite track.'
        }
      ],
      timeline: [
        {
          id: 't-9',
          date: '2026-09-10T11:00:00Z',
          title: 'Career Opportunity Detected',
          details: 'Career Guidance Agent mapped high academic score to certification pathway.',
          actor: 'Career Guidance Agent',
          type: 'alert'
        },
        {
          id: 't-10',
          date: '2026-09-26T18:00:00Z',
          title: 'Intervention Successfully Concluded',
          details: 'Certification verified and logged.',
          actor: 'Dr. Shalini Hegde',
          type: 'improvement'
        }
      ]
    },
    {
      id: 'intv-105',
      studentId: 'std-1001',
      studentName: 'Alex Kumar',
      studentDept: 'IT',
      studentSemester: 5,
      riskLevel: 'low',
      riskScore: 22,
      type: 'Attendance Support',
      status: 'Approved',
      priority: 'medium',
      title: 'Operating Systems (IT302) Friday Lab Attendance Check-in',
      description: 'Minor attendance decline noticed in 8:30 AM Friday session. Proactive notification sent to prevent risk escalation.',
      aiGenerated: true,
      aiExplanation: 'Attendance dropped from 94% to 78% in IT302 while remaining >92% in all other enrolled subjects. Pinpointed to scheduling conflict or morning commute.',
      contributingSignals: [
        'IT302 attendance at 78% (Overall attendance is 91%)',
        'Missed two consecutive Friday morning lab sessions'
      ],
      recommendedAction: 'Offer alternate Friday afternoon lab batch transfer or hybrid remote sync.',
      assignedAdvisorId: 'adv-1',
      assignedAdvisorName: 'Prof. Rajeshwar Kulkarni',
      dueDate: '2026-10-08T15:00:00Z',
      createdAt: '2026-09-29T08:00:00Z',
      updatedAt: '2026-09-29T10:00:00Z',
      notes: [
        {
          id: 'note-alex-1',
          authorName: 'Prof. Rajeshwar Kulkarni',
          authorRole: 'advisor',
          date: '2026-09-29T10:00:00Z',
          text: 'Approved proactive check-in. Alex informed he has an approved morning bus route delay. Transferred lab batch to 2:00 PM.'
        }
      ],
      timeline: [
        {
          id: 't-11',
          date: '2026-09-29T08:00:00Z',
          title: 'Proactive Alert Logged',
          details: 'Early Warning Agent caught isolated course drop before overall GPA impact.',
          actor: 'Early Warning Agent',
          type: 'alert'
        },
        {
          id: 't-12',
          date: '2026-09-29T10:00:00Z',
          title: 'Batch Adjusted & Resolved',
          details: 'Advisor approved lab switch.',
          actor: 'Prof. Rajeshwar Kulkarni',
          type: 'action'
        }
      ]
    }
  ];

  // AI Insights Center (Actionable Institutional Intelligence)
  const aiInsights: AIInsight[] = [
    {
      id: 'ins-1',
      title: 'Attendance Decline Detected in Semester 3 IT Cohort',
      type: 'emerging_signal',
      department: 'IT',
      evidence: '14 out of 62 students in IT 3rd semester demonstrated a >12% drop in Tuesday morning sessions over the past 3 weeks.',
      date: '2026-09-30',
      confidence: 94,
      suggestedAction: 'Review Tuesday schedule layout; faculty check-in for IT302 Operating Systems scheduled.',
      affectedCount: 14
    },
    {
      id: 'ins-2',
      title: 'Students Missing >3 Assignments Show 4.2x Increased Risk of Semester Probation',
      type: 'performance_pattern',
      department: 'Institution-wide',
      evidence: 'Historical regression across 1,840 student records shows 78% correlation between 3+ missing assignments in week 4-6 and end-semester failure.',
      date: '2026-09-28',
      confidence: 96,
      suggestedAction: 'Trigger automatic intervention prompt after student misses 2nd consecutive assignment.',
      affectedCount: 38
    },
    {
      id: 'ins-3',
      title: '18 Students in CSE & ECE May Benefit from Early Peer Tutoring',
      type: 'intervention_opportunity',
      department: 'CSE',
      evidence: 'Early Warning Agent identified common difficulty patterns in Data Structures Recursion & Signals Fourier analysis.',
      date: '2026-09-29',
      confidence: 91,
      suggestedAction: 'Broadcast peer tutoring schedule and reserve Central Library Discussion Rooms A & B.',
      affectedCount: 18
    },
    {
      id: 'ins-4',
      title: 'Assignment Completion Improved by 9.4% Across Mechanical Department',
      type: 'positive_trend',
      department: 'Mechanical',
      evidence: 'Following introduction of digital LMS rubric reminders, on-time submissions increased from 74% to 83.4% in 30 days.',
      date: '2026-09-27',
      confidence: 98,
      suggestedAction: 'Share rubric notification template with Civil and EEE department chairs.',
      affectedCount: 142
    },
    {
      id: 'ins-5',
      title: 'Sudden Performance Disparity in Theory of Computation (CS404)',
      type: 'emerging_signal',
      department: 'CSE',
      evidence: 'Midterm failure rate reached 21% compared to historical average of 11%. High student drop-off in Turing Machine questions.',
      date: '2026-09-25',
      confidence: 89,
      suggestedAction: 'Organize supplementary faculty review lecture and practice mock exam before End-Sem.',
      affectedCount: 25
    }
  ];

  // AI Agent Activity Stream
  const agentActivity: AgentActivityItem[] = [
    {
      id: 'act-1',
      agentName: 'Academic Monitoring Agent',
      action: 'Analyzed 428 continuous student academic records across 6 engineering departments',
      timestamp: 'Just now',
      status: 'completed',
      metricHighlight: '428 records scanned'
    },
    {
      id: 'act-2',
      agentName: 'Early Warning Agent',
      action: 'Identified 12 new risk signals and calibrated multi-factor risk scores',
      timestamp: '4 mins ago',
      status: 'completed',
      metricHighlight: '12 new signals'
    },
    {
      id: 'act-3',
      agentName: 'Study Coach Agent',
      action: 'Generated 7 personalized weekly study plans targeting upcoming midterm exams',
      timestamp: '18 mins ago',
      status: 'completed',
      metricHighlight: '7 study plans built'
    },
    {
      id: 'act-4',
      agentName: 'Intervention Agent',
      action: 'Drafted 5 recommended academic interventions awaiting advisor review',
      timestamp: '32 mins ago',
      status: 'completed',
      metricHighlight: '5 awaiting human review'
    },
    {
      id: 'act-5',
      agentName: 'Communication Agent',
      action: 'Prepared 14 advisor check-in notifications and parent alert summaries',
      timestamp: '1 hour ago',
      status: 'completed',
      metricHighlight: '14 alerts prepared'
    },
    {
      id: 'act-6',
      agentName: 'Career Guidance Agent',
      action: 'Mapped 34 high-performing students to recommended AWS & Cadence industry certifications',
      timestamp: '2 hours ago',
      status: 'completed',
      metricHighlight: '34 pathway updates'
    }
  ];

  // Notifications
  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      recipientUserId: 'usr-student-1',
      title: 'Operating Systems Attendance Notice',
      message: 'Your attendance in IT302 dropped to 78%. Advisor check-in has been scheduled to resolve Friday lab timing.',
      type: 'attendance',
      priority: 'high',
      isRead: false,
      timestamp: '2026-10-01T08:30:00Z',
      linkUrl: '/study-planner'
    },
    {
      id: 'notif-2',
      recipientUserId: 'usr-student-1',
      title: 'Success Copilot Study Plan Ready',
      message: 'New personalized 7-day study plan generated focusing on Operating Systems & AI/ML midterm prep.',
      type: 'ai_recommendation',
      priority: 'normal',
      isRead: false,
      timestamp: '2026-09-30T16:00:00Z',
      linkUrl: '/study-planner'
    },
    {
      id: 'notif-3',
      recipientUserId: 'usr-student-1',
      title: 'Upcoming Exam: Machine Learning Midterm 2',
      message: 'Scheduled on October 14, 2026 in Room 302. Syllabus covers Neural Networks & SVMs.',
      type: 'exam',
      priority: 'high',
      isRead: true,
      timestamp: '2026-09-28T09:00:00Z',
      linkUrl: '/courses'
    },
    {
      id: 'notif-4',
      recipientRole: 'advisor',
      title: 'High Risk Alert: 3 Students Require Attention',
      message: 'Early Warning Agent identified critical attendance drops for Rohan Verma and Vikram Singh.',
      type: 'risk_alert',
      priority: 'urgent',
      isRead: false,
      timestamp: '2026-10-01T07:15:00Z',
      linkUrl: '/early-warning-queue'
    },
    {
      id: 'notif-5',
      recipientRole: 'admin',
      title: 'Monthly Retention & Early Warning Report Generated',
      message: 'Overall institutional retention benchmark reached 94.2%. 18 pending interventions require HoD review.',
      type: 'intervention',
      priority: 'normal',
      isRead: false,
      timestamp: '2026-09-30T18:00:00Z',
      linkUrl: '/admin-dashboard'
    }
  ];

  // Goals for Alex Kumar
  const goals: Goal[] = [
    {
      id: 'goal-1',
      studentId: 'std-1001',
      title: 'Increase Current GPA from 8.42 to 8.85',
      category: 'gpa',
      currentVal: 8.42,
      targetVal: 8.85,
      metricUnit: 'GPA',
      deadline: '2026-12-20',
      progressPct: 68,
      aiRecommendations: [
        'Score 88%+ in Operating Systems End-Sem to boost subject grade from B+ to A',
        'Maintain >90% in Machine Learning & Cloud Computing projects',
        'Dedicate 4 hours weekly to OS Kernel memory management exercises'
      ],
      status: 'in_progress'
    },
    {
      id: 'goal-2',
      studentId: 'std-1001',
      title: 'Restore Operating Systems Attendance to >85%',
      category: 'attendance',
      currentVal: 78,
      targetVal: 85,
      metricUnit: '%',
      deadline: '2026-10-30',
      progressPct: 52,
      aiRecommendations: [
        'Attend next 6 consecutive Friday afternoon labs without absence',
        'Log into LMS virtual sync for supplementary module verification'
      ],
      status: 'in_progress'
    },
    {
      id: 'goal-3',
      studentId: 'std-1001',
      title: 'Complete AWS Certified Solutions Architect Associate',
      category: 'certification',
      currentVal: 70,
      targetVal: 100,
      metricUnit: '% Module',
      deadline: '2026-11-15',
      progressPct: 70,
      aiRecommendations: [
        'Finish VPC & IAM security practice exams on AWS Skill Builder',
        'Deploy sample microservice architecture as semester capstone'
      ],
      status: 'in_progress'
    }
  ];

  // Study Plan for Alex Kumar
  const studyPlans: StudyPlan[] = [
    {
      id: 'plan-101',
      studentId: 'std-1001',
      title: 'Personalized Midterm Recovery & Excellence Roadmap',
      weekRange: 'Oct 02 - Oct 08, 2026',
      targetGpa: 8.85,
      focusAreas: ['Operating Systems (Process Synchronization)', 'Machine Learning (Backpropagation)', 'Computer Networks (TCP Congestion Control)'],
      aiGenerated: true,
      generatedBy: 'Study Coach Agent',
      createdAt: '2026-09-30T14:00:00Z',
      dailySchedule: [
        {
          day: 'Monday',
          date: '2026-10-02',
          tasks: [
            { id: 'tsk-1', subject: 'Operating Systems', topic: 'Semaphores & Mutex Locks in C', durationMinutes: 90, priority: 'high', completed: true, type: 'practice' },
            { id: 'tsk-2', subject: 'Machine Learning', topic: 'Derivation of Gradient Descent', durationMinutes: 60, priority: 'medium', completed: true, type: 'revision' }
          ]
        },
        {
          day: 'Tuesday',
          date: '2026-10-03',
          tasks: [
            { id: 'tsk-3', subject: 'Computer Networks', topic: 'Sliding Window Protocol & Flow Control', durationMinutes: 75, priority: 'medium', completed: false, type: 'lecture_prep' },
            { id: 'tsk-4', subject: 'Operating Systems', topic: 'Classic Dining Philosophers Problem', durationMinutes: 60, priority: 'high', completed: false, type: 'practice' }
          ]
        },
        {
          day: 'Wednesday',
          date: '2026-10-04',
          tasks: [
            { id: 'tsk-5', subject: 'Machine Learning', topic: 'Hyperparameter Tuning with PyTorch', durationMinutes: 90, priority: 'high', completed: false, type: 'assignment' },
            { id: 'tsk-6', subject: 'Data Structures', topic: 'Red-Black Trees & AVL Self-Balancing', durationMinutes: 60, priority: 'medium', completed: false, type: 'revision' }
          ]
        },
        {
          day: 'Thursday',
          date: '2026-10-05',
          tasks: [
            { id: 'tsk-7', subject: 'Operating Systems', topic: 'Virtual Memory & Page Replacement Algorithms', durationMinutes: 90, priority: 'high', completed: false, type: 'practice' },
            { id: 'tsk-8', subject: 'Cloud Computing', topic: 'Docker Containerization & Kubernetes Pods', durationMinutes: 60, priority: 'low', completed: false, type: 'practice' }
          ]
        },
        {
          day: 'Friday',
          date: '2026-10-06',
          tasks: [
            { id: 'tsk-9', subject: 'Operating Systems', topic: 'Friday Lab Session (Transferred Afternoon Batch)', durationMinutes: 120, priority: 'high', completed: false, type: 'practice' },
            { id: 'tsk-10', subject: 'Weekly Assessment', topic: 'Mock Quiz on OS & Networks', durationMinutes: 45, priority: 'medium', completed: false, type: 'revision' }
          ]
        },
        {
          day: 'Saturday',
          date: '2026-10-07',
          tasks: [
            { id: 'tsk-11', subject: 'AI Project', topic: 'Mini Project Sprint: Student Risk Classification Model', durationMinutes: 150, priority: 'high', completed: false, type: 'assignment' }
          ]
        },
        {
          day: 'Sunday',
          date: '2026-10-08',
          tasks: [
            { id: 'tsk-12', subject: 'Self-Review', topic: 'Weekly Progress Review & Success Copilot Feedback', durationMinutes: 45, priority: 'low', completed: false, type: 'revision' }
          ]
        }
      ]
    }
  ];

  // Audit Logs for Admin
  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      timestamp: '2026-10-01T09:42:15Z',
      userId: 'usr-advisor-1',
      userName: 'Prof. Rajeshwar Kulkarni',
      userRole: 'advisor',
      action: 'Approve Intervention',
      resource: 'Student #ST2024-1001 (Alex Kumar)',
      result: 'success',
      details: 'Approved Friday Lab schedule transfer and closed Attendance Support workflow.',
      ipAddress: '192.168.10.45'
    },
    {
      id: 'log-2',
      timestamp: '2026-10-01T08:15:30Z',
      userId: 'usr-admin-1',
      userName: 'Dr. Meenakshi Sundaram',
      userRole: 'admin',
      action: 'Configure Threshold',
      resource: 'Early Warning Thresholds',
      result: 'success',
      details: 'Updated regulatory minimum attendance trigger from 70% to 75%.',
      ipAddress: '192.168.1.12'
    },
    {
      id: 'log-3',
      timestamp: '2026-09-30T17:22:04Z',
      userId: 'usr-advisor-1',
      userName: 'Dr. Anita Deshmukh',
      userRole: 'advisor',
      action: 'Generate Study Plan',
      resource: 'Student #ST2024-1009 (Rohan Verma)',
      result: 'success',
      details: 'Study Coach Agent generated 14-day intensive catch-up schedule.',
      ipAddress: '192.168.10.88'
    },
    {
      id: 'log-4',
      timestamp: '2026-09-30T14:10:19Z',
      userId: 'usr-faculty-1',
      userName: 'Dr. Sunita Ramanathan',
      userRole: 'faculty',
      action: 'Broadcast Announcement',
      resource: 'CS301 Data Structures',
      result: 'success',
      details: 'Sent reminder regarding upcoming Binary Search Tree assignment submission.',
      ipAddress: '192.168.15.22'
    },
    {
      id: 'log-5',
      timestamp: '2026-09-29T11:05:00Z',
      userId: 'usr-admin-1',
      userName: 'Dr. Meenakshi Sundaram',
      userRole: 'admin',
      action: 'Batch CSV Import',
      resource: 'Semester 1 Enrolment Roster',
      result: 'success',
      details: 'Successfully validated and ingested 240 student grade & attendance records.',
      ipAddress: '192.168.1.12'
    }
  ];

  return {
    users,
    students,
    courses,
    enrollments,
    interventions,
    aiInsights,
    agentActivity,
    notifications,
    goals,
    studyPlans,
    auditLogs,
    advisors,
    facultyList
  };
}
