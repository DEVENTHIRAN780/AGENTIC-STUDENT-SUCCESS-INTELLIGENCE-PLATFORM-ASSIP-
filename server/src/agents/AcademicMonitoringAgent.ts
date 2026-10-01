import { Student, Enrollment } from '../types/index.js';

export interface MonitoringResult {
  studentId: string;
  academicHealthScore: number;
  overallStatus: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
  metricsSummary: {
    gpaTrend: 'upward' | 'stable' | 'downward';
    attendanceStatus: 'optimal' | 'warning' | 'critical';
    submissionRatePct: number;
  };
  flaggedCourses: Array<{
    courseCode: string;
    courseName: string;
    issue: string;
    attendancePct: number;
    scorePct: number;
  }>;
  analyzedAt: string;
}

export class AcademicMonitoringAgent {
  public static analyze(student: Student, enrollments: Enrollment[]): MonitoringResult {
    let totalAssignments = 0;
    let completedAssignments = 0;
    const flaggedCourses: MonitoringResult['flaggedCourses'] = [];

    enrollments.forEach(enr => {
      totalAssignments += enr.totalAssignments;
      completedAssignments += enr.assignmentsCompleted;

      if (enr.attendancePct < 75) {
        flaggedCourses.push({
          courseCode: enr.courseCode,
          courseName: enr.courseName,
          issue: `Attendance at ${enr.attendancePct}% is below the 75% regulatory threshold.`,
          attendancePct: enr.attendancePct,
          scorePct: enr.marksScore
        });
      } else if (enr.marksScore < 60) {
        flaggedCourses.push({
          courseCode: enr.courseCode,
          courseName: enr.courseName,
          issue: `Current marks score of ${enr.marksScore}% indicates difficulty with midterm assessments.`,
          attendancePct: enr.attendancePct,
          scorePct: enr.marksScore
        });
      } else if (enr.totalAssignments - enr.assignmentsCompleted >= 2) {
        flaggedCourses.push({
          courseCode: enr.courseCode,
          courseName: enr.courseName,
          issue: `${enr.totalAssignments - enr.assignmentsCompleted} unsubmitted course assignments pending.`,
          attendancePct: enr.attendancePct,
          scorePct: enr.marksScore
        });
      }
    });

    const submissionRatePct = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 100;
    
    // Academic health formula: (GPA/10 * 35) + (Attendance * 0.4) + (SubmissionRate * 0.25)
    const healthScore = Math.min(100, Math.max(10, Math.round(
      (student.gpa / 10 * 35) + (student.attendancePct * 0.40) + (submissionRatePct * 0.25)
    )));

    let overallStatus: MonitoringResult['overallStatus'] = 'good';
    if (healthScore >= 85) overallStatus = 'excellent';
    else if (healthScore >= 70) overallStatus = 'good';
    else if (healthScore >= 50) overallStatus = 'needs_attention';
    else overallStatus = 'at_risk';

    return {
      studentId: student.id,
      academicHealthScore: healthScore,
      overallStatus,
      metricsSummary: {
        gpaTrend: student.riskTrend === 'up' ? 'downward' : student.riskTrend === 'down' ? 'upward' : 'stable',
        attendanceStatus: student.attendancePct >= 85 ? 'optimal' : student.attendancePct >= 75 ? 'warning' : 'critical',
        submissionRatePct
      },
      flaggedCourses,
      analyzedAt: new Date().toISOString()
    };
  }
}
