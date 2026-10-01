import { Student, Enrollment, StudyPlan, StudyPlanDay } from '../types/index.js';

export class StudyCoachAgent {
  public static generatePersonalizedStudyPlan(
    student: Student,
    enrollments: Enrollment[],
    goals: any[] = []
  ): StudyPlan {
    // Identify weak subjects (lowest marksScore or attendance)
    const sortedCourses = [...enrollments].sort((a, b) => a.marksScore - b.marksScore);
    const weakCourse = sortedCourses[0] || { courseName: 'Core Engineering Subject', courseCode: 'ENG301' };
    const secondaryCourse = sortedCourses[1] || { courseName: 'Mathematics & Analysis', courseCode: 'MA301' };
    const strongCourse = sortedCourses[sortedCourses.length - 1] || { courseName: 'Systems Programming', courseCode: 'SYS301' };

    const today = new Date();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dailySchedule: StudyPlanDay[] = [];

    daysOfWeek.forEach((day, index) => {
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + index);
      const dateStr = taskDate.toISOString().split('T')[0];

      let tasks: StudyPlanDay['tasks'] = [];

      if (index === 0) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: weakCourse.courseName,
            topic: 'Diagnostic Problem Solving & Core Concepts Review',
            durationMinutes: 90,
            priority: 'high',
            completed: false,
            type: 'revision'
          },
          {
            id: `tsk-gen-${index}-2`,
            subject: secondaryCourse.courseName,
            topic: 'Practice Problem Set #3: Algorithmic Verification',
            durationMinutes: 60,
            priority: 'medium',
            completed: false,
            type: 'practice'
          }
        ];
      } else if (index === 1) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: weakCourse.courseName,
            topic: 'Midterm Past Papers: Section A & B Practice',
            durationMinutes: 90,
            priority: 'high',
            completed: false,
            type: 'practice'
          },
          {
            id: `tsk-gen-${index}-2`,
            subject: strongCourse.courseName,
            topic: 'Advanced Lecture Notes & Summary Synthesis',
            durationMinutes: 45,
            priority: 'low',
            completed: false,
            type: 'lecture_prep'
          }
        ];
      } else if (index === 2) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: secondaryCourse.courseName,
            topic: 'Assignment Catch-up Sprint: Module 3 Deliverable',
            durationMinutes: 75,
            priority: 'high',
            completed: false,
            type: 'assignment'
          },
          {
            id: `tsk-gen-${index}-2`,
            subject: weakCourse.courseName,
            topic: 'Faculty Office Hours Preparation: 3 Specific Questions',
            durationMinutes: 30,
            priority: 'medium',
            completed: false,
            type: 'revision'
          }
        ];
      } else if (index === 3) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: weakCourse.courseName,
            topic: 'Deep-dive into Low-Scoring Quiz Topics',
            durationMinutes: 90,
            priority: 'high',
            completed: false,
            type: 'revision'
          },
          {
            id: `tsk-gen-${index}-2`,
            subject: strongCourse.courseName,
            topic: 'Semester Capstone Project Milestone Code Review',
            durationMinutes: 60,
            priority: 'medium',
            completed: false,
            type: 'practice'
          }
        ];
      } else if (index === 4) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: weakCourse.courseName,
            topic: 'Laboratory Pre-Lab Exercises & Code Execution',
            durationMinutes: 60,
            priority: 'high',
            completed: false,
            type: 'practice'
          },
          {
            id: `tsk-gen-${index}-2`,
            subject: 'Review Block',
            topic: 'Speed Flashcards & Concept Recall Drill',
            durationMinutes: 45,
            priority: 'medium',
            completed: false,
            type: 'revision'
          }
        ];
      } else if (index === 5) {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: 'Timed Exam Simulation',
            topic: `Full Mock Examination: ${weakCourse.courseCode} 90-Minute Paper`,
            durationMinutes: 120,
            priority: 'high',
            completed: false,
            type: 'practice'
          }
        ];
      } else {
        tasks = [
          {
            id: `tsk-gen-${index}-1`,
            subject: 'Weekly Retrospective',
            topic: 'Review Completed Tasks vs Target GPA Goals with Success Copilot',
            durationMinutes: 45,
            priority: 'low',
            completed: false,
            type: 'revision'
          }
        ];
      }

      dailySchedule.push({
        day,
        date: dateStr,
        tasks
      });
    });

    const targetGpa = goals.length > 0 && goals[0].category === 'gpa' 
      ? goals[0].targetVal 
      : Math.min(10, Number((student.gpa + 0.4).toFixed(2)));

    return {
      id: `plan-${Date.now()}`,
      studentId: student.id,
      title: `AI Adaptive Recovery & Mastery Plan (${weakCourse.courseCode})`,
      weekRange: `${dailySchedule[0].date} — ${dailySchedule[6].date}`,
      targetGpa,
      focusAreas: [
        `${weakCourse.courseName} (${weakCourse.courseCode}) — Priority Focus`,
        `${secondaryCourse.courseName} (${secondaryCourse.courseCode}) — Practice Maintenance`,
        'Weekly Mock Testing & Time Management'
      ],
      dailySchedule,
      aiGenerated: true,
      generatedBy: 'Study Coach Agent',
      createdAt: new Date().toISOString()
    };
  }
}
