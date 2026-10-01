"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = __importDefault(require("node:assert/strict"));
const store_js_1 = require("../database/store.js");
const auth_js_1 = require("../middleware/auth.js");
const AcademicMonitoringAgent_js_1 = require("../agents/AcademicMonitoringAgent.js");
const EarlyWarningAgent_js_1 = require("../agents/EarlyWarningAgent.js");
const AcademicPlanningAgent_js_1 = require("../agents/AcademicPlanningAgent.js");
const StudyCoachAgent_js_1 = require("../agents/StudyCoachAgent.js");
const InterventionAgent_js_1 = require("../agents/InterventionAgent.js");
const CareerGuidanceAgent_js_1 = require("../agents/CareerGuidanceAgent.js");
const CommunicationAgent_js_1 = require("../agents/CommunicationAgent.js");
const AgentOrchestrator_js_1 = require("../agents/AgentOrchestrator.js");
(0, node_test_1.describe)('ASSIP Multi-Agent Core Engine & Domain Test Suite', () => {
    (0, node_test_1.it)('1. Database seed data contains 100+ students and 30 courses', () => {
        strict_1.default.ok(store_js_1.db.students.length >= 100, `Expected at least 100 students, got ${store_js_1.db.students.length}`);
        strict_1.default.ok(store_js_1.db.courses.length >= 30, `Expected at least 30 courses, got ${store_js_1.db.courses.length}`);
        strict_1.default.ok(store_js_1.db.users.length >= 4, `Expected at least 4 demo accounts, got ${store_js_1.db.users.length}`);
    });
    (0, node_test_1.it)('2. Authentication token generation and user lookup works', () => {
        const studentUser = store_js_1.db.findUserByEmail('student@demo.com');
        strict_1.default.ok(studentUser, 'Demo student user must exist');
        strict_1.default.equal(studentUser?.role, 'student');
        const token = (0, auth_js_1.generateToken)({
            id: studentUser.id,
            email: studentUser.email,
            role: studentUser.role,
            name: studentUser.name,
            studentId: studentUser.studentId
        });
        strict_1.default.ok(token && typeof token === 'string', 'Generated JWT token must be valid string');
    });
    (0, node_test_1.it)('3. Academic Monitoring Agent calculates valid health scores', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const enrollments = store_js_1.db.getEnrollmentsByStudent(alex.id);
        const result = AcademicMonitoringAgent_js_1.AcademicMonitoringAgent.analyze(alex, enrollments);
        strict_1.default.ok(result.academicHealthScore >= 0 && result.academicHealthScore <= 100, 'Health score must be between 0 and 100');
        strict_1.default.equal(result.studentId, alex.id);
        strict_1.default.ok(result.metricsSummary.submissionRatePct >= 0);
    });
    (0, node_test_1.it)('4. Early Warning Agent classifies compound risk and generates factors', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const enrollments = store_js_1.db.getEnrollmentsByStudent(alex.id);
        const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(alex, enrollments);
        strict_1.default.ok(['low', 'moderate', 'high', 'critical'].includes(assessment.riskLevel), 'Risk level must be valid tier');
        strict_1.default.ok(assessment.riskScore >= 0 && assessment.riskScore <= 100, 'Risk score must be 0-100');
        strict_1.default.ok(assessment.contributingFactors.length > 0, 'Must have at least one contributing signal');
        strict_1.default.ok(assessment.whyAmISeeingThis.ruleTriggered.length > 0, 'Explainability rule must be defined');
        strict_1.default.ok(assessment.whyAmISeeingThis.confidenceScore > 80, 'Confidence score must be realistic');
    });
    (0, node_test_1.it)('5. Academic Planning Agent generates 4-year degree roadmap', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const proposal = AcademicPlanningAgent_js_1.AcademicPlanningAgent.generatePlan(alex, store_js_1.db.courses);
        strict_1.default.equal(proposal.roadmap.length, 4, 'Roadmap must span 4 academic years');
        strict_1.default.equal(proposal.roadmap[0].semesters.length, 2, 'Each year must contain 2 semesters');
        strict_1.default.ok(proposal.creditsEarned > 0);
        strict_1.default.ok(proposal.recommendedElectives.length > 0, 'Must suggest electives');
    });
    (0, node_test_1.it)('6. Study Coach Agent creates adaptive weekly study blocks', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const enrollments = store_js_1.db.getEnrollmentsByStudent(alex.id);
        const studyPlan = StudyCoachAgent_js_1.StudyCoachAgent.generatePersonalizedStudyPlan(alex, enrollments);
        strict_1.default.equal(studyPlan.dailySchedule.length, 7, 'Study plan must cover 7 days');
        strict_1.default.ok(studyPlan.dailySchedule[0].tasks.length > 0, 'Must have prioritized daily tasks');
        strict_1.default.ok(studyPlan.aiGenerated, 'Plan must be marked as AI generated');
    });
    (0, node_test_1.it)('7. Intervention Agent enforces human-in-the-loop pending review status', () => {
        const criticalStudent = store_js_1.db.students.find(s => s.riskLevel === 'critical') || store_js_1.db.students[0];
        const enrollments = store_js_1.db.getEnrollmentsByStudent(criticalStudent.id);
        const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(criticalStudent, enrollments);
        const intervention = InterventionAgent_js_1.InterventionAgent.recommend(criticalStudent, enrollments, assessment);
        strict_1.default.equal(intervention.status, 'Pending Review', 'AI interventions must require human authorization before execution');
        strict_1.default.ok(intervention.contributingSignals.length > 0);
        strict_1.default.ok(intervention.recommendedAction.length > 0);
    });
    (0, node_test_1.it)('8. Human advisor can approve and advance intervention status', () => {
        const criticalStudent = store_js_1.db.students.find(s => s.riskLevel === 'critical') || store_js_1.db.students[0];
        const enrollments = store_js_1.db.getEnrollmentsByStudent(criticalStudent.id);
        const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(criticalStudent, enrollments);
        const intervention = InterventionAgent_js_1.InterventionAgent.recommend(criticalStudent, enrollments, assessment);
        store_js_1.db.createIntervention(intervention);
        const approved = store_js_1.db.updateInterventionStatus(intervention.id, 'Approved', 'Prof. Rajeshwar Kulkarni', 'Approved peer tutoring support');
        strict_1.default.ok(approved, 'Updated intervention must exist');
        strict_1.default.equal(approved?.status, 'Approved');
        strict_1.default.equal(approved?.timeline.slice(-1)[0].title, 'Status Changed to Approved');
    });
    (0, node_test_1.it)('9. Career Guidance Agent maps academic competencies to industry pathways', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const enrollments = store_js_1.db.getEnrollmentsByStudent(alex.id);
        const career = CareerGuidanceAgent_js_1.CareerGuidanceAgent.mapCareerPathways(alex, enrollments);
        strict_1.default.ok(career.recommendedRole.length > 0);
        strict_1.default.ok(career.recommendedCertifications.length > 0);
        strict_1.default.ok(career.suggestedProjects.length > 0);
    });
    (0, node_test_1.it)('10. Communication Agent drafts reviewable student outreach message', () => {
        const alex = store_js_1.db.getStudentById('std-1001');
        const enrollments = store_js_1.db.getEnrollmentsByStudent(alex.id);
        const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(alex, enrollments);
        const draft = CommunicationAgent_js_1.CommunicationAgent.draftStudentOutreach(alex, assessment);
        strict_1.default.equal(draft.reviewStatus, 'draft_pending_human_review');
        strict_1.default.ok(draft.subject.includes('Academic') || draft.subject.includes('Check-In'));
        strict_1.default.ok(draft.body.includes(alex.name));
    });
    (0, node_test_1.it)('11. Agent Orchestrator runs full multi-agent pipeline and updates metrics', () => {
        const report = AgentOrchestrator_js_1.AgentOrchestrator.runFullAnalysis('std-1001');
        strict_1.default.ok(report, 'Full analysis report must be produced');
        strict_1.default.ok(report?.monitoring);
        strict_1.default.ok(report?.assessment);
        strict_1.default.ok(report?.recommendedIntervention);
    });
});
