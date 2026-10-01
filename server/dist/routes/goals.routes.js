"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// GET /api/goals
router.get('/', (req, res) => {
    const { studentId = 'std-1001' } = req.query;
    const goals = store_js_1.db.getGoals(studentId);
    res.json({ goals });
});
// POST /api/goals
router.post('/', (req, res) => {
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
        status: (progressPct >= 100 ? 'completed' : 'in_progress')
    };
    store_js_1.db.createGoal(newGoal);
    res.status(201).json(newGoal);
});
// PATCH /api/goals/:id
router.patch('/:id', (req, res) => {
    const { currentVal, status } = req.body;
    const goal = store_js_1.db.goals.find(g => g.id === req.params.id);
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
exports.default = router;
