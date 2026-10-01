"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const seedData_js_1 = require("../database/seedData.js");
const router = (0, express_1.Router)();
// GET /api/analytics/overview
router.get('/overview', (_req, res) => {
    const students = store_js_1.db.students;
    const totalStudents = students.length;
    const totalGpa = students.reduce((acc, s) => acc + s.gpa, 0);
    const avgGpa = Number((totalGpa / (totalStudents || 1)).toFixed(2));
    const totalAtt = students.reduce((acc, s) => acc + s.attendancePct, 0);
    const avgAttendance = Number((totalAtt / (totalStudents || 1)).toFixed(1));
    const criticalCount = students.filter(s => s.riskLevel === 'critical').length;
    const highCount = students.filter(s => s.riskLevel === 'high').length;
    const moderateCount = students.filter(s => s.riskLevel === 'moderate').length;
    const lowCount = students.filter(s => s.riskLevel === 'low').length;
    const atRiskTotal = criticalCount + highCount;
    const completedInterventions = store_js_1.db.interventions.filter(i => i.status === 'Completed').length;
    const totalInterventions = store_js_1.db.interventions.length;
    const interventionSuccessRate = totalInterventions > 0 ? Math.round((completedInterventions / totalInterventions) * 100) : 84;
    const retentionRate = 94.2;
    const courseFailureRate = 7.8;
    const graduationProgressAvg = 68.5;
    const riskDistribution = [
        { name: 'Low Risk', count: lowCount, percentage: Math.round((lowCount / totalStudents) * 100), color: '#10b981' },
        { name: 'Moderate Risk', count: moderateCount, percentage: Math.round((moderateCount / totalStudents) * 100), color: '#f59e0b' },
        { name: 'High Risk', count: highCount, percentage: Math.round((highCount / totalStudents) * 100), color: '#f97316' },
        { name: 'Critical Risk', count: criticalCount, percentage: Math.round((criticalCount / totalStudents) * 100), color: '#ef4444' }
    ];
    const gpaTrends = [
        { semester: 'Fall 2024', gpa: 7.82, benchmark: 7.5 },
        { semester: 'Spring 2025', gpa: 7.91, benchmark: 7.5 },
        { semester: 'Fall 2025', gpa: 7.98, benchmark: 7.5 },
        { semester: 'Spring 2026', gpa: 8.04, benchmark: 7.5 },
        { semester: 'Fall 2026 (Current)', gpa: avgGpa, benchmark: 7.5 }
    ];
    const attendanceTrends = [
        { month: 'Jun', attendance: 89.2 },
        { month: 'Jul', attendance: 87.8 },
        { month: 'Aug', attendance: 86.4 },
        { month: 'Sep', attendance: 84.8 },
        { month: 'Oct', attendance: avgAttendance }
    ];
    const interventionOutcomes = [
        { status: 'Resolved / Improved', count: 34, color: '#10b981' },
        { status: 'In Progress', count: 18, color: '#0284c7' },
        { status: 'Pending Review', count: 12, color: '#f59e0b' },
        { status: 'Escalated to HoD', count: 4, color: '#ef4444' }
    ];
    res.json({
        metrics: {
            totalStudents,
            avgGpa,
            avgAttendance,
            atRiskCount: atRiskTotal,
            criticalRiskCount: criticalCount,
            highRiskCount: highCount,
            moderateRiskCount: moderateCount,
            lowRiskCount: lowCount,
            retentionRate,
            interventionSuccessRate,
            courseFailureRate,
            graduationProgressAvg,
            pendingInterventions: store_js_1.db.interventions.filter(i => i.status === 'Pending Review').length,
            improvingCount: students.filter(s => s.riskTrend === 'down').length
        },
        riskDistribution,
        gpaTrends,
        attendanceTrends,
        interventionOutcomes
    });
});
// GET /api/analytics/departments (CSE, IT, ECE, EEE, Mechanical, Civil)
router.get('/departments', (_req, res) => {
    const students = store_js_1.db.students;
    const courses = store_js_1.db.courses;
    const interventions = store_js_1.db.interventions;
    const departmentAnalytics = seedData_js_1.DEPARTMENTS.map(dept => {
        const deptStudents = students.filter(s => s.department === dept);
        const count = deptStudents.length;
        const totalGpa = deptStudents.reduce((acc, s) => acc + s.gpa, 0);
        const avgGpa = count > 0 ? Number((totalGpa / count).toFixed(2)) : 0;
        const totalAtt = deptStudents.reduce((acc, s) => acc + s.attendancePct, 0);
        const avgAttendance = count > 0 ? Number((totalAtt / count).toFixed(1)) : 0;
        const atRiskCount = deptStudents.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;
        const atRiskPercentage = count > 0 ? Number(((atRiskCount / count) * 100).toFixed(1)) : 0;
        const deptCourses = courses.filter(c => c.department === dept);
        const avgPassRate = deptCourses.length > 0
            ? Number((deptCourses.reduce((acc, c) => acc + c.passRate, 0) / deptCourses.length).toFixed(1))
            : 88.0;
        const deptInterventions = interventions.filter(i => i.studentDept === dept);
        const interventionRate = count > 0 ? Number(((deptInterventions.length / count) * 100).toFixed(1)) : 0;
        return {
            department: dept,
            fullName: dept === 'CSE' ? 'Computer Science & Engineering' :
                dept === 'IT' ? 'Information Technology' :
                    dept === 'ECE' ? 'Electronics & Communication' :
                        dept === 'EEE' ? 'Electrical & Electronics' :
                            dept === 'Mechanical' ? 'Mechanical Engineering' : 'Civil Engineering',
            studentCount: count,
            avgGpa,
            avgAttendance,
            atRiskCount,
            atRiskPercentage,
            avgCoursePassRate: avgPassRate,
            activeInterventions: deptInterventions.length,
            interventionRate
        };
    });
    res.json({
        departments: departmentAnalytics
    });
});
exports.default = router;
