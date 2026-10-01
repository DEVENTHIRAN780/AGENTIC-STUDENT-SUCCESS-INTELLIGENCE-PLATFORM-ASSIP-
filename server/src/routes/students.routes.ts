import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';
import { AcademicMonitoringAgent } from '../agents/AcademicMonitoringAgent.js';
import { EarlyWarningAgent } from '../agents/EarlyWarningAgent.js';
import { AcademicPlanningAgent } from '../agents/AcademicPlanningAgent.js';
import { CareerGuidanceAgent } from '../agents/CareerGuidanceAgent.js';
import { AgentOrchestrator } from '../agents/AgentOrchestrator.js';

const router = Router();

// GET /api/students
router.get('/', (req: Request, res: Response): void => {
  const { department, semester, riskLevel, search, page = '1', limit = '50' } = req.query;

  const filtered = db.getStudents({
    department: department as string,
    semester: semester ? Number(semester) : undefined,
    riskLevel: riskLevel as string,
    search: search as string
  });

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(startIndex, startIndex + limitNum);

  res.json({
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    students: paginated
  });
});

// GET /api/students/:id (Student 360 Profile)
router.get('/:id', (req: Request, res: Response): void => {
  const student = db.getStudentById(req.params.id as string);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByStudent(student.id);
  const interventions = db.getInterventions({ studentId: student.id });
  const goals = db.getGoals(student.id);
  const studyPlans = db.getStudyPlans(student.id);

  // Run intelligence agents
  const monitoring = AcademicMonitoringAgent.analyze(student, enrollments);
  const assessment = EarlyWarningAgent.evaluate(student, enrollments);
  const career = CareerGuidanceAgent.mapCareerPathways(student, enrollments);
  const roadmap = AcademicPlanningAgent.generatePlan(student, db.courses);

  res.json({
    student,
    enrollments,
    monitoring,
    assessment,
    interventions,
    goals,
    studyPlans,
    career,
    roadmap
  });
});

// GET /api/students/:id/performance
router.get('/:id/performance', (req: Request, res: Response): void => {
  const student = db.getStudentById(req.params.id as string);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByStudent(student.id);

  // Generate realistic GPA trend per semester up to current
  const gpaTrend = [];
  const baseGpa = Math.max(5.0, student.gpa - (student.semester * 0.12));
  for (let s = 1; s <= student.semester; s++) {
    const variance = (s === student.semester) ? (student.gpa - baseGpa) : ((s * 0.15) + (s % 2 === 0 ? 0.2 : -0.1));
    gpaTrend.push({
      semester: `Sem ${s}`,
      gpa: Number((baseGpa + variance).toFixed(2)),
      cohortAvg: Number((7.4 + (s * 0.05)).toFixed(2))
    });
  }

  // Attendance trend (weekly for last 8 weeks)
  const attendanceTrend = [
    { week: 'W1', attendance: student.attendancePct + 4, benchmark: 85 },
    { week: 'W2', attendance: student.attendancePct + 2, benchmark: 85 },
    { week: 'W3', attendance: student.attendancePct + 1, benchmark: 85 },
    { week: 'W4', attendance: student.attendancePct - 3, benchmark: 85 },
    { week: 'W5', attendance: student.attendancePct - 5, benchmark: 85 },
    { week: 'W6', attendance: student.attendancePct - 2, benchmark: 85 },
    { week: 'W7', attendance: student.attendancePct + 1, benchmark: 85 },
    { week: 'W8', attendance: student.attendancePct, benchmark: 85 }
  ];

  // Radar competencies
  const radarData = [
    { subject: 'Theory', score: Math.round(student.gpa * 10), benchmark: 75 },
    { subject: 'Lab / Practical', score: Math.round(student.attendancePct * 0.95), benchmark: 80 },
    { subject: 'Assignments', score: Math.round(enrollments.reduce((acc, e) => acc + (e.assignmentsCompleted/e.totalAssignments)*100, 0) / (enrollments.length || 1)), benchmark: 85 },
    { subject: 'Attendance', score: student.attendancePct, benchmark: 85 },
    { subject: 'Midterm', score: Math.round(enrollments.reduce((acc, e) => acc + e.midtermScore, 0) / (enrollments.length || 1)), benchmark: 72 },
    { subject: 'LMS Engagement', score: Math.min(98, Math.round(student.academicHealth * 1.05)), benchmark: 78 }
  ];

  res.json({
    studentId: student.id,
    gpa: student.gpa,
    cgpa: student.cgpa,
    attendancePct: student.attendancePct,
    academicHealth: student.academicHealth,
    gpaTrend,
    attendanceTrend,
    radarData,
    enrollments
  });
});

// GET /api/students/:id/risk
router.get('/:id/risk', (req: Request, res: Response): void => {
  const student = db.getStudentById(req.params.id as string);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByStudent(student.id);
  const assessment = EarlyWarningAgent.evaluate(student, enrollments);

  res.json(assessment);
});

// GET /api/students/:id/recommendations
router.get('/:id/recommendations', (req: Request, res: Response): void => {
  const report = AgentOrchestrator.runFullAnalysis(req.params.id as string);
  if (!report) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }
  res.json(report);
});

// GET /api/students/:id/career
router.get('/:id/career', (req: Request, res: Response): void => {
  const student = db.getStudentById(req.params.id as string);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }
  const enrollments = db.getEnrollmentsByStudent(student.id);
  const career = CareerGuidanceAgent.mapCareerPathways(student, enrollments);
  res.json(career);
});

// GET /api/students/:id/roadmap
router.get('/:id/roadmap', (req: Request, res: Response): void => {
  const student = db.getStudentById(req.params.id as string);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }
  const roadmap = AcademicPlanningAgent.generatePlan(student, db.courses);
  res.json(roadmap);
});

export default router;
