"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_js_1 = require("../database/store.js");
const router = (0, express_1.Router)();
// GET /api/courses
router.get('/', (req, res) => {
    const { department, semester, search } = req.query;
    const courses = store_js_1.db.getCourses({
        department: department,
        semester: semester ? Number(semester) : undefined,
        search: search
    });
    res.json({
        total: courses.length,
        courses
    });
});
// GET /api/courses/:id
router.get('/:id', (req, res) => {
    const courseId = req.params.id;
    const course = store_js_1.db.getCourseById(courseId);
    if (!course) {
        res.status(404).json({ error: 'Course not found.' });
        return;
    }
    const enrollments = store_js_1.db.getEnrollmentsByCourse(course.id);
    res.json({
        course,
        enrollmentsSummary: {
            enrolledCount: enrollments.length,
            avgScore: course.avgScore,
            passRate: course.passRate,
            failureRate: course.failureRate,
            avgAttendance: course.avgAttendance,
            assignmentCompletionRate: course.assignmentCompletionRate,
            riskDistribution: course.riskDistribution
        }
    });
});
exports.default = router;
