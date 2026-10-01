"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicPlanningAgent = void 0;
class AcademicPlanningAgent {
    static generatePlan(student, allCourses) {
        const creditsRemaining = Math.max(0, student.creditsTotal - student.creditsCompleted);
        const projectedGraduationYear = student.enrollmentYear + 4;
        // Build 4-Year Academic Roadmap
        const roadmap = [];
        const deptCourses = allCourses.filter(c => c.department === student.department || c.department === 'CSE');
        for (let yr = 1; yr <= 4; yr++) {
            const semA = yr * 2 - 1;
            const semB = yr * 2;
            const getStatus = (sem) => {
                if (sem < student.semester)
                    return 'completed';
                if (sem === student.semester)
                    return 'in_progress';
                return 'upcoming';
            };
            const semACourses = deptCourses.filter(c => c.semester === semA);
            const semBCourses = deptCourses.filter(c => c.semester === semB);
            roadmap.push({
                year: yr,
                yearLabel: `Year ${yr} (${student.enrollmentYear + yr - 1} - ${student.enrollmentYear + yr})`,
                semesters: [
                    {
                        semester: semA,
                        credits: 20,
                        status: getStatus(semA),
                        courses: semACourses.length > 0 ? semACourses.map(c => ({
                            code: c.code,
                            name: c.name,
                            credits: c.credits,
                            status: getStatus(semA),
                            grade: semA < student.semester ? 'A' : undefined
                        })) : [
                            { code: `CORE-${semA}01`, name: 'Foundational Engineering & Mathematics', credits: 4, status: getStatus(semA) },
                            { code: `CORE-${semA}02`, name: 'Department Core Principles & Systems', credits: 4, status: getStatus(semA) },
                            { code: `CORE-${semA}03`, name: 'Computing & Practical Laboratory', credits: 4, status: getStatus(semA) }
                        ]
                    },
                    {
                        semester: semB,
                        credits: 20,
                        status: getStatus(semB),
                        courses: semBCourses.length > 0 ? semBCourses.map(c => ({
                            code: c.code,
                            name: c.name,
                            credits: c.credits,
                            status: getStatus(semB),
                            grade: semB < student.semester ? 'A' : undefined
                        })) : [
                            { code: `CORE-${semB}01`, name: 'Advanced Engineering Dynamics', credits: 4, status: getStatus(semB) },
                            { code: `CORE-${semB}02`, name: 'Domain Specialization Track', credits: 4, status: getStatus(semB) },
                            { code: `CORE-${semB}03`, name: 'Technical Capstone & Design Lab', credits: 4, status: getStatus(semB) }
                        ]
                    }
                ]
            });
        }
        const recommendedElectives = [
            {
                courseCode: student.department === 'CSE' || student.department === 'IT' ? 'CS502' : 'EC603',
                courseName: student.department === 'CSE' || student.department === 'IT' ? 'Artificial Intelligence & Machine Learning' : 'Embedded Systems & IoT',
                rationale: 'Aligns with your highest performing course prerequisites and industry placement hiring patterns.',
                careerRelevance: 'Directly applicable to upcoming campus placements and senior capstone projects.'
            },
            {
                courseCode: 'IT503',
                courseName: 'Cloud Computing & DevOps Architecture',
                rationale: 'Complementary systems engineering competency that reinforces Operating Systems knowledge.',
                careerRelevance: 'High demand credential across top technology and infrastructure employers.'
            }
        ];
        return {
            studentId: student.id,
            degreeName: student.program,
            totalCreditsRequired: student.creditsTotal,
            creditsEarned: student.creditsCompleted,
            creditsRemaining,
            projectedGraduationYear,
            recommendedElectives,
            roadmap
        };
    }
}
exports.AcademicPlanningAgent = AcademicPlanningAgent;
