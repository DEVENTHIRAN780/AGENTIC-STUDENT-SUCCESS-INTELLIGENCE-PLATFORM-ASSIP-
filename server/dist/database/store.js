"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const seedData_js_1 = require("./seedData.js");
class DataStore {
    users = [];
    students = [];
    courses = [];
    enrollments = [];
    interventions = [];
    aiInsights = [];
    agentActivity = [];
    notifications = [];
    goals = [];
    studyPlans = [];
    auditLogs = [];
    constructor() {
        this.init();
    }
    init() {
        const data = (0, seedData_js_1.generateSeedData)();
        this.users = data.users;
        this.students = data.students;
        this.courses = data.courses;
        this.enrollments = data.enrollments;
        this.interventions = data.interventions;
        this.aiInsights = data.aiInsights;
        this.agentActivity = data.agentActivity;
        this.notifications = data.notifications;
        this.goals = data.goals;
        this.studyPlans = data.studyPlans;
        this.auditLogs = data.auditLogs;
    }
    // User queries
    findUserByEmail(email) {
        return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    findUserById(id) {
        return this.users.find(u => u.id === id);
    }
    createUser(user) {
        this.users.push(user);
        return user;
    }
    // Student queries
    getStudents(filters) {
        return this.students.filter(s => {
            if (filters?.department && filters.department !== 'all' && s.department !== filters.department) {
                return false;
            }
            if (filters?.semester && s.semester !== Number(filters.semester)) {
                return false;
            }
            if (filters?.riskLevel && filters.riskLevel !== 'all' && s.riskLevel !== filters.riskLevel) {
                return false;
            }
            if (filters?.advisorId && s.advisorId !== filters.advisorId) {
                return false;
            }
            if (filters?.search) {
                const query = filters.search.toLowerCase();
                return (s.name.toLowerCase().includes(query) ||
                    s.studentId.toLowerCase().includes(query) ||
                    s.email.toLowerCase().includes(query) ||
                    s.department.toLowerCase().includes(query));
            }
            return true;
        });
    }
    getStudentById(id) {
        return this.students.find(s => s.id === id || s.studentId === id || s.userId === id);
    }
    updateStudent(id, updates) {
        const idx = this.students.findIndex(s => s.id === id || s.studentId === id);
        if (idx !== -1) {
            this.students[idx] = { ...this.students[idx], ...updates };
            return this.students[idx];
        }
        return undefined;
    }
    // Course queries
    getCourses(filters) {
        return this.courses.filter(c => {
            if (filters?.department && filters.department !== 'all' && c.department !== filters.department) {
                return false;
            }
            if (filters?.semester && c.semester !== Number(filters.semester)) {
                return false;
            }
            if (filters?.search) {
                const q = filters.search.toLowerCase();
                return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
            }
            return true;
        });
    }
    getCourseById(id) {
        return this.courses.find(c => c.id === id || c.code === id);
    }
    // Enrollment queries
    getEnrollmentsByStudent(studentId) {
        return this.enrollments.filter(e => e.studentId === studentId);
    }
    getEnrollmentsByCourse(courseId) {
        return this.enrollments.filter(e => e.courseId === courseId);
    }
    // Interventions queries
    getInterventions(filters) {
        return this.interventions.filter(i => {
            if (filters?.status && filters.status !== 'all' && i.status !== filters.status) {
                return false;
            }
            if (filters?.riskLevel && filters.riskLevel !== 'all' && i.riskLevel !== filters.riskLevel) {
                return false;
            }
            if (filters?.department && filters.department !== 'all' && i.studentDept !== filters.department) {
                return false;
            }
            if (filters?.advisorId && i.assignedAdvisorId !== filters.advisorId) {
                return false;
            }
            if (filters?.studentId && i.studentId !== filters.studentId) {
                return false;
            }
            return true;
        });
    }
    getInterventionById(id) {
        return this.interventions.find(i => i.id === id);
    }
    createIntervention(intervention) {
        this.interventions.unshift(intervention);
        return intervention;
    }
    updateInterventionStatus(id, status, actorName, noteText, outcome) {
        const intv = this.interventions.find(i => i.id === id);
        if (!intv)
            return undefined;
        intv.status = status;
        intv.updatedAt = new Date().toISOString();
        if (outcome) {
            intv.outcome = outcome;
        }
        if (noteText) {
            intv.notes.push({
                id: `note-${Date.now()}`,
                authorName: actorName,
                authorRole: 'advisor',
                date: new Date().toISOString(),
                text: noteText
            });
        }
        intv.timeline.push({
            id: `tl-${Date.now()}`,
            date: new Date().toISOString(),
            title: `Status Changed to ${status}`,
            details: noteText || `Intervention status transitioned to ${status}`,
            actor: actorName,
            type: status === 'Approved' ? 'action' : status === 'Completed' ? 'improvement' : 'review'
        });
        return intv;
    }
    addInterventionNote(id, note) {
        const intv = this.interventions.find(i => i.id === id);
        if (!intv)
            return undefined;
        intv.notes.push({
            id: `note-${Date.now()}`,
            authorName: note.authorName,
            authorRole: note.authorRole,
            date: new Date().toISOString(),
            text: note.text
        });
        intv.timeline.push({
            id: `tl-${Date.now()}`,
            date: new Date().toISOString(),
            title: 'Advisor Case Note Added',
            details: note.text,
            actor: note.authorName,
            type: 'note'
        });
        return intv;
    }
    // AI Insights
    getAIInsights() {
        return this.aiInsights;
    }
    addAIInsight(insight) {
        this.aiInsights.unshift(insight);
        return insight;
    }
    // Agent Activity
    getAgentActivity() {
        return this.agentActivity;
    }
    logAgentActivity(item) {
        const activityItem = {
            ...item,
            id: `act-${Date.now()}`
        };
        this.agentActivity.unshift(activityItem);
        if (this.agentActivity.length > 30) {
            this.agentActivity.pop();
        }
        return activityItem;
    }
    // Notifications
    getNotifications(userId, role) {
        return this.notifications.filter(n => {
            if (n.recipientUserId && n.recipientUserId === userId)
                return true;
            if (n.recipientRole && (n.recipientRole === role || n.recipientRole === 'all'))
                return true;
            return false;
        });
    }
    markNotificationRead(id) {
        const n = this.notifications.find(item => item.id === id);
        if (n) {
            n.isRead = true;
            return true;
        }
        return false;
    }
    addNotification(notification) {
        this.notifications.unshift(notification);
        return notification;
    }
    // Goals
    getGoals(studentId) {
        return this.goals.filter(g => g.studentId === studentId);
    }
    createGoal(goal) {
        this.goals.push(goal);
        return goal;
    }
    updateGoal(id, updates) {
        const idx = this.goals.findIndex(g => g.id === id);
        if (idx !== -1) {
            this.goals[idx] = { ...this.goals[idx], ...updates };
            return this.goals[idx];
        }
        return undefined;
    }
    // Study Plans
    getStudyPlans(studentId) {
        return this.studyPlans.filter(p => p.studentId === studentId);
    }
    createStudyPlan(plan) {
        this.studyPlans.unshift(plan);
        return plan;
    }
    // Audit Logs
    getAuditLogs() {
        return this.auditLogs;
    }
    createAuditLog(log) {
        const audit = {
            ...log,
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        this.auditLogs.unshift(audit);
        if (this.auditLogs.length > 100) {
            this.auditLogs.pop();
        }
        return audit;
    }
    // Batch CSV Ingestion
    importStudentsCSV(newStudents) {
        let inserted = 0;
        const errors = [];
        newStudents.forEach((raw, i) => {
            if (!raw.name || !raw.email) {
                errors.push(`Row ${i + 1}: Missing student name or email.`);
                return;
            }
            const existing = this.students.find(s => s.email.toLowerCase() === raw.email.toLowerCase());
            if (existing) {
                errors.push(`Row ${i + 1}: Student with email ${raw.email} already exists.`);
                return;
            }
            const idNum = 1000 + this.students.length + 1;
            const dept = raw.department || 'CSE';
            const gpa = raw.gpa || 7.5;
            const attendance = raw.attendancePct || 85;
            const newStudent = {
                id: `std-${idNum}`,
                studentId: raw.studentId || `ST2024-${idNum}`,
                userId: `usr-import-${idNum}`,
                name: raw.name,
                email: raw.email,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                department: dept,
                program: raw.program || `B.Tech ${dept}`,
                semester: raw.semester || 1,
                enrollmentYear: 2024,
                gpa,
                cgpa: gpa,
                attendancePct: attendance,
                creditsCompleted: (raw.semester || 1) * 20,
                creditsTotal: 160,
                academicHealth: Math.min(95, Math.max(30, Math.round(attendance * 0.5 + gpa * 5))),
                riskLevel: attendance < 65 || gpa < 5.5 ? 'high' : attendance < 75 ? 'moderate' : 'low',
                riskScore: attendance < 65 || gpa < 5.5 ? 72 : attendance < 75 ? 42 : 18,
                riskTrend: 'stable',
                riskChange: 0,
                primarySignal: 'Newly imported student record',
                advisorId: 'adv-1',
                advisorName: 'Prof. Rajeshwar Kulkarni',
                mentorName: 'Dr. Sunita Ramanathan',
                tags: ['New Cohort', 'CSV Ingested']
            };
            this.students.push(newStudent);
            inserted++;
        });
        return { inserted, errors };
    }
}
exports.db = new DataStore();
