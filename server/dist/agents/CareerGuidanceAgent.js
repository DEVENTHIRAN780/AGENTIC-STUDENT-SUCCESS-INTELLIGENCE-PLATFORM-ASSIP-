"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerGuidanceAgent = void 0;
class CareerGuidanceAgent {
    static mapCareerPathways(student, enrollments) {
        let recommendedRole = 'Full Stack Software Engineer';
        let skillsToDevelop = ['Distributed Systems', 'Docker & Kubernetes', 'System Design'];
        let currentStrengths = ['Data Structures', 'Database Systems', 'Algorithms'];
        if (student.department === 'CSE' || student.department === 'IT') {
            const mlCourse = enrollments.find(e => e.courseCode.includes('CS502') || e.courseName.toLowerCase().includes('intelligence'));
            if (mlCourse && mlCourse.marksScore >= 85) {
                recommendedRole = 'Machine Learning Engineer / AI Architect';
                skillsToDevelop = ['PyTorch', 'Vector Databases & Embeddings', 'LLM Fine-Tuning & Quantization', 'MLOps'];
                currentStrengths = ['Python', 'Linear Algebra', 'Supervised Learning Algorithms', 'SQL'];
            }
            else {
                recommendedRole = 'Cloud Solutions Architect & Backend Engineer';
                skillsToDevelop = ['Go / Rust', 'Kubernetes Cluster Orchestration', 'Microservices Observability', 'Terraform'];
                currentStrengths = ['RESTful APIs', 'SQL Database Design', 'Object-Oriented Architecture'];
            }
        }
        else if (student.department === 'ECE') {
            recommendedRole = 'Embedded Systems & IoT Solutions Engineer';
            skillsToDevelop = ['Embedded C/C++', 'RTOS Programming', 'ARM Cortex Architecture', 'PCB Design'];
            currentStrengths = ['Digital Signal Processing', 'Microprocessors', 'Circuit Analysis'];
        }
        else if (student.department === 'EEE') {
            recommendedRole = 'Smart Grid & Renewable Energy Systems Engineer';
            skillsToDevelop = ['SCADA Systems', 'MATLAB Simulink Power Modeling', 'High-Voltage Switchgear', 'Battery Management Systems'];
            currentStrengths = ['Power Electronics', 'Control Systems', 'Electrical Machines'];
        }
        else if (student.department === 'Mechanical') {
            recommendedRole = 'CAD/CAE Design & Thermal Simulation Engineer';
            skillsToDevelop = ['ANSYS FEA Simulation', 'SolidWorks 3D Modeling', 'Computational Fluid Dynamics (CFD)', 'Additive Manufacturing'];
            currentStrengths = ['Thermodynamics', 'Fluid Mechanics', 'Engineering Materials'];
        }
        else {
            recommendedRole = 'Structural Design & BIM Infrastructure Engineer';
            skillsToDevelop = ['Autodesk Revit BIM', 'STAAD Pro FEA', 'Geo-technical Slope Modeling', 'Green Building LEED Standards'];
            currentStrengths = ['Structural Analysis', 'Soil Mechanics', 'Concrete Technology'];
        }
        const recommendedCertifications = [
            {
                name: student.department === 'CSE' || student.department === 'IT' ? 'AWS Certified Solutions Architect – Associate' :
                    student.department === 'ECE' ? 'Arm Certified Engineer (SoC/Embedded)' :
                        student.department === 'EEE' ? 'IEEE Certified Power Systems Associate' :
                            student.department === 'Mechanical' ? 'Certified SolidWorks Professional (CSWP)' : 'Autodesk Certified Professional: Revit for Structural Design',
                issuer: student.department === 'CSE' || student.department === 'IT' ? 'Amazon Web Services' :
                    student.department === 'ECE' ? 'ARM Ltd.' :
                        student.department === 'EEE' ? 'IEEE' :
                            student.department === 'Mechanical' ? 'Dassault Systèmes' : 'Autodesk',
                relevance: 'Demonstrates verified practical proficiency to enterprise recruitment partners.',
                estimatedPrepWeeks: 6
            },
            {
                name: 'GitHub Certified Foundations / DevOps Workflow',
                issuer: 'GitHub / Linux Foundation',
                relevance: 'Validates modern collaborative development and continuous integration skills.',
                estimatedPrepWeeks: 4
            }
        ];
        const suggestedProjects = [
            {
                title: student.department === 'CSE' || student.department === 'IT' ? 'Distributed Real-Time Student Analytics Pipeline' :
                    student.department === 'ECE' ? 'Smart Sensor Gateway with LoRaWAN & MQTT Telemetry' :
                        student.department === 'EEE' ? 'Microgrid Solar-Battery Inverter Controller' :
                            student.department === 'Mechanical' ? 'Topology-Optimized Automotive Suspension Arm' : 'Earthquake-Resistant Multi-Story RC Frame Analysis',
                description: 'End-to-end production-grade project designed to showcase on your portfolio during campus placement drives.',
                techStack: student.department === 'CSE' || student.department === 'IT' ? ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'] :
                    student.department === 'ECE' ? ['C++', 'FreeRTOS', 'ESP32', 'MQTT'] :
                        student.department === 'EEE' ? ['MATLAB', 'Simulink', 'Arduino DSP'] :
                            student.department === 'Mechanical' ? ['ANSYS', 'SolidWorks', 'Python SciPy'] : ['STAAD Pro', 'AutoCAD', 'Revit'],
                difficulty: 'Advanced'
            }
        ];
        return {
            studentId: student.id,
            recommendedRole,
            matchScorePct: Math.min(96, Math.max(68, Math.round(student.gpa * 10 + 6))),
            marketDemand: 'Very High',
            currentStrengths,
            skillsToDevelop,
            recommendedCertifications,
            suggestedProjects,
            internshipPreparationAdvice: [
                'Complete 1 verified domain project on your GitHub / LinkedIn portfolio.',
                'Schedule a mock technical interview with Department Placement Cell advisors.',
                'Review core departmental interview questions 3 weeks prior to recruitment cycle.'
            ]
        };
    }
}
exports.CareerGuidanceAgent = CareerGuidanceAgent;
