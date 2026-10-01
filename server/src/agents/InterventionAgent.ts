import { Student, Enrollment, Intervention, InterventionType } from '../types/index.js';
import { EarlyWarningAssessment } from './EarlyWarningAgent.js';

export class InterventionAgent {
  public static recommend(
    student: Student,
    enrollments: Enrollment[],
    assessment: EarlyWarningAssessment
  ): Intervention {
    let type: InterventionType = 'Academic Advising';
    let priority: Intervention['priority'] = 'medium';
    let title = `Academic Success Check-in for ${student.name}`;
    let description = 'General advising review to discuss semester trajectory and credit progress.';

    if (assessment.riskLevel === 'critical') {
      priority = 'urgent';
      if (student.attendancePct < 65) {
        type = 'Attendance Support';
        title = `Urgent Attendance Remediation & Faculty Meeting (${student.studentId})`;
        description = `Student attendance at ${student.attendancePct}% requires formal remedial contract to prevent regulatory semester debarment.`;
      } else {
        type = 'Faculty Meeting';
        title = `Emergency Academic Intervention: Compounded Assessment Deficit (${student.studentId})`;
        description = `Student has scored critically low across multiple core subjects. Department HoD & Advisor conference required.`;
      }
    } else if (assessment.riskLevel === 'high') {
      priority = 'high';
      const lowEnrollment = enrollments.find(e => e.marksScore < 65);
      if (lowEnrollment) {
        type = 'Tutoring';
        title = `Targeted Peer Tutoring in ${lowEnrollment.courseName} (${lowEnrollment.courseCode})`;
        description = `Diagnostic alerts identify conceptual gaps in ${lowEnrollment.courseCode}. Peer tutoring recommended twice weekly.`;
      } else {
        type = 'Academic Advising';
        title = `Comprehensive Advisor Review & Study Restructuring`;
        description = `Compounded signals of missing assignments and performance dips require 1-on-1 advisor strategy session.`;
      }
    } else if (assessment.riskLevel === 'moderate') {
      priority = 'medium';
      type = 'Peer Mentoring';
      title = `Peer Mentoring & Study Group Onboarding`;
      description = `Student shows moderate engagement drift. Pairing with a high-performing senior student mentor recommended.`;
    } else {
      priority = 'low';
      type = 'Career Guidance';
      title = `Advanced Career Pathway & Honors Specialization Mapping`;
      description = `Student is performing in the upper quartile. Recommend honors research track and industry certification sponsorship.`;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (priority === 'urgent' ? 3 : priority === 'high' ? 7 : 14));

    const newIntervention: Intervention = {
      id: `intv-ai-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentDept: student.department,
      studentSemester: student.semester,
      riskLevel: assessment.riskLevel,
      riskScore: assessment.riskScore,
      type,
      status: 'Pending Review', // HUMAN APPROVAL MANDATORY
      priority,
      title,
      description,
      aiGenerated: true,
      aiExplanation: assessment.aiExplanation,
      contributingSignals: assessment.contributingFactors.map(f => f.signal),
      recommendedAction: assessment.recommendedNextAction,
      assignedAdvisorId: student.advisorId || 'adv-1',
      assignedAdvisorName: student.advisorName || 'Prof. Rajeshwar Kulkarni',
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [
        {
          id: `note-ai-${Date.now()}`,
          authorName: 'AI Intervention Agent',
          authorRole: 'advisor',
          date: new Date().toISOString(),
          text: `Automated intervention proposal generated with status PENDING REVIEW. Requires faculty/advisor approval before execution.`
        }
      ],
      timeline: [
        {
          id: `tl-ai-1`,
          date: new Date().toISOString(),
          title: 'Risk Signal Triggered by Early Warning Agent',
          details: `Risk score evaluated at ${assessment.riskScore}/100.`,
          actor: 'Early Warning Agent',
          type: 'alert'
        },
        {
          id: `tl-ai-2`,
          date: new Date().toISOString(),
          title: 'Intervention Plan Drafted',
          details: `Protocol '${type}' drafted with priority ${priority.toUpperCase()}. Queued for human approval.`,
          actor: 'Intervention Agent',
          type: 'action'
        }
      ]
    };

    return newIntervention;
  }
}
