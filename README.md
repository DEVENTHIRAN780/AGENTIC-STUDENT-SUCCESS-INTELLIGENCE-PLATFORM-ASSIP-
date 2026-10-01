# AGENTIC STUDENT SUCCESS INTELLIGENCE PLATFORM (ASSIP)

> **"Detect Early. Act Intelligently. Help Every Student Succeed."**

ASSIP is an enterprise AI-powered student success intelligence ecosystem built for universities, engineering colleges, and higher education institutions. It continuously analyzes student academic, engagement, and attendance data through seven specialized autonomous AI agents, detects early warning distress signals, generates personalized action plans, and empowers advisors and leadership with actionable institutional analytics while maintaining strict **human-in-the-loop** approval safeguards.

---

## 🌟 Key Features

### 1. Multi-Agent AI Ecosystem (7 Specialized Agents)
- **Academic Monitoring Agent:** Continuously analyzes GPA, marks, attendance, and assignment completion.
- **Early Warning Agent:** Calculates compound 0–100 risk score and decomposes root causes (0-30 Low, 31-60 Moderate, 61-80 High, 81-100 Critical).
- **Academic Planning Agent:** Generates 4-year degree roadmap, prerequisite trees, and elective recommendations.
- **Study Coach Agent:** Synthesizes adaptive daily/weekly study plans targeting weak subjects and approaching exams.
- **Intervention Agent:** Drafts human-in-the-loop intervention protocols: peer tutoring, attendance remediation, and advising check-ins.
- **Career Guidance Agent:** Correlates student performance with high-demand placements, certifications (AWS, Cadence, SolidWorks), and capstone projects.
- **Communication Agent:** Drafts empathetic student outreach emails and advisor briefings reviewable prior to dispatch.

### 2. Explainable AI (XAI)
- Every risk score includes full signal decomposition (e.g. *Attendance ↓ 18%*, *3 assignments missing*, *Exam score 15% below cohort average*).
- Interactive **"Why am I seeing this?"** diagnostic modal explaining rule triggers, comparative cohort benchmarks, confidence scores, and historical validations.

### 3. Role-Based Workspaces & Personas
- **Student Dashboard:** Real-time GPA (8.42), attendance (91%), credits completed (86/160), academic health score (82/100), graduation progress tracker, GPA & attendance trend charts, radar competencies, and context-aware **Success Copilot**.
- **Academic Advisor Workspace:** Prioritized Early Warning Queue, comprehensive Student 360° Profile, case notes, and 1-click intervention approvals.
- **Faculty Teaching Console:** Assigned classes, grade curves, attendance drop detection, struggling student alerts, and broadcast announcements.
- **Institutional Executive Dashboard:** Macro KPIs, retention rate (94.2%), neutral department comparisons (CSE, IT, ECE, EEE, Mechanical, Civil), live agent activity stream, batch CSV import, and audit logging.

### 4. Interactive Tools
- **AI Study Planner:** Day-by-day study schedule with completion toggling and AI generation button.
- **Degree Roadmap:** 4-year visual curriculum timeline with credit tracking and prerequisite trees.
- **Goals Tracker:** Measurable milestone progress with automated AI recommendations.
- **Global Search (Ctrl + K):** Command palette searching students, courses, interventions, and insights.
- **Dark & Light Mode:** Enterprise theme switching with persistent user preferences.

---

## 🔑 Demo Accounts (1-Click Quick-Switch)

The application includes pre-configured realistic Indian university personas:

| Role | Email | Password | Persona & Department |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `demo123` | Alex Kumar (B.Tech IT, Sem 5, ST2024-1001) |
| **Faculty** | `faculty@demo.com` | `demo123` | Dr. Sunita Ramanathan (Professor, CSE) |
| **Advisor** | `advisor@demo.com` | `demo123` | Prof. Rajeshwar Kulkarni (Senior Advisor, IT) |
| **Admin** | `admin@demo.com` | `demo123` | Dr. Meenakshi Sundaram (Dean of Academic Affairs) |

---

## 🛠️ Technology Stack

- **Frontend:**
  - React 19 + TypeScript + Vite
  - Tailwind CSS + Custom Design System
  - Lucide React (Clean enterprise iconography)
  - Recharts (Line, Bar, Donut, and Radar charts)
  - Plus Jakarta Sans & JetBrains Mono typography
- **Backend:**
  - Node.js + Express + TypeScript
  - JSON Web Tokens (JWT) + Role-based Middleware
  - Multi-Agent Orchestration Engine
  - In-Memory & Relational Store with 105+ students and 30 courses
  - Native Node Test Runner (`node:test`)
- **AI Engine:**
  - Dual Mode: Pluggable OpenAI/LLM API (`AI_API_KEY`) and Built-in Enterprise Offline Mock Reasoning Engine.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node.js v24.16.0)
- npm v9+

### Installation & Launch

1. Clone or navigate to the repository directory:
   ```bash
   cd "student platform"
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Launch development servers (starts both backend on port 5000 and client on port 5173):
   ```bash
   npm run dev
   ```

4. Or run client and server independently:
   ```bash
   # Terminal 1: Backend API
   cd server
   npm run dev

   # Terminal 2: Frontend Client
   cd client
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Running Automated Tests

To execute the unit and integration test suite:

```bash
cd server
npm test
```

Verifies:
- Database seed integrity (100+ students, 30 courses)
- JWT token generation and authentication
- Academic health score calibration
- Compound risk formulas and 4-tier classification
- 4-year degree roadmap generation
- Study Coach adaptive schedule generation
- Human-in-the-loop intervention approval workflow
- Career guidance skill mapping
- Empathetic communication drafting

---

## 📁 Repository Structure

```
├── client/                     # Frontend React + TypeScript application
│   ├── src/
│   │   ├── api/                # API client with endpoints & fallback
│   │   ├── components/
│   │   │   ├── admin/          # Admin dashboard, department & course analytics, CSV import, audit logs
│   │   │   ├── advisor/        # Advisor workspace, Early Warning Queue, Student 360 modal
│   │   │   ├── auth/           # Login, registration, and quick demo modal
│   │   │   ├── common/         # Navbar, Sidebar, CommandPalette, CopilotDrawer, RiskBadge, StatCard
│   │   │   ├── faculty/        # Faculty dashboard, class intelligence, announcements
│   │   │   ├── landing/        # Polished public landing page & hero
│   │   │   ├── notifications/  # Notification center
│   │   │   └── student/        # Student dashboard, study planner, roadmap, goals
│   │   ├── context/            # AuthContext and ThemeContext
│   │   ├── types/              # Domain TypeScript interfaces
│   │   ├── App.tsx             # Root routing and state shell
│   │   ├── main.tsx            # React root mount with providers
│   │   └── index.css           # Design tokens, fonts, and glassmorphic styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts          # Vite configuration with proxy to port 5000
│
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── agents/             # 7 AI Agents & AgentOrchestrator
│   │   ├── database/           # Relational store & 100+ student realistic seed data
│   │   ├── middleware/         # JWT auth and role authorization guards
│   │   ├── routes/             # REST endpoints (auth, students, interventions, courses, analytics, AI, etc.)
│   │   ├── tests/              # Automated test suite
│   │   ├── types/              # Backend data contracts
│   │   └── index.ts            # Server entrypoint
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                # Sample environment variables
├── ARCHITECTURE.md             # System architecture & multi-agent lifecycle
├── DATABASE.md                 # Relational database schema & entity documentation
├── API.md                      # REST API endpoints documentation
├── AI_AGENTS.md                # AI agent specifications & risk calculation logic
└── README.md                   # Project documentation
```

---

## 🔒 Security & Privacy (FERPA Compliance)
- Strict role-based access control preventing cross-student data leakage.
- Human authorization enforced on all remedial interventions.
- Audit trail recording all admin actions with IP, timestamp, and status.
- Zero hardcoded API keys; pluggable LLM layer.
#   A G E N T I C - S T U D E N T - S U C C E S S - I N T E L L I G E N C E - P L A T F O R M - A S S I P -  
 