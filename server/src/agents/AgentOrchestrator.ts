import { Student, Enrollment, Course, Intervention, StudyPlan } from '../types/index.js';
import { db } from '../database/store.js';
import { AcademicMonitoringAgent, MonitoringResult } from './AcademicMonitoringAgent.js';
import { EarlyWarningAgent, EarlyWarningAssessment } from './EarlyWarningAgent.js';
import { AcademicPlanningAgent, AcademicPlanProposal } from './AcademicPlanningAgent.js';
import { StudyCoachAgent } from './StudyCoachAgent.js';
import { InterventionAgent } from './InterventionAgent.js';
import { CareerGuidanceAgent, CareerPathwayResult } from './CareerGuidanceAgent.js';
import { CommunicationAgent, DraftCommunication } from './CommunicationAgent.js';

export interface FullStudentIntelligenceReport {
  student: Student;
  monitoring: MonitoringResult;
  assessment: EarlyWarningAssessment;
  academicPlan: AcademicPlanProposal;
  careerPathway: CareerPathwayResult;
  recommendedIntervention: Intervention;
  draftStudentEmail: DraftCommunication;
  draftAdvisorBrief: DraftCommunication;
  generatedAt: string;
}

export class AgentOrchestrator {
  public static runFullAnalysis(studentId: string): FullStudentIntelligenceReport | null {
    const student = db.getStudentById(studentId);
    if (!student) return null;

    const enrollments = db.getEnrollmentsByStudent(student.id);
    const courses = db.courses;

    // 1. Academic Monitoring Agent
    const monitoring = AcademicMonitoringAgent.analyze(student, enrollments);

    // 2. Early Warning Agent
    const assessment = EarlyWarningAgent.evaluate(student, enrollments);

    // 3. Academic Planning Agent
    const academicPlan = AcademicPlanningAgent.generatePlan(student, courses);

    // 4. Career Guidance Agent
    const careerPathway = CareerGuidanceAgent.mapCareerPathways(student, enrollments);

    // 5. Intervention Agent
    const recommendedIntervention = InterventionAgent.recommend(student, enrollments, assessment);

    // 6. Communication Agent
    const draftStudentEmail = CommunicationAgent.draftStudentOutreach(student, assessment, student.advisorName);
    const draftAdvisorBrief = CommunicationAgent.draftAdvisorSummary(student, assessment);

    // Update student's dynamic risk score in the database
    db.updateStudent(student.id, {
      academicHealth: monitoring.academicHealthScore,
      riskScore: assessment.riskScore,
      riskLevel: assessment.riskLevel,
      primarySignal: assessment.contributingFactors[0]?.signal || student.primarySignal
    });

    // Log Agent Activity stream
    db.logAgentActivity({
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
  public static chatWithCopilot(studentId: string, userMessage: string): {
    reply: string;
    suggestedActions: string[];
    contextMetrics?: {
      gpa: number;
      attendance: number;
      academicHealth: number;
      riskLevel: string;
    };
  } {
    const student = db.getStudentById(studentId) || db.students[0];
    const enrollments = db.getEnrollmentsByStudent(student.id);
    const q = userMessage.toLowerCase();

    const osCourse = enrollments.find(e => e.courseCode.includes('IT302') || e.courseName.toLowerCase().includes('operating'));
    const osAttendance = osCourse ? osCourse.attendancePct : 78;

    let reply = '';
    const suggestedActions: string[] = [
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
    } else if (q.includes('study plan') || q.includes('plan') || q.includes('schedule')) {
      reply = `I have reviewed your 4 enrolled courses for Semester ${student.semester}.\n\n` +
        `I recommend focusing 60% of your dedicated study time on Operating Systems (Process Synchronization & Semaphores) and 40% on AI & Machine Learning.\n\n` +
        `I have updated your Study Planner with a structured 7-day milestone schedule with daily 60-90 minute deep-work blocks.`;
    } else if (q.includes('graduation') || q.includes('credit') || q.includes('roadmap')) {
      reply = `You have completed ${student.creditsCompleted} out of ${student.creditsTotal} required credits (${Math.round((student.creditsCompleted/student.creditsTotal)*100)}% progress).\n\n` +
        `You are on track to graduate in ${student.enrollmentYear + 4}. To maintain honors eligibility, keep your cumulative CGPA above 8.0 (Current CGPA: ${student.cgpa}).`;
    } else if (q.includes('weak') || q.includes('subject') || q.includes('improve')) {
      const weakest = enrollments.slice().sort((a,b) => a.marksScore - b.marksScore)[0];
      reply = `Based on recent midterm evaluations and assignment submissions:\n\n` +
        `• Most critical subject: ${weakest ? weakest.courseName : 'Operating Systems'} (${weakest ? weakest.marksScore : 78}% score)\n` +
        `• Strength subject: Data Structures & Algorithms & AI/ML (Scoring >88%)\n\n` +
        `Tip: Attending peer tutoring or reviewing the recommended 3 practice problems in your planner can boost your next quiz by an estimated 10-15%.`;
    } else if (q.includes('exam') || q.includes('prep') || q.includes('midterm')) {
      reply = `Your next major assessment is Machine Learning Midterm 2 on October 14, 2026. Topics include Neural Networks and Support Vector Machines.\n\n` +
        `Would you like me to block 90-minute daily preparation sprints in your interactive Study Planner?`;
    } else {
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
