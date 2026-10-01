# RELATIONAL DATABASE ARCHITECTURE & SCHEMA: ASSIP

## 1. Overview
ASSIP is designed for production deployment on **PostgreSQL / Supabase** with fully indexed relational tables, foreign key integrity constraints, and immutable audit logs. The current runtime includes a high-performance in-memory relational store seed with over 105 realistic student profiles, 30 departmental engineering courses, and multi-semester historical trajectories.

---

## 2. Entity Relationship Diagram (ERD)

```
       ┌──────────────┐             ┌──────────────┐
       │    users     │1           *│  audit_logs  │
       └──────┬───────┘             └──────────────┘
              │1
              │
              ▼1
       ┌──────────────┐1           *┌──────────────┐
       │   students   ├────────────►│ enrollments  │
       └──────┬───────┘             └──────┬───────┘
              │1                           │*
              │                            │
              ├───────────┐         ┌──────▼───────┐
              │*          │*        │   courses    │
       ┌──────▼──────┐ ┌──▼────────┐└──────────────┘
       │interventions│ │study_plans│
       └──────┬──────┘ └───────────┘
              │1
              │*
       ┌──────▼───────────┐
       │intervention_notes│
       └──────────────────┘
```

---

## 3. SQL Relational Table DDL

```sql
-- Core Authentication & Users
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'faculty', 'advisor', 'admin')),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    department VARCHAR(32) NOT NULL,
    phone VARCHAR(32),
    student_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Students Profile Registry
CREATE TABLE students (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar TEXT,
    department VARCHAR(32) NOT NULL,
    program VARCHAR(255) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    enrollment_year INT NOT NULL,
    gpa NUMERIC(4,2) NOT NULL CHECK (gpa BETWEEN 0.00 AND 10.00),
    cgpa NUMERIC(4,2) NOT NULL CHECK (cgpa BETWEEN 0.00 AND 10.00),
    attendance_pct INT NOT NULL CHECK (attendance_pct BETWEEN 0 AND 100),
    credits_completed INT NOT NULL DEFAULT 0,
    credits_total INT NOT NULL DEFAULT 160,
    academic_health INT NOT NULL CHECK (academic_health BETWEEN 0 AND 100),
    risk_level VARCHAR(16) NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_trend VARCHAR(16) NOT NULL CHECK (risk_trend IN ('up', 'down', 'stable')),
    risk_change INT DEFAULT 0,
    primary_signal TEXT,
    advisor_id VARCHAR(64),
    advisor_name VARCHAR(255),
    mentor_name VARCHAR(255),
    tags TEXT[]
);
CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_students_risk ON students(risk_level);
CREATE INDEX idx_students_semester ON students(semester);

-- Courses Registry
CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(32) NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    faculty_id VARCHAR(64),
    faculty_name VARCHAR(255),
    enrollment_count INT DEFAULT 0,
    avg_score NUMERIC(5,2) DEFAULT 75.0,
    pass_rate NUMERIC(5,2) DEFAULT 90.0,
    failure_rate NUMERIC(5,2) DEFAULT 10.0,
    avg_attendance NUMERIC(5,2) DEFAULT 85.0,
    assignment_completion_rate NUMERIC(5,2) DEFAULT 88.0,
    risk_distribution JSONB,
    flags TEXT[]
);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_dept ON courses(department);

-- Student Course Enrollments & Grades
CREATE TABLE enrollments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    course_code VARCHAR(32) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    grade VARCHAR(8),
    marks_score NUMERIC(5,2) NOT NULL,
    attendance_pct INT NOT NULL,
    assignments_completed INT NOT NULL,
    total_assignments INT NOT NULL,
    midterm_score NUMERIC(5,2),
    final_exam_score NUMERIC(5,2),
    status VARCHAR(32) DEFAULT 'enrolled'
);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Early Warning Interventions (Human-in-the-Loop)
CREATE TABLE interventions (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    student_dept VARCHAR(32) NOT NULL,
    student_semester INT NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    risk_score INT NOT NULL,
    type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('New', 'Pending Review', 'Approved', 'In Progress', 'Completed', 'Escalated', 'Closed')),
    priority VARCHAR(16) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ai_generated BOOLEAN DEFAULT TRUE,
    ai_explanation TEXT,
    contributing_signals TEXT[],
    recommended_action TEXT,
    assigned_advisor_id VARCHAR(64),
    assigned_advisor_name VARCHAR(255),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    outcome TEXT
);
CREATE INDEX idx_interventions_status ON interventions(status);
CREATE INDEX idx_interventions_priority ON interventions(priority);

-- Intervention Case Notes
CREATE TABLE intervention_notes (
    id VARCHAR(64) PRIMARY KEY,
    intervention_id VARCHAR(64) REFERENCES interventions(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(32) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    text TEXT NOT NULL
);

-- Adaptive Study Plans
CREATE TABLE study_plans (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    week_range VARCHAR(64),
    target_gpa NUMERIC(4,2),
    focus_areas TEXT[],
    daily_schedule JSONB NOT NULL,
    ai_generated BOOLEAN DEFAULT TRUE,
    generated_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Goals
CREATE TABLE goals (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(32) NOT NULL,
    current_val NUMERIC(6,2),
    target_val NUMERIC(6,2),
    metric_unit VARCHAR(32),
    deadline DATE,
    progress_pct INT DEFAULT 0,
    ai_recommendations TEXT[],
    status VARCHAR(32) DEFAULT 'in_progress'
);

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_user_id VARCHAR(64),
    recipient_role VARCHAR(32),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    priority VARCHAR(16) DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Institutional Audit Logs
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(32) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    result VARCHAR(32) NOT NULL CHECK (result IN ('success', 'failure', 'warning')),
    details TEXT,
    ip_address VARCHAR(45)
);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```
