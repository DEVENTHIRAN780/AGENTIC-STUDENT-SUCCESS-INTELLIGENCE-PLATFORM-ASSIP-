export type UserRole = 'student' | 'faculty' | 'advisor' | 'admin';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export type DepartmentName = 'CSE' | 'IT' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
  department: DepartmentName;
  phone?: string;
  studentId?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  department: DepartmentName;
  program: string;
  semester: number;
  enrollmentYear: number;
  gpa: number;
  cgpa: number;
  attendancePct: number;
  creditsCompleted: number;
  creditsTotal: number;
  academicHealth: number;
  riskLevel: RiskLevel;
  riskScore: number;
  riskTrend: 'up' | 'down' | 'stable';
  riskChange: number;
  primarySignal: string;
  advisorId: string;
  advisorName: string;
  mentorName: string;
  tags: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: DepartmentName;
  credits: number;
  semester: number;
  facultyId: string;
  facultyName: string;
  enrollmentCount: number;
  avgScore: number;
  passRate: number;
  failureRate: number;
  avgAttendance: number;
  assignmentCompletionRate: number;
  riskDistribution: {
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  flags: string[];
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semester: number;
  grade: string;
  marksScore: number;
  attendancePct: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  midtermScore: number;
  finalExamScore?: number;
  status: 'enrolled' | 'completed' | 'dropped';
}

export type InterventionStatus = 
  | 'New' 
  | 'Pending Review' 
  | 'Approved' 
  | 'In Progress' 
  | 'Completed' 
  | 'Escalated' 
  | 'Closed';

export type InterventionType = 
  | 'Academic Advising' 
  | 'Tutoring' 
  | 'Attendance Support' 
  | 'Faculty Meeting' 
  | 'Peer Mentoring' 
  | 'Career Guidance' 
  | 'Financial Support Referral';

export interface InterventionNote {
  id: string;
  authorName: string;
  authorRole: UserRole;
  date: string;
  text: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  details: string;
  actor: string;
  type: 'alert' | 'review' | 'action' | 'improvement' | 'note';
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  studentDept: DepartmentName;
  studentSemester: number;
  riskLevel: RiskLevel;
  riskScore: number;
  type: InterventionType;
  status: InterventionStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  aiGenerated: boolean;
  aiExplanation: string;
  contributingSignals: string[];
  recommendedAction: string;
  assignedAdvisorId: string;
  assignedAdvisorName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  notes: InterventionNote[];
  studentResponse?: string;
  outcome?: string;
  timeline: TimelineEvent[];
}

export interface Goal {
  id: string;
  studentId: string;
  title: string;
  category: 'gpa' | 'attendance' | 'certification' | 'assignment' | 'course';
  currentVal: number;
  targetVal: number;
  metricUnit: string;
  deadline: string;
  progressPct: number;
  aiRecommendations: string[];
  status: 'in_progress' | 'completed' | 'behind';
}

export interface StudyPlanDay {
  day: string;
  date: string;
  tasks: Array<{
    id: string;
    subject: string;
    topic: string;
    durationMinutes: number;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
    type: 'revision' | 'practice' | 'assignment' | 'lecture_prep';
  }>;
}

export interface StudyPlan {
  id: string;
  studentId: string;
  title: string;
  weekRange: string;
  targetGpa: number;
  focusAreas: string[];
  dailySchedule: StudyPlanDay[];
  aiGenerated: boolean;
  generatedBy: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientRole?: UserRole | 'all';
  recipientUserId?: string;
  title: string;
  message: string;
  type: 'risk_alert' | 'advisor_message' | 'exam' | 'assignment' | 'attendance' | 'intervention' | 'ai_recommendation';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: string;
  linkUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'warning';
  details: string;
  ipAddress: string;
}

export interface AIInsight {
  id: string;
  title: string;
  type: 'emerging_signal' | 'performance_pattern' | 'intervention_opportunity' | 'positive_trend';
  department: DepartmentName | 'Institution-wide';
  evidence: string;
  date: string;
  confidence: number;
  suggestedAction: string;
  affectedCount: number;
}

export interface AgentActivityItem {
  id: string;
  agentName: string;
  action: string;
  timestamp: string;
  status: 'active' | 'completed' | 'processing';
  metricHighlight?: string;
}

export interface DepartmentMetric {
  department: DepartmentName;
  fullName: string;
  studentCount: number;
  avgGpa: number;
  avgAttendance: number;
  atRiskCount: number;
  atRiskPercentage: number;
  avgCoursePassRate: number;
  activeInterventions: number;
  interventionRate: number;
}
