import { Router, Request, Response } from 'express';
import { db } from '../database/store.js';

const router = Router();

// GET /api/courses
router.get('/', (req: Request, res: Response): void => {
  const { department, semester, search } = req.query;

  const courses = db.getCourses({
    department: department as string,
    semester: semester ? Number(semester) : undefined,
    search: search as string
  });

  res.json({
    total: courses.length,
    courses
  });
});

// GET /api/courses/:id
router.get('/:id', (req: Request, res: Response): void => {
  const courseId = req.params.id as string;
  const course = db.getCourseById(courseId);
  if (!course) {
    res.status(404).json({ error: 'Course not found.' });
    return;
  }

  const enrollments = db.getEnrollmentsByCourse(course.id);

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

export default router;
