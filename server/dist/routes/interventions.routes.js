"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// GET /api/interventions
router.get('/', (req, res) => {
    const { status, riskLevel, department, advisorId, studentId } = req.query;
    const items = store_js_1.db.getInterventions({
        status: status,
        riskLevel: riskLevel,
        department: department,
        advisorId: advisorId,
        studentId: studentId
    });
    res.json({
        total: items.length,
        interventions: items
    });
});
// GET /api/interventions/:id
router.get('/:id', (req, res) => {
    const item = store_js_1.db.getInterventionById(req.params.id);
    if (!item) {
        res.status(404).json({ error: 'Intervention not found.' });
        return;
    }
    res.json(item);
});
// POST /api/interventions
router.post('/', (req, res) => {
    const { studentId, type, title, description, priority = 'medium', assignedAdvisorId, assignedAdvisorName, dueDate, recommendedAction } = req.body;
    const student = store_js_1.db.getStudentById(studentId);
    if (!student) {
        res.status(404).json({ error: 'Target student not found.' });
        return;
    }
    const newIntervention = {
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
    store_js_1.db.createIntervention(newIntervention);
    store_js_1.db.createAuditLog({
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
router.patch('/:id/status', (req, res) => {
    const { status, actorName = 'Academic Advisor', noteText, outcome } = req.body;
    if (!status) {
        res.status(400).json({ error: 'Status is required.' });
        return;
    }
    const updated = store_js_1.db.updateInterventionStatus(req.params.id, status, actorName, noteText, outcome);
    if (!updated) {
        res.status(404).json({ error: 'Intervention not found.' });
        return;
    }
    // Audit log human action
    store_js_1.db.createAuditLog({
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
router.post('/:id/notes', (req, res) => {
    const { text, authorName = 'Academic Advisor', authorRole = 'advisor' } = req.body;
    if (!text) {
        res.status(400).json({ error: 'Note text is required.' });
        return;
    }
    const updated = store_js_1.db.addInterventionNote(req.params.id, {
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
exports.default = router;
