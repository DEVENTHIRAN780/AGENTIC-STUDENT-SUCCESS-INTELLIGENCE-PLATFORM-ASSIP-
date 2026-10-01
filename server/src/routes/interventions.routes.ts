import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';
import { Intervention, InterventionStatus } from '../types/index.js';

const router = Router();

// GET /api/interventions
router.get('/', (req: Request, res: Response): void => {
  const { status, riskLevel, department, advisorId, studentId } = req.query;

  const items = db.getInterventions({
    status: status as string,
    riskLevel: riskLevel as string,
    department: department as string,
    advisorId: advisorId as string,
    studentId: studentId as string
  });

  res.json({
    total: items.length,
    interventions: items
  });
});

// GET /api/interventions/:id
router.get('/:id', (req: Request, res: Response): void => {
  const item = db.getInterventionById(req.params.id as string);
  if (!item) {
    res.status(404).json({ error: 'Intervention not found.' });
    return;
  }
  res.json(item);
});

// POST /api/interventions
router.post('/', (req: Request, res: Response): void => {
  const {
    studentId,
    type,
    title,
    description,
    priority = 'medium',
    assignedAdvisorId,
    assignedAdvisorName,
    dueDate,
    recommendedAction
  } = req.body;

  const student = db.getStudentById(studentId);
  if (!student) {
    res.status(404).json({ error: 'Target student not found.' });
    return;
  }

  const newIntervention: Intervention = {
    id: `intv-${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    studentDept: student.department,
    studentSemester: student.semester,
    riskLevel: student.riskLevel,
    riskScore: student.riskScore,
    type: type || 'Academic Advising',
    status: 'Pending Review',
    priority: priority || 'medium',
    title: title || `Intervention for ${student.name}`,
    description: description || 'Intervention logged by academic staff.',
    aiGenerated: false,
    aiExplanation: 'Manual intervention created by institutional staff.',
    contributingSignals: [student.primarySignal],
    recommendedAction: recommendedAction || 'Convene 1-on-1 advisor review session.',
    assignedAdvisorId: assignedAdvisorId || student.advisorId,
    assignedAdvisorName: assignedAdvisorName || student.advisorName,
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    timeline: [
      {
        id: `tl-${Date.now()}`,
        date: new Date().toISOString(),
        title: 'Intervention Protocol Logged',
        details: description || 'Intervention created.',
        actor: assignedAdvisorName || 'Academic Advisor',
        type: 'action'
      }
    ]
  };

  db.createIntervention(newIntervention);

  db.createAuditLog({
    userId: 'system',
    userName: assignedAdvisorName || 'Advisor',
    userRole: 'advisor',
    action: 'Create Intervention',
    resource: `Student ${student.studentId}`,
    result: 'success',
    details: `Created intervention "${newIntervention.title}" [${newIntervention.priority.toUpperCase()}]`,
    ipAddress: req.ip || '127.0.0.1'
  });

  res.status(201).json(newIntervention);
});

// PATCH /api/interventions/:id/status (Human-in-the-loop review)
router.patch('/:id/status', (req: Request, res: Response): void => {
  const { status, actorName = 'Academic Advisor', noteText, outcome } = req.body;

  if (!status) {
    res.status(400).json({ error: 'Status is required.' });
    return;
  }

  const updated = db.updateInterventionStatus(
    req.params.id as string, 
    status as InterventionStatus, 
    actorName, 
    noteText,
    outcome
  );

  if (!updated) {
    res.status(404).json({ error: 'Intervention not found.' });
    return;
  }

  // Audit log human action
  db.createAuditLog({
    userId: 'advisor-actor',
    userName: actorName,
    userRole: 'advisor',
    action: `${status} Intervention`,
    resource: `Intervention #${updated.id} (${updated.studentName})`,
    result: 'success',
    details: noteText || `Intervention status transitioned to ${status}`,
    ipAddress: req.ip || '127.0.0.1'
  });

  res.json(updated);
});

// POST /api/interventions/:id/notes
router.post('/:id/notes', (req: Request, res: Response): void => {
  const { text, authorName = 'Academic Advisor', authorRole = 'advisor' } = req.body;

  if (!text) {
    res.status(400).json({ error: 'Note text is required.' });
    return;
  }

  const updated = db.addInterventionNote(req.params.id as string, {
    authorName,
    authorRole,
    text
  });

  if (!updated) {
    res.status(404).json({ error: 'Intervention not found.' });
    return;
  }

  res.json(updated);
});

export default router;
