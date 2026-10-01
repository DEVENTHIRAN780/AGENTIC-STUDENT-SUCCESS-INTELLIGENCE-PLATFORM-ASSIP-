# SYSTEM ARCHITECTURE: ASSIP

## 1. High-Level System Architecture

The **Agentic Student Success Intelligence Platform (ASSIP)** utilizes a modern, resilient decoupled full-stack architecture designed for high availability, low latency, and enterprise security.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  React 19 + TypeScript + Vite + Tailwind CSS + Recharts + Lucide       │
│                                                                        │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│  │ Student Dashboard │  │ Advisor Workspace │  │ Admin Dashboard   │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐   │
│  │ Success Copilot   │  │ Early Warning Q   │  │ Department Intel  │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON API (JWT Bearer)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY LAYER                            │
│  Express.js + TypeScript + Security Middleware (CORS, Rate Limiting)   │
│  Authentication & Role Guard: [Student | Faculty | Advisor | Admin]    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   AGENT ORCHESTRATION PIPELINE                         │
│                                                                        │
│   Student Record ──► Context Builder ──► Monitoring Agent              │
│                                                 │                      │
│                                                 ▼                      │
│   Human Review ◄── Intervention Agent ◄── Early Warning Agent          │
│        │                                                               │
│        ▼                                                               │
│   [Approve | Modify | Reject] ──► Outcome Tracking ──► Audit Log       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐   ┌────────────────────────────────┐
│        AI PROVIDER LAYER          │   │      PERSISTENCE LAYER         │
│  • Built-in Offline Mock Engine   │   │  • PostgreSQL / Store Service  │
│  • Pluggable OpenAI / LLM API     │   │  • 105+ Indian Student Records │
│  • Temperature & Token Controls   │   │  • 30 Departmental Courses     │
└───────────────────────────────────┘   └────────────────────────────────┘
```

---

## 2. Multi-Agent Pipeline Lifecycle

ASSIP's intelligence engine operates as an autonomous, multi-agent pipeline:

1. **Context Ingestion:** The `AgentOrchestrator` aggregates continuous academic records: GPA trajectory, midterm marks, biometric attendance, and LMS assignment completions.
2. **Academic Monitoring:** The `AcademicMonitoringAgent` computes the composite Academic Health Score (0-100) and detects velocity shifts across individual syllabus modules.
3. **Early Warning Diagnosis:** The `EarlyWarningAgent` executes the multi-factor risk formula, assigning the 0-100 score, tier (Low, Moderate, High, Critical), and decomposing contributing root causes.
4. **Adaptive Planning & Guidance:**
   - The `AcademicPlanningAgent` constructs 4-year degree completion trajectories.
   - The `StudyCoachAgent` synthesizes daily/weekly study blocks focusing on lowest-scoring subjects.
   - The `CareerGuidanceAgent` maps student strengths to enterprise certifications and capstone projects.
5. **Human-in-the-Loop Safeguard:** The `InterventionAgent` drafts intervention protocols with initial status `Pending Review`. **Crucially, no punitive or remedial actions are taken automatically without faculty or advisor authorization.**
6. **Communication Dispatch:** The `CommunicationAgent` prepares empathetic outreach messages reviewable by the advisor prior to delivery.

---

## 3. Human-in-the-Loop Intervention State Machine

```
              ┌──────────────────────────┐
              │  AI Trigger: New Signal  │
              └─────────────┬────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │   STATUS: Pending Review │
              └─────────────┬────────────┘
                            │
             Advisor Evaluates in Early Warning Queue
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Approved   │    │    Modify    │    │    Reject    │
└───────┬──────┘    └───────┬──────┘    └───────┬──────┘
        │                   │                   │
        └─────────► ┌───────┴──────┐            ▼
                    │  In Progress │         [Closed]
                    └───────┬──────┘
                            │ Student Outcome Measured
                            ▼
                    ┌──────────────┐
                    │  Completed   │ (Target met / Attendance restored)
                    └──────────────┘
```

---

## 4. Design System Tokens & Aesthetics

- **Color Palette:**
  - Dark Navy Background: `#070d18`, `#0f172a`, `#0b1120`
  - Electric Cyan Highlight: `#06b6d4`, `#22d3ee`
  - Brand Indigo Accent: `#0c8ee9`, `#0170c7`
  - Severity Warning Colors:
    - Critical: Crimson (`#ef4444`, `bg-red-500/10`)
    - High: Orange (`#f97316`, `bg-orange-500/10`)
    - Moderate: Amber (`#f59e0b`, `bg-amber-500/10`)
    - Low: Emerald (`#10b981`, `bg-emerald-500/10`)
- **Typography:**
  - Headings & Interface: Plus Jakarta Sans
  - Data points & Codes: JetBrains Mono
- **Glassmorphism:**
  - Backdrop blur (`backdrop-blur-md`), 1px translucent borders (`border-slate-800/80`), soft gradient glows (`shadow-glow-cyan`).
