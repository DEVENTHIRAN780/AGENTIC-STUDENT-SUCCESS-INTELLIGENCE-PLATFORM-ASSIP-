import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';
import { AgentOrchestrator } from '../agents/AgentOrchestrator.js';
import { StudyCoachAgent } from '../agents/StudyCoachAgent.js';
import { InterventionAgent } from '../agents/InterventionAgent.js';
import { EarlyWarningAgent } from '../agents/EarlyWarningAgent.js';

const router = Router();

// POST /api/ai/analyze-student
router.post('/analyze-student', (req: Request, res: Response): void => {
  const { studentId } = req.body;
  if (!studentId) {
    res.status(400).json({ error: 'studentId is required.' });
    return;
  }

  const report = AgentOrchestrator.runFullAnalysis(studentId);
  if (!report) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  res.json(report);
});

// POST /api/ai/generate-study-plan
router.post('/generate-study-plan', (req: Request, res: Response): void => {
  const { studentId } = req.body;
  const targetId = studentId || 'std-1001';
  const student = db.getStudentById(targetId);

  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByStudent(student.id);
  const goals = db.getGoals(student.id);
  const newPlan = StudyCoachAgent.generatePersonalizedStudyPlan(student, enrollments, goals);

  db.createStudyPlan(newPlan);

  db.logAgentActivity({
    agentName: 'Study Coach Agent',
    action: `Generated tailored 7-day milestone study plan for ${student.name} (${student.studentId})`,
    timestamp: 'Just now',
    status: 'completed',
    metricHighlight: 'New Study Plan'
  });

  res.status(201).json(newPlan);
});

// POST /api/ai/generate-intervention
router.post('/generate-intervention', (req: Request, res: Response): void => {
  const { studentId } = req.body;
  const targetId = studentId || 'std-1001';
  const student = db.getStudentById(targetId);

  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByStudent(student.id);
  const assessment = EarlyWarningAgent.evaluate(student, enrollments);
  const proposed = InterventionAgent.recommend(student, enrollments, assessment);

  db.createIntervention(proposed);

  db.logAgentActivity({
    agentName: 'Intervention Agent',
    action: `Drafted ${proposed.priority.toUpperCase()} intervention proposal for ${student.name}. Awaiting human review.`,
    timestamp: 'Just now',
    status: 'completed',
    metricHighlight: proposed.type
  });

  res.status(201).json(proposed);
});

// POST /api/ai/chat (Success Copilot)
router.post('/chat', (req: Request, res: Response): void => {
  const { studentId = 'std-1001', message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  const response = AgentOrchestrator.chatWithCopilot(studentId, message);

  db.logAgentActivity({
    agentName: 'Success Copilot',
    action: `Assisted student with query: "${message.substring(0, 36)}..."`,
    timestamp: 'Just now',
    status: 'completed'
  });

  res.json(response);
});

// GET /api/ai/insights
router.get('/insights', (_req: Request, res: Response): void => {
  const insights = db.getAIInsights();
  res.json({ insights });
});

// GET /api/ai/agent-activity
router.get('/agent-activity', (_req: Request, res: Response): void => {
  const activities = db.getAgentActivity();
  res.json({ activities });
});

export default router;
