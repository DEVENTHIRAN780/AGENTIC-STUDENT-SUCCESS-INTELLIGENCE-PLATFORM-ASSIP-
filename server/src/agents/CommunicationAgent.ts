import { Student, Intervention } from '../types/index.js';
import { EarlyWarningAssessment } from './EarlyWarningAgent.js';

export interface DraftCommunication {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  communicationType: 'student_outreach' | 'advisor_alert' | 'followup_reminder' | 'parental_notice';
  tone: 'empathetic_supportive' | 'formal_advisory' | 'urgent_administrative';
  reviewStatus: 'draft_pending_human_review';
  generatedAt: string;
}

export class CommunicationAgent {
  public static draftStudentOutreach(
    student: Student,
    assessment: EarlyWarningAssessment,
    advisorName: string = 'Academic Success Team'
  ): DraftCommunication {
    const isCritical = assessment.riskLevel === 'critical';

    const subject = isCritical
      ? `Important Academic Check-In: Support for ${student.program} (Semester ${student.semester})`
      : `Academic Progress & Support Resources — ${student.name}`;

    const body = `Dear ${student.name},

I hope you are having a productive week.

As part of our commitment to supporting every student's academic journey at the university, our Academic Success Intelligence system regularly reviews course progress to ensure students have every resource they need to thrive.

We noticed that in recent weeks, your attendance in certain coursework (currently ${student.attendancePct}%) and a few coursework milestones have encountered scheduling challenges. Specifically:
${assessment.contributingFactors.map(f => `• ${f.signal}`).join('\n')}

Please know that our entire advising and faculty team is here to support you. We understand that semesters can become demanding, whether due to course pacing, commute, or personal circumstances.

Next Steps:
1. Please review your personalized study roadmap available in the Student Portal.
2. I would like to invite you for a brief, friendly 15-minute check-in this week so we can discuss adjustments to your schedule and connect you with peer tutoring or lab makeup options.

Please select a convenient time slot via the Academic Advisor portal link, or reply directly to this message.

Warm regards,

${advisorName}
Department of ${student.department}
Academic Success & Advising Directorate`;

    return {
      recipientEmail: student.email,
      recipientName: student.name,
      subject,
      body,
      communicationType: 'student_outreach',
      tone: isCritical ? 'formal_advisory' : 'empathetic_supportive',
      reviewStatus: 'draft_pending_human_review',
      generatedAt: new Date().toISOString()
    };
  }

  public static draftAdvisorSummary(
    student: Student,
    assessment: EarlyWarningAssessment
  ): DraftCommunication {
    const subject = `[ASSIP ACTION REQUIRED] Early Warning Dossier: ${student.name} (${student.studentId})`;

    const body = `CONFIDENTIAL ADVISOR BRIEFING

Student: ${student.name} (${student.studentId})
Program: ${student.program} | Semester: ${student.semester}
Calculated Risk Score: ${assessment.riskScore}/100 (${assessment.riskLevel.toUpperCase()})
Urgency Level: ${assessment.urgencyLevel.toUpperCase()}

Key Contributing Factors:
${assessment.contributingFactors.map(f => `• [${f.category.toUpperCase()}] ${f.signal}`).join('\n')}

AI Recommendation:
${assessment.recommendedNextAction}

Why This Was Triggered:
${assessment.whyAmISeeingThis.ruleTriggered}
${assessment.whyAmISeeingThis.dataPointComparison}

Recommended Advisor Workflow:
1. Review the proposed intervention plan in the Early Warning Queue.
2. Approve, modify, or reject the intervention protocol.
3. Review and dispatch the draft student outreach message.`;

    return {
      recipientEmail: student.advisorName ? 'advisor@univ.edu' : 'advisor@demo.com',
      recipientName: student.advisorName || 'Academic Advisor',
      subject,
      body,
      communicationType: 'advisor_alert',
      tone: 'formal_advisory',
      reviewStatus: 'draft_pending_human_review',
      generatedAt: new Date().toISOString()
    };
  }
}
