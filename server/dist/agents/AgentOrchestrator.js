"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentOrchestrator = void 0;
const store_js_1 = require("../database/store.js");
const AcademicMonitoringAgent_js_1 = require("./AcademicMonitoringAgent.js");
const EarlyWarningAgent_js_1 = require("./EarlyWarningAgent.js");
const AcademicPlanningAgent_js_1 = require("./AcademicPlanningAgent.js");
const InterventionAgent_js_1 = require("./InterventionAgent.js");
const CareerGuidanceAgent_js_1 = require("./CareerGuidanceAgent.js");
const CommunicationAgent_js_1 = require("./CommunicationAgent.js");
class AgentOrchestrator {
    static runFullAnalysis(studentId) {
        const student = store_js_1.db.getStudentById(studentId);
        if (!student)
            return null;
        const enrollments = store_js_1.db.getEnrollmentsByStudent(student.id);
        const courses = store_js_1.db.courses;
        // 1. Academic Monitoring Agent
        const monitoring = AcademicMonitoringAgent_js_1.AcademicMonitoringAgent.analyze(student, enrollments);
        // 2. Early Warning Agent
        const assessment = EarlyWarningAgent_js_1.EarlyWarningAgent.evaluate(student, enrollments);
        // 3. Academic Planning Agent
        const academicPlan = AcademicPlanningAgent_js_1.AcademicPlanningAgent.generatePlan(student, courses);
        // 4. Career Guidance Agent
        const careerPathway = CareerGuidanceAgent_js_1.CareerGuidanceAgent.mapCareerPathways(student, enrollments);
        // 5. Intervention Agent
        const recommendedIntervention = InterventionAgent_js_1.InterventionAgent.recommend(student, enrollments, assessment);
        // 6. Communication Agent
        const draftStudentEmail = CommunicationAgent_js_1.CommunicationAgent.draftStudentOutreach(student, assessment, student.advisorName);
        const draftAdvisorBrief = CommunicationAgent_js_1.CommunicationAgent.draftAdvisorSummary(student, assessment);
        // Update student's dynamic risk score in the database
        store_js_1.db.updateStudent(student.id, {
            academicHealth: monitoring.academicHealthScore,
            riskScore: assessment.riskScore,
            riskLevel: assessment.riskLevel,
            primarySignal: assessment.contributingFactors[0]?.signal || student.primarySignal
        });
        // Log Agent Activity stream
        store_js_1.db.logAgentActivity({
            agentName: 'Monitoring & Early Warning Agents',
            action: `Executed orchestrated risk synthesis for ${student.name} (${student.studentId}). Risk: ${assessment.riskScore}/100.`,
            timestamp: 'Just now',
            status: 'completed',
            metricHighlight: `${assessment.riskLevel.toUpperCase()} RISK`
        });
        return {
            student,
            monitoring,
            assessment,
            academicPlan,
            careerPathway,
            recommendedIntervention,
            draftStudentEmail,
            draftAdvisorBrief,
            generatedAt: new Date().toISOString()
        };
    }
    // Success Copilot context-aware conversational chat handler
    static chatWithCopilot(studentId, userMessage) {
        const student = store_js_1.db.getStudentById(studentId) || store_js_1.db.students[0];
        const enrollments = store_js_1.db.getEnrollmentsByStudent(student.id);
        const q = userMessage.toLowerCase();
        const osCourse = enrollments.find(e => e.courseCode.includes('IT302') || e.courseName.toLowerCase().includes('operating'));
        const osAttendance = osCourse ? osCourse.attendancePct : 78;
        let reply = '';
        const suggestedActions = [
            'Create study plan',
            'Explain my risk',
            'Plan this week\'s study',
            'Check graduation progress',
            'Find weak subjects',
            'Prepare for upcoming exam'
        ];
        if (q.includes('explain') || q.includes('risk') || q.includes('why')) {
            reply = `Hi ${student.name.split(' ')[0]}. Here is a breakdown of your current Academic Health:\n\n` +
                `• Current Risk Level: ${student.riskLevel.toUpperCase()} (Risk Score: ${student.riskScore}/100)\n` +
                `• Academic Health Score: ${student.academicHealth}/100 (On Track)\n` +
                `• Primary Signal: Your overall attendance is strong at ${student.attendancePct}%, but your attendance in Operating Systems (${osCourse?.courseCode || 'IT302'}) dropped to ${osAttendance}% due to recent Friday lab absences.\n` +
                `• Remediation: You have 1 pending lab assignment in OS. Completing this and attending the rescheduled 2:00 PM session will restore you to the Low Risk safe harbor.`;
        }
        else if (q.includes('study plan') || q.includes('plan') || q.includes('schedule')) {
            reply = `I have reviewed your 4 enrolled courses for Semester ${student.semester}.\n\n` +
                `I recommend focusing 60% of your dedicated study time on Operating Systems (Process Synchronization & Semaphores) and 40% on AI & Machine Learning.\n\n` +
                `I have updated your Study Planner with a structured 7-day milestone schedule with daily 60-90 minute deep-work blocks.`;
        }
        else if (q.includes('graduation') || q.includes('credit') || q.includes('roadmap')) {
            reply = `You have completed ${student.creditsCompleted} out of ${student.creditsTotal} required credits (${Math.round((student.creditsCompleted / student.creditsTotal) * 100)}% progress).\n\n` +
                `You are on track to graduate in ${student.enrollmentYear + 4}. To maintain honors eligibility, keep your cumulative CGPA above 8.0 (Current CGPA: ${student.cgpa}).`;
        }
        else if (q.includes('weak') || q.includes('subject') || q.includes('improve')) {
            const weakest = enrollments.slice().sort((a, b) => a.marksScore - b.marksScore)[0];
            reply = `Based on recent midterm evaluations and assignment submissions:\n\n` +
                `• Most critical subject: ${weakest ? weakest.courseName : 'Operating Systems'} (${weakest ? weakest.marksScore : 78}% score)\n` +
                `• Strength subject: Data Structures & Algorithms & AI/ML (Scoring >88%)\n\n` +
                `Tip: Attending peer tutoring or reviewing the recommended 3 practice problems in your planner can boost your next quiz by an estimated 10-15%.`;
        }
        else if (q.includes('exam') || q.includes('prep') || q.includes('midterm')) {
            reply = `Your next major assessment is Machine Learning Midterm 2 on October 14, 2026. Topics include Neural Networks and Support Vector Machines.\n\n` +
                `Would you like me to block 90-minute daily preparation sprints in your interactive Study Planner?`;
        }
        else {
            reply = `Hi ${student.name.split(' ')[0]}. I've reviewed your recent academic activity.\n\n` +
                `Your performance in Data Structures has improved by 12%, but your attendance in Operating Systems has dropped to ${osAttendance}%.\n\n` +
                `What would you like me to assist you with today?`;
        }
        return {
            reply,
            suggestedActions,
            contextMetrics: {
                gpa: student.gpa,
                attendance: student.attendancePct,
                academicHealth: student.academicHealth,
                riskLevel: student.riskLevel
            }
        };
    }
}
exports.AgentOrchestrator = AgentOrchestrator;
