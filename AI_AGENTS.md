# MULTI-AGENT AI SYSTEM SPECIFICATION: ASSIP

## 1. Overview
ASSIP implements an agentic multi-agent architecture featuring seven specialized, cooperating AI agents. Rather than deploying a generic single chatbot, each agent has a focused domain responsibility with mathematical risk modeling, explainability heuristics, and human oversight.

---

## 2. The 7 Specialized AI Agents

### Agent 1: Academic Monitoring Agent
- **Purpose:** Continuous background surveillance of student velocity.
- **Inputs:** Daily lecture attendance, weekly lab submissions, quiz marks, LMS portal session duration.
- **Mathematical Health Metric:**
  $$\text{Academic Health} = \left(\frac{\text{GPA}}{10} \times 35\right) + \left(\text{Attendance \%} \times 0.40\right) + \left(\text{Submission Rate \%} \times 0.25\right)$$
- **Output:** Health score (0–100) and flagging of subject-level velocity anomalies.

---

### Agent 2: Early Warning Agent
- **Purpose:** Early detection of academic failure, regulatory debarment, or semester withdrawal risks.
- **Risk Score Formula:**
  $$\text{Risk Score} = W_{\text{att}} \cdot \Delta_{\text{att}} + W_{\text{asgn}} \cdot \frac{N_{\text{missing}}}{N_{\text{total}}} \times 100 + W_{\text{grade}} \cdot \left(\frac{10 - \text{GPA}}{10}\right) \times 100$$
  - Normalized range: **0 to 100**
  - **0 – 30:** Low Risk (nominal progression)
  - **31 – 60:** Moderate Risk (attendance drift / 1 missed deadline)
  - **61 – 80:** High Risk (significant midterm drop / 2+ missing assignments)
  - **81 – 100:** Critical Risk (regulatory minimum attendance breach <75% / exam debarment warning)
- **Explainability Contract:** Every score decomposes into discrete contributing factors with empirical impact weights (e.g. `Attendance dropped 24% [35% Impact]`).

---

### Agent 3: Academic Planning Agent
- **Purpose:** Degree completion pathing and curriculum trajectory optimization.
- **Capabilities:**
  - 4-year degree roadmap visualization (Year 1 to Year 4).
  - Prerequisite graph verification (e.g. *Databases CS303* required prior to *Full Stack IT602*).
  - Recommends career-aligned departmental electives based on student performance strengths.

---

### Agent 4: Study Coach Agent
- **Purpose:** Personalized, adaptive revision scheduling.
- **Inputs:** Lowest-scoring enrolled courses, upcoming midterm examination dates, weekly study hours.
- **Outputs:**
  - Day-by-day 60–90 minute deep-work blocks.
  - Balances 60% time on weak subjects (e.g. Operating Systems semaphores) and 40% on maintenance.
  - Interactive checkboxes with velocity tracking.

---

### Agent 5: Intervention Agent
- **Purpose:** Recommends targeted remedial protocols.
- **Protocol Types:**
  - `Academic Advising` (1-on-1 strategic session)
  - `Tutoring` (Peer tutor assignment)
  - `Attendance Support` (Remedial lab practical agreement)
  - `Faculty Meeting` (Department HoD conference)
  - `Peer Mentoring` (Senior student pairing)
  - `Career Guidance` (Industry pathway mapping)
- **Human-in-the-Loop Mandate:** All proposals are generated in `Pending Review` status. **No student is penalized, notified of formal action, or reassigned without advisor authorization.**

---

### Agent 6: Career Guidance Agent
- **Purpose:** Translates academic excellence into market placement readiness.
- **Outputs:**
  - Matching career roles (e.g. *Cloud Solutions Architect*, *ML Engineer*, *VLSI Designer*).
  - Recommended industry certifications (AWS Solutions Architect, Cadence, SolidWorks CSWP).
  - Suggested GitHub placement portfolio projects with technical architectures.

---

### Agent 7: Communication Agent
- **Purpose:** Empathetic, supportive student correspondence and advisor briefing dossiers.
- **Tone Matrix:** Empathetic and non-punitive for students; concise and data-driven for advisors.
- **Governance:** Drafts are held in `draft_pending_human_review` until advisor verification.

---

## 3. Explainable AI (XAI) Architecture

Every inference satisfies the **Four-Point Transparency Standard**:
1. **Rule Triggered:** Specifies which regulatory governance rule was evaluated (e.g. `Rule ERW-401`).
2. **Cohort Benchmark:** Compares student's metrics to departmental averages.
3. **Confidence Rating:** Outputs Bayesian confidence percentage (e.g. `94.6% Confidence`).
4. **Actionable Remediation:** Directly outputs what the student and advisor should execute next.

---

## 4. AI Provider Architecture (Dual-Mode)

```typescript
// AIProvider abstraction
export class AIProvider {
  // If AI_API_KEY is present in environment:
  // Dispatches to OpenAI / Anthropic / custom LLM endpoint
  
  // If AI_API_KEY is omitted:
  // Instantly utilizes built-in Enterprise Mock Reasoning Engine
  // with zero configuration or API fees.
}
```
This guarantees that ASSIP functions immediately out of the box in offline hackathons, academic presentations, and development laptops while remaining production-ready for LLM API scaling.
