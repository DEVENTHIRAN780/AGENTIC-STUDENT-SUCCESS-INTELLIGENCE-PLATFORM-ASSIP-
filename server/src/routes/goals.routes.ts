import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';

const router = Router();

// GET /api/goals
router.get('/', (req: Request, res: Response): void => {
  const { studentId = 'std-1001' } = req.query;
  const goals = db.getGoals(studentId as string);
  res.json({ goals });
});

// POST /api/goals
router.post('/', (req: Request, res: Response): void => {
  const { studentId = 'std-1001', title, category, currentVal, targetVal, metricUnit, deadline } = req.body;

  if (!title || !targetVal) {
    res.status(400).json({ error: 'Title and target value are required.' });
    return;
  }

  const current = currentVal !== undefined ? Number(currentVal) : 0;
  const target = Number(targetVal);
  const progressPct = target > current ? Math.min(100, Math.round((current / target) * 100)) : 100;

  const newGoal = {
    id: `goal-${Date.now()}`,
    studentId,
    title,
    category: category || 'gpa',
    currentVal: current,
    targetVal: target,
    metricUnit: metricUnit || '',
    deadline: deadline || '2026-12-31',
    progressPct,
    aiRecommendations: [
      `Maintain regular check-ins to stay on pace for target ${target} ${metricUnit || ''}.`,
      'Dedicate 3 focused practice blocks weekly to high-leverage milestones.'
    ],
    status: (progressPct >= 100 ? 'completed' : 'in_progress') as any
  };

  db.createGoal(newGoal);
  res.status(201).json(newGoal);
});

// PATCH /api/goals/:id
router.patch('/:id', (req: Request, res: Response): void => {
  const { currentVal, status } = req.body;
  const goal = db.goals.find(g => g.id === req.params.id);

  if (!goal) {
    res.status(404).json({ error: 'Goal not found.' });
    return;
  }

  if (currentVal !== undefined) {
    goal.currentVal = Number(currentVal);
    goal.progressPct = Math.min(100, Math.round((goal.currentVal / goal.targetVal) * 100));
    if (goal.progressPct >= 100) {
      goal.status = 'completed';
    }
  }

  if (status) {
    goal.status = status;
  }

  res.json(goal);
});

export default router;
