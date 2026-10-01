# REST API SPECIFICATION: ASSIP

Base URL: `http://localhost:5000/api`

All protected endpoints accept the `Authorization: Bearer <token>` header or the `x-demo-role: <role>` test header.

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user via institutional email and password or demo identity.
- **Request Body:**
  ```json
  {
    "email": "advisor@demo.com",
    "password": "password123",
    "rememberMe": true
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr-advisor-1",
      "email": "advisor@demo.com",
      "role": "advisor",
      "name": "Prof. Rajeshwar Kulkarni",
      "department": "IT"
    }
  }
  ```

### `POST /auth/register`
Creates a new institutional user profile.
- **Request Body:**
  ```json
  {
    "name": "Prof. Ananya Sen",
    "email": "ananya.sen@univ.edu",
    "role": "faculty",
    "department": "CSE"
  }
  ```

### `GET /auth/me`
Retrieves currently authenticated user profile.

---

## 2. Student & Academic Analytics Endpoints

### `GET /students`
Query parameters:
- `department`: `CSE | IT | ECE | EEE | Mechanical | Civil | all`
- `semester`: `1..8`
- `riskLevel`: `low | moderate | high | critical | all`
- `search`: String query
- `page`: Page number (default: `1`)
- `limit`: Items per page (default: `50`)

### `GET /students/:id`
Retrieves comprehensive Student 360° Profile: personal data, enrolled courses, risk decomposition, goals, study plans, and career guidance.

### `GET /students/:id/performance`
Retrieves time-series GPA progression, weekly attendance shifts, enrolled subjects with grades, and radar competency ratings.

### `GET /students/:id/risk`
Returns the `EarlyWarningAssessment` object containing:
- `riskScore`: integer 0–100
- `riskLevel`: `'low' | 'moderate' | 'high' | 'critical'`
- `contributingFactors`: array of signals, categories, and impact percentages
- `whyAmISeeingThis`: rule trigger, comparative cohort benchmark, confidence score

### `GET /students/:id/recommendations`
Triggers full multi-agent synthesis and returns proposed interventions, study plans, and outreach drafts.

---

## 3. Intervention Management Endpoints

### `GET /interventions`
Filters: `status`, `riskLevel`, `department`, `advisorId`, `studentId`.

### `POST /interventions`
Manually queues an academic intervention protocol.

### `PATCH /interventions/:id/status`
Human-in-the-loop approval endpoint.
- **Request Body:**
  ```json
  {
    "status": "Approved",
    "actorName": "Prof. Rajeshwar Kulkarni",
    "noteText": "Approved peer tutor assignment for Signals & Systems."
  }
  ```

### `POST /interventions/:id/notes`
Adds case note to intervention dossier.

---

## 4. Multi-Agent AI Endpoints

### `POST /ai/chat`
Success Copilot conversational interface.
- **Request Body:**
  ```json
  {
    "studentId": "std-1001",
    "message": "Explain my risk"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "reply": "Hi Alex. Here is a breakdown of your current Academic Health...",
    "suggestedActions": ["Create study plan", "Plan this week's study"],
    "contextMetrics": { "gpa": 8.42, "attendance": 91, "academicHealth": 82, "riskLevel": "low" }
  }
  ```

### `POST /ai/generate-study-plan`
Triggers `StudyCoachAgent` to construct adaptive 7-day milestone schedule.

### `POST /ai/generate-intervention`
Triggers `InterventionAgent` to draft proposed intervention protocol.

### `GET /ai/insights`
Retrieves institutional emerging signals, performance patterns, and macro opportunities.

### `GET /ai/agent-activity`
Returns live execution stream across all 7 agents.

---

## 5. Course Intelligence & Analytics

### `GET /courses`
Filters: `department`, `semester`, `search`.

### `GET /courses/:id`
Returns enrollment stats, failure rate, attendance average, and syllabus flags.

### `GET /analytics/overview`
Executive KPI overview: total students, retention rate, average GPA, risk stratification distribution.

### `GET /analytics/departments`
Neutral comparative metrics across CSE, IT, ECE, EEE, Mechanical, and Civil.

---

## 6. Batch Data Ingestion

### `POST /data-import/preview`
Validates CSV string without committing.

### `POST /data-import/commit`
Commits parsed CSV rows to database and logs audit entry.
