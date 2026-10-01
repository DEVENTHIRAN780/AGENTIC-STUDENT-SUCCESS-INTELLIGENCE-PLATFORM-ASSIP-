"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const AgentOrchestrator_js_1 = require("../agents/AgentOrchestrator.js");
const StudyCoachAgent_js_1 = require("../agents/StudyCoachAgent.js");
const InterventionAgent_js_1 = require("../agents/InterventionAgent.js");
const EarlyWarningAgent_js_1 = require("../agents/EarlyWarningAgent.js");
const router = (0, express_1.Router)();
// POST /api/ai/analyze-student
router.post('/analyze-student', (req, res) => {
    const { studentId } = req.body;
    if (!studentId) {
        res.status(400).json({ error: 'studentId is required.' });
        return;
    }
    const report = AgentOrchestrator_js_1.AgentOrchestrator.runFullAnalysis(studentId);
    if (!report) {
        res.status(404).json({ error: 'Student not found.' });
        return;
    }
    res.json(report);
});
// POST /api/ai/generate-study-plan
router.post('/generate-study-plan', (req, res) => {
    const { studentId } = req.body;
    const targetId = studentId || 'std-1001';
    const student = store_js_1.db.getStudentById(targetId);
    if (!student) {
        res.status(404).json({ error: 'Student not found.' });
        return;
    }
    const enrollments = store_js_1.db.getEnrollmentsByStudent(student.id);
    const goals = store_js_1.db.getGoals(student.id);
    const newPlan = StudyCoachAgent_js_1.StudyCoachAgent.generatePersonalizedStudyPlan(student, enrollments, goals);
    store_js_1.db.createStudyPlan(newPlan);
    store_js_1.db.logAgentActivity({
        agentName: 'Study Coach Agent',
        action: `Generated tailored 7-day milestone study plan for ${student.name} (${student.studentId})`,
        timestamp: 'Just now',
        status: 'completed',
        metricHighlight: 'New Study Plan'
    });
    res.status(201).json(newPlan);
});
// POST /api/ai/generate-intervention
router.post('/generate-intervention', (req, res) => {
    const { studentId } = req.body;
    const targetId = studentId || 'std-1001';
    const student = store_js_1.db.getStudentById(targetId);
    if (!student) {
        res.status(404).json({ error: 'Student not found.' });
        return;
    }
    const enrollments = store_js_1.db.getEnrollmentsByStudent(student.id);
    const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(student, enrollments);
    const proposed = InterventionAgent_js_1.InterventionAgent.recommend(student, enrollments, assessment);
    store_js_1.db.createIntervention(proposed);
    store_js_1.db.logAgentActivity({
        agentName: 'Intervention Agent',
        action: `Drafted ${proposed.priority.toUpperCase()} intervention proposal for ${student.name}. Awaiting human review.`,
        timestamp: 'Just now',
        status: 'completed',
        metricHighlight: proposed.type
    });
    res.status(201).json(proposed);
});
// POST /api/ai/chat (Success Copilot)
router.post('/chat', (req, res) => {
    const { studentId = 'std-1001', message } = req.body;
    if (!message) {
        res.status(400).json({ error: 'Message is required.' });
        return;
    }
    const response = AgentOrchestrator_js_1.AgentOrchestrator.chatWithCopilot(studentId, message);
    store_js_1.db.logAgentActivity({
        agentName: 'Success Copilot',
        action: `Assisted student with query: "${message.substring(0, 36)}..."`,
        timestamp: 'Just now',
        status: 'completed'
    });
    res.json(response);
});
// GET /api/ai/insights
router.get('/insights', (_req, res) => {
    const insights = store_js_1.db.getAIInsights();
    res.json({ insights });
});
// GET /api/ai/agent-activity
router.get('/agent-activity', (_req, res) => {
    const activities = store_js_1.db.getAgentActivity();
    res.json({ activities });
});
exports.default = router;
