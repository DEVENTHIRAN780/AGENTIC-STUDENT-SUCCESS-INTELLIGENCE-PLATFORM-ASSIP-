import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { db } from '../database/store.js';
import { generateToken } from '../middleware/auth.js';
import { AcademicMonitoringAgent } from '../agents/AcademicMonitoringAgent.js';
import { EarlyWarningAgent } from '../agents/EarlyWarningAgent.js';
import { AcademicPlanningAgent } from '../agents/AcademicPlanningAgent.js';
import { StudyCoachAgent } from '../agents/StudyCoachAgent.js';
import { InterventionAgent } from '../agents/InterventionAgent.js';
import { CareerGuidanceAgent } from '../agents/CareerGuidanceAgent.js';
import { CommunicationAgent } from '../agents/CommunicationAgent.js';
import { AgentOrchestrator } from '../agents/AgentOrchestrator.js';

describe('ASSIP Multi-Agent Core Engine & Domain Test Suite', () => {
  
  it('1. Database seed data contains 100+ students and 30 courses', () => {
    assert.ok(db.students.length >= 100, `Expected at least 100 students, got ${db.students.length}`);
    assert.ok(db.courses.length >= 30, `Expected at least 30 courses, got ${db.courses.length}`);
    assert.ok(db.users.length >= 4, `Expected at least 4 demo accounts, got ${db.users.length}`);
  });

  it('2. Authentication token generation and user lookup works', () => {
    const studentUser = db.findUserByEmail('student@demo.com');
    assert.ok(studentUser, 'Demo student user must exist');
    assert.equal(studentUser?.role, 'student');

    const token = generateToken({
      id: studentUser!.id,
      email: studentUser!.email,
      role: studentUser!.role,
      name: studentUser!.name,
      studentId: studentUser!.studentId
    });
    assert.ok(token && typeof token === 'string', 'Generated JWT token must be valid string');
  });

  it('3. Academic Monitoring Agent calculates valid health scores', () => {
    const alex = db.getStudentById('std-1001')!;
    const enrollments = db.getEnrollmentsByStudent(alex.id);
    const result = AcademicMonitoringAgent.analyze(alex, enrollments);

    assert.ok(result.academicHealthScore >= 0 && result.academicHealthScore <= 100, 'Health score must be between 0 and 100');
    assert.equal(result.studentId, alex.id);
    assert.ok(result.metricsSummary.submissionRatePct >= 0);
  });

  it('4. Early Warning Agent classifies compound risk and generates factors', () => {
    const alex = db.getStudentById('std-1001')!;
    const enrollments = db.getEnrollmentsByStudent(alex.id);
    const assessment = EarlyWarningAgent.evaluate(alex, enrollments);

    assert.ok(['low', 'moderate', 'high', 'critical'].includes(assessment.riskLevel), 'Risk level must be valid tier');
    assert.ok(assessment.riskScore >= 0 && assessment.riskScore <= 100, 'Risk score must be 0-100');
    assert.ok(assessment.contributingFactors.length > 0, 'Must have at least one contributing signal');
    assert.ok(assessment.whyAmISeeingThis.ruleTriggered.length > 0, 'Explainability rule must be defined');
    assert.ok(assessment.whyAmISeeingThis.confidenceScore > 80, 'Confidence score must be realistic');
  });

  it('5. Academic Planning Agent generates 4-year degree roadmap', () => {
    const alex = db.getStudentById('std-1001')!;
    const proposal = AcademicPlanningAgent.generatePlan(alex, db.courses);

    assert.equal(proposal.roadmap.length, 4, 'Roadmap must span 4 academic years');
    assert.equal(proposal.roadmap[0].semesters.length, 2, 'Each year must contain 2 semesters');
    assert.ok(proposal.creditsEarned > 0);
    assert.ok(proposal.recommendedElectives.length > 0, 'Must suggest electives');
  });

  it('6. Study Coach Agent creates adaptive weekly study blocks', () => {
    const alex = db.getStudentById('std-1001')!;
    const enrollments = db.getEnrollmentsByStudent(alex.id);
    const studyPlan = StudyCoachAgent.generatePersonalizedStudyPlan(alex, enrollments);

    assert.equal(studyPlan.dailySchedule.length, 7, 'Study plan must cover 7 days');
    assert.ok(studyPlan.dailySchedule[0].tasks.length > 0, 'Must have prioritized daily tasks');
    assert.ok(studyPlan.aiGenerated, 'Plan must be marked as AI generated');
  });

  it('7. Intervention Agent enforces human-in-the-loop pending review status', () => {
    const criticalStudent = db.students.find(s => s.riskLevel === 'critical') || db.students[0];
    const enrollments = db.getEnrollmentsByStudent(criticalStudent.id);
    const assessment = EarlyWarningAgent.evaluate(criticalStudent, enrollments);
    const intervention = InterventionAgent.recommend(criticalStudent, enrollments, assessment);

    assert.equal(intervention.status, 'Pending Review', 'AI interventions must require human authorization before execution');
    assert.ok(intervention.contributingSignals.length > 0);
    assert.ok(intervention.recommendedAction.length > 0);
  });

  it('8. Human advisor can approve and advance intervention status', () => {
    const criticalStudent = db.students.find(s => s.riskLevel === 'critical') || db.students[0];
    const enrollments = db.getEnrollmentsByStudent(criticalStudent.id);
    const assessment = EarlyWarningAgent.evaluate(criticalStudent, enrollments);
    const intervention = InterventionAgent.recommend(criticalStudent, enrollments, assessment);

    db.createIntervention(intervention);

    const approved = db.updateInterventionStatus(
      intervention.id,
      'Approved',
      'Prof. Rajeshwar Kulkarni',
      'Approved peer tutoring support'
    );

    assert.ok(approved, 'Updated intervention must exist');
    assert.equal(approved?.status, 'Approved');
    assert.equal(approved?.timeline.slice(-1)[0].title, 'Status Changed to Approved');
  });

  it('9. Career Guidance Agent maps academic competencies to industry pathways', () => {
    const alex = db.getStudentById('std-1001')!;
    const enrollments = db.getEnrollmentsByStudent(alex.id);
    const career = CareerGuidanceAgent.mapCareerPathways(alex, enrollments);

    assert.ok(career.recommendedRole.length > 0);
    assert.ok(career.recommendedCertifications.length > 0);
    assert.ok(career.suggestedProjects.length > 0);
  });

  it('10. Communication Agent drafts reviewable student outreach message', () => {
    const alex = db.getStudentById('std-1001')!;
    const enrollments = db.getEnrollmentsByStudent(alex.id);
    const assessment = EarlyWarningAgent.evaluate(alex, enrollments);
    const draft = CommunicationAgent.draftStudentOutreach(alex, assessment);

    assert.equal(draft.reviewStatus, 'draft_pending_human_review');
    assert.ok(draft.subject.includes('Academic') || draft.subject.includes('Check-In'));
    assert.ok(draft.body.includes(alex.name));
  });

  it('11. Agent Orchestrator runs full multi-agent pipeline and updates metrics', () => {
    const report = AgentOrchestrator.runFullAnalysis('std-1001');
    assert.ok(report, 'Full analysis report must be produced');
    assert.ok(report?.monitoring);
    assert.ok(report?.assessment);
    assert.ok(report?.recommendedIntervention);
  });
});
