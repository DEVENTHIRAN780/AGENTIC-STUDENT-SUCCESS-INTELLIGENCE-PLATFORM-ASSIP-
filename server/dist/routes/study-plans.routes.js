"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// GET /api/study-plans
router.get('/', (req, res) => {
    const { studentId = 'std-1001' } = req.query;
    const plans = store_js_1.db.getStudyPlans(studentId);
    res.json({ plans });
});
// POST /api/study-plans
router.post('/', (req, res) => {
    const { studentId = 'std-1001', title, weekRange, targetGpa, focusAreas, dailySchedule } = req.body;
    const plan = {
        id: `plan-${Date.now()}`,
        studentId,
        title: title || 'Custom Study Plan',
        weekRange: weekRange || 'Current Week',
        targetGpa: targetGpa || 8.5,
        focusAreas: focusAreas || ['Core Technical Mastery', 'Exam Preparation'],
        dailySchedule: dailySchedule || [],
        aiGenerated: false,
        generatedBy: 'Student',
        createdAt: new Date().toISOString()
    };
    store_js_1.db.createStudyPlan(plan);
    res.status(201).json(plan);
});
// PATCH /api/study-plans/:id/tasks/:taskId
router.patch('/:id/tasks/:taskId', (req, res) => {
    const { id, taskId } = req.params;
    const { completed } = req.body;
    const plan = store_js_1.db.studyPlans.find(p => p.id === id);
    if (!plan) {
        res.status(404).json({ error: 'Study plan not found.' });
        return;
    }
    let found = false;
    plan.dailySchedule.forEach(day => {
        day.tasks.forEach(task => {
            if (task.id === taskId) {
                task.completed = completed !== undefined ? completed : !task.completed;
                found = true;
            }
        });
    });
    if (!found) {
        res.status(404).json({ error: 'Task not found in plan.' });
        return;
    }
    res.json({ success: true, plan });
});
exports.default = router;
