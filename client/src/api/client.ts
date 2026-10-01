import { 
  User, Student, Course, Intervention, Goal, 
  StudyPlan, NotificationItem, AuditLog, AIInsight, 
  AgentActivityItem, DepartmentMetric 
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('assip_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('assip_token', token);
    } else {
      localStorage.removeItem('assip_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Pass role header if saved
    const savedUser = localStorage.getItem('assip_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role) headers['x-demo-role'] = u.role;
      } catch (e) {}
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`API call ${endpoint} error:`, err.message);
      throw err;
    }
  }

  // Auth
  public async login(email: string, password?: string, rememberMe = true) {
    const data = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || 'demo123', rememberMe })
    });
    this.setToken(data.token);
    return data;
  }

  public async register(userData: { name: string; email: string; role: string; department?: string }) {
    const data = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    this.setToken(data.token);
    return data;
  }

  public async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  public async getMe() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Students
  public async getStudents(params?: { department?: string; semester?: number; riskLevel?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.department && params.department !== 'all') query.set('department', params.department);
    if (params?.semester) query.set('semester', String(params.semester));
    if (params?.riskLevel && params.riskLevel !== 'all') query.set('riskLevel', params.riskLevel);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ total: number; page: number; limit: number; students: Student[] }>(`/students${qs}`);
  }

  public async getStudent360(id: string) {
    return this.request<{
      student: Student;
      enrollments: any[];
      monitoring: any;
      assessment: any;
      interventions: Intervention[];
      goals: Goal[];
      studyPlans: StudyPlan[];
      career: any;
      roadmap: any;
    }>(`/students/${id}`);
  }

  public async getStudentPerformance(id: string) {
    return this.request<{
      studentId: string;
      gpa: number;
      cgpa: number;
      attendancePct: number;
      academicHealth: number;
      gpaTrend: Array<{ semester: string; gpa: number; cohortAvg: number }>;
      attendanceTrend: Array<{ week: string; attendance: number; benchmark: number }>;
      radarData: Array<{ subject: string; score: number; benchmark: number }>;
      enrollments: any[];
    }>(`/students/${id}/performance`);
  }

  public async getStudentRisk(id: string) {
    return this.request<any>(`/students/${id}/risk`);
  }

  // Interventions
  public async getInterventions(params?: { status?: string; riskLevel?: string; department?: string; advisorId?: string; studentId?: string }) {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.riskLevel && params.riskLevel !== 'all') query.set('riskLevel', params.riskLevel);
    if (params?.department && params.department !== 'all') query.set('department', params.department);
    if (params?.advisorId) query.set('advisorId', params.advisorId);
    if (params?.studentId) query.set('studentId', params.studentId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ total: number; interventions: Intervention[] }>(`/interventions${qs}`);
  }

  public async updateInterventionStatus(id: string, status: string, actorName = 'Academic Advisor', noteText?: string, outcome?: string) {
    return this.request<Intervention>(`/interventions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, actorName, noteText, outcome })
    });
  }

  public async addInterventionNote(id: string, text: string, authorName = 'Academic Advisor', authorRole = 'advisor') {
    return this.request<Intervention>(`/interventions/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, authorName, authorRole })
    });
  }

  public async createIntervention(data: any) {
    return this.request<Intervention>('/interventions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Analytics
  public async getOverviewAnalytics() {
    return this.request<{
      metrics: any;
      riskDistribution: Array<{ name: string; count: number; percentage: number; color: string }>;
      gpaTrends: Array<{ semester: string; gpa: number; benchmark: number }>;
      attendanceTrends: Array<{ month: string; attendance: number }>;
      interventionOutcomes: Array<{ status: string; count: number; color: string }>;
    }>('/analytics/overview');
  }

  public async getDepartmentAnalytics() {
    return this.request<{ departments: DepartmentMetric[] }>('/analytics/departments');
  }

  // AI & Copilot
  public async chatCopilot(message: string, studentId = 'std-1001') {
    return this.request<{
      reply: string;
      suggestedActions: string[];
      contextMetrics?: any;
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, studentId })
    });
  }

  public async generateStudyPlan(studentId = 'std-1001') {
    return this.request<StudyPlan>('/ai/generate-study-plan', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    });
  }

  public async generateIntervention(studentId = 'std-1001') {
    return this.request<Intervention>('/ai/generate-intervention', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    });
  }

  public async getAIInsights() {
    return this.request<{ insights: AIInsight[] }>('/ai/insights');
  }

  public async getAgentActivity() {
    return this.request<{ activities: AgentActivityItem[] }>('/ai/agent-activity');
  }

  // Courses
  public async getCourses(params?: { department?: string; semester?: number; search?: string }) {
    const query = new URLSearchParams();
    if (params?.department && params.department !== 'all') query.set('department', params.department);
    if (params?.semester) query.set('semester', String(params.semester));
    if (params?.search) query.set('search', params.search);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ total: number; courses: Course[] }>(`/courses${qs}`);
  }

  // Study Plans
  public async getStudyPlans(studentId = 'std-1001') {
    return this.request<{ plans: StudyPlan[] }>(`/study-plans?studentId=${studentId}`);
  }

  public async toggleStudyTask(planId: string, taskId: string, completed: boolean) {
    return this.request<{ success: boolean; plan: StudyPlan }>(`/study-plans/${planId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed })
    });
  }

  // Goals
  public async getGoals(studentId = 'std-1001') {
    return this.request<{ goals: Goal[] }>(`/goals?studentId=${studentId}`);
  }

  public async createGoal(goal: Partial<Goal>) {
    return this.request<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal)
    });
  }

  public async updateGoal(id: string, updates: Partial<Goal>) {
    return this.request<Goal>(`/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Notifications
  public async getNotifications(userId?: string, role?: string) {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (role) query.set('role', role);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ total: number; unreadCount: number; notifications: NotificationItem[] }>(`/notifications${qs}`);
  }

  public async markNotificationRead(id: string) {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  }

  public async markAllNotificationsRead(userId?: string, role?: string) {
    return this.request<{ success: boolean; count: number }>('/notifications/mark-all-read', {
      method: 'POST',
      body: JSON.stringify({ userId, role })
    });
  }

  // Data Import
  public async previewCSV(csvContent: string, dataType = 'students') {
    return this.request<{
      totalRows: number;
      validRows: number;
      preview: Array<Record<string, string>>;
      errors: string[];
      sampleHeaders: string[];
    }>('/data-import/preview', {
      method: 'POST',
      body: JSON.stringify({ csvContent, dataType })
    });
  }

  public async commitCSV(csvContent: string, dataType = 'students') {
    return this.request<{
      success: boolean;
      insertedCount: number;
      totalAttempted: number;
      errors: string[];
    }>('/data-import/commit', {
      method: 'POST',
      body: JSON.stringify({ csvContent, dataType })
    });
  }

  // Admin
  public async getAuditLogs() {
    return this.request<{ total: number; logs: AuditLog[] }>('/admin/audit-logs');
  }

  public async getSettings() {
    return this.request<{ settings: any }>('/admin/settings');
  }

  public async updateSettings(updates: any) {
    return this.request<{ success: boolean; settings: any }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
}

export const api = new ApiClient();
