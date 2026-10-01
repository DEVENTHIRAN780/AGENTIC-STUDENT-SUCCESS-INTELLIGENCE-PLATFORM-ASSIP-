import React from 'react';
import { 
  BrainCircuit, ShieldAlert, Sparkles, TrendingUp, Users, 
  ArrowRight, CheckCircle2, ShieldCheck, BarChart3, Bot, 
  BookOpen, Calendar, HelpCircle, GraduationCap, Lock, Award, 
  ChevronRight, Play, Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp: (role?: UserRole) => void;
  onOpenCopilot: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenCopilot }) => {
  const { quickSwitchRole } = useAuth();

  const handleLaunchRole = (role: UserRole) => {
    quickSwitchRole(role);
    onEnterApp(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden">
      {/* Public Top Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-cyan">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">
                ASSIP
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                Enterprise AI Education
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#agents" className="hover:text-cyan-400 transition-colors">7 AI Agents</a>
            <a href="#early-warning" className="hover:text-cyan-400 transition-colors">Early Warning</a>
            <a href="#governance" className="hover:text-cyan-400 transition-colors">Human Governance</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Privacy & Security</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchRole('advisor')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleLaunchRole('advisor')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-4 py-2 text-xs font-bold shadow-glow-cyan transition-all"
            >
              View Live Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold mb-6 shadow-glow-cyan animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Agentic Student Success Intelligence Platform (ASSIP)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Turn Student Data Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-brand-400 to-indigo-400 bg-clip-text text-transparent">
              Student Success.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed mb-10">
            An agentic intelligence platform that helps institutions identify risk earlier, personalize support, and guide every student toward their goals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunchRole('advisor')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white px-6 py-3.5 text-sm font-bold shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
            >
              Explore Platform
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLaunchRole('student')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-white px-6 py-3.5 text-sm font-semibold transition-all hover:border-slate-600"
            >
              <Play className="h-4 w-4 text-cyan-400" />
              Student View (Alex Kumar)
            </button>
          </div>

          {/* Quick Persona Switcher Chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400">Jump right into role:</span>
            <button
              onClick={() => handleLaunchRole('student')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              🎓 Student (Alex Kumar)
            </button>
            <button
              onClick={() => handleLaunchRole('faculty')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              👩‍🏫 Faculty (Dr. Sunita)
            </button>
            <button
              onClick={() => handleLaunchRole('advisor')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 transition-colors font-medium"
            >
              📋 Academic Advisor (Prof. Rajeshwar)
            </button>
            <button
              onClick={() => handleLaunchRole('admin')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-800/80 transition-colors font-medium"
            >
              🛡️ Admin / Dean (Dr. Meenakshi)
            </button>
          </div>
        </div>

        {/* Realistic Dashboard Mockup Preview */}
        <div className="max-w-6xl mx-auto mt-16 rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-3 font-mono text-slate-400 hidden sm:inline">
                https://assip.univ.edu/dashboard/early-warning-queue
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● AI Multi-Agent Engine Sync: 428 Records Evaluated
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Active Cohort</span>
              <p className="text-2xl font-extrabold text-white mt-1">1,842</p>
              <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">↑ 94.2% Retention</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Early Warning Flags</span>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">12 New</p>
              <span className="text-xs text-slate-400 mt-1 inline-block">Awaiting Advisor Review</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Interventions</span>
              <p className="text-2xl font-extrabold text-cyan-400 mt-1">38 Ongoing</p>
              <span className="text-xs text-emerald-400 font-semibold mt-1 inline-block">84% Improvement Rate</span>
            </div>
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Academic Health</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">82.4 / 100</p>
              <span className="text-xs text-slate-400 mt-1 inline-block">Avg GPA 7.98 (↑ 0.12)</span>
            </div>
          </div>

          {/* Sample Early Warning Queue Preview Row */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
              <span>PRIORITY EARLY WARNING QUEUE</span>
              <span className="text-cyan-400 hover:underline cursor-pointer" onClick={() => handleLaunchRole('advisor')}>
                View Full Queue →
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between p-3 rounded-lg bg-slate-850/80 border border-slate-700/60 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center">
                    RV
                  </div>
                  <div>
                    <p className="font-bold text-white">Rohan Verma (ST2024-1009)</p>
                    <p className="text-[11px] text-slate-400">B.Tech CSE • Sem 4 • Attendance dropped 24% & 3 lab assignments missing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/30">
                    CRITICAL (84)
                  </span>
                  <button 
                    onClick={() => handleLaunchRole('advisor')}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
                  >
                    Review Intervention
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Institutions */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/40 text-center">
        <p className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-6">
          Architected For World-Class Higher Education & Engineering Colleges
        </p>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 text-sm font-semibold text-slate-400">
          <span>IIT BOMBAY COHORT ENGINE</span>
          <span>IISC BANGALORE ANALYTICS</span>
          <span>BITS PILANI IT ACADEMY</span>
          <span>STANFORD EDTECH CONSORTIUM</span>
          <span>MIT OPENLEARNING PARTNER</span>
          <span>IMPERIAL COLLEGE RESEARCH</span>
        </div>
      </section>

      {/* 7 AI Agents Ecosystem Showcase */}
      <section id="agents" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full">
            Autonomous Multi-Agent Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Seven Specialized AI Agents Working In Sync
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            ASSIP replaces fragmented spreadsheets and late interventions with a proactive ecosystem of intelligent agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Academic Monitoring Agent',
              desc: 'Continuously monitors continuous GPA trends, exam marks, daily attendance, and assignment completion rates.',
              badge: 'Continuous Diagnostics',
              icon: BarChart3
            },
            {
              title: 'Early Warning Agent',
              desc: 'Computes compound 0–100 risk score, identifies sudden drops, and decomposes root-cause contributing factors.',
              badge: 'Predictive Signals',
              icon: ShieldAlert
            },
            {
              title: 'Academic Planning Agent',
              desc: 'Generates 4-year degree roadmaps, elective recommendations, prerequisite trees, and credit forecasts.',
              badge: 'Roadmap Generation',
              icon: Compass
            },
            {
              title: 'Study Coach Agent',
              desc: 'Synthesizes personalized daily & weekly study blocks focusing on weak subjects and approaching exam dates.',
              badge: 'Adaptive Tutoring',
              icon: Calendar
            },
            {
              title: 'Intervention Agent',
              desc: 'Drafts human-in-the-loop intervention protocols: peer tutoring, attendance remediation, and advising check-ins.',
              badge: 'Human-in-the-Loop',
              icon: Users
            },
            {
              title: 'Career Guidance Agent',
              desc: 'Correlates student course strengths with placement skills, certifications (AWS, Cadence), and portfolio projects.',
              badge: 'Pathway Optimization',
              icon: Award
            },
            {
              title: 'Communication Agent',
              desc: 'Drafts empathetic student emails, advisor briefing dossiers, and parent alert summaries reviewable before sending.',
              badge: 'Empathetic Messaging',
              icon: Bot
            }
          ].map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div 
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-all hover:shadow-glow-blue"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl p-3 bg-brand-500/10 text-cyan-400 border border-brand-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {agent.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{agent.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Early Warning & Explainable AI Section */}
      <section id="early-warning" className="py-24 px-6 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/60 px-3 py-1 rounded-full">
              Explainable AI Calibration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight">
              Never a Black Box. <br />
              Every Prediction Has Clear Context.
            </h2>
            <p className="text-slate-400 text-sm mt-4 leading-relaxed">
              Standard EdTech systems throw raw numbers at advisors. ASSIP provides transparent root-cause decomposition, comparative cohort benchmarks, and human-in-the-loop validation before any intervention is dispatched.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">4-Tier Risk Classification</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Low (0–30), Moderate (31–60), High (61–80), and Critical (81–100) calibrated against departmental distributions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">"Why Am I Seeing This?" Modal</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Provides instantaneous rule triggers, confidence ratings, and comparative historical context.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Human Approval Workflow</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Advisors retain full authority to approve, modify, reject, or customize AI-generated intervention proposals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Live AI Early Warning Diagnostic</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20">
                CRITICAL RISK
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-850 border border-slate-800">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Evaluated Risk Score</span>
                <span className="text-2xl font-bold font-mono text-red-400">84 / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contributing Signals:</span>
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Attendance dropped 24% over past 3 weeks</span>
                <span className="text-red-400 font-mono font-bold">35% Impact</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>3 programming lab assignments missing in CS301</span>
                <span className="text-orange-400 font-mono font-bold">25% Impact</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Midterm score (42%) is 30% below course average</span>
                <span className="text-amber-400 font-mono font-bold">25% Impact</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
              <span className="font-bold text-emerald-400 block mb-1">Recommended Next Action:</span>
              <p className="text-slate-300">
                Convene 1-on-1 advisor check-in, assign peer mentor from 6th sem CSE, and formulate 14-day catch-up milestone plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Privacy Standards */}
      <section id="security" className="py-20 px-6 max-w-7xl mx-auto text-center">
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full">
          Institutional Trust & Security
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-4">
          Engineered for Enterprise FERPA Compliance
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
            <Lock className="h-6 w-6 text-cyan-400 mb-3" />
            <h4 className="text-sm font-bold text-white">Role-Based Access Control</h4>
            <p className="text-xs text-slate-400 mt-1">Students only see their own records. Advisors see assigned cohorts. Administrators view anonymized macro trends.</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
            <ShieldCheck className="h-6 w-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold text-white">Human Approval Safeguards</h4>
            <p className="text-xs text-slate-400 mt-1">Zero high-impact academic actions execute autonomously. Academic staff review every intervention.</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
            <BarChart3 className="h-6 w-6 text-purple-400 mb-3" />
            <h4 className="text-sm font-bold text-white">Audit Logging & Traceability</h4>
            <p className="text-xs text-slate-400 mt-1">Every threshold adjustment, case note, and status change is logged with IP, actor, and timestamp.</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
            <Sparkles className="h-6 w-6 text-brand-400 mb-3" />
            <h4 className="text-sm font-bold text-white">Pluggable AI Provider</h4>
            <p className="text-xs text-slate-400 mt-1">Deploy on private on-premise LLMs or enterprise cloud endpoints with zero training data leaks.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-20 px-6 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-navy-950 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to empower your students with agentic intelligence?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Experience the full enterprise platform with pre-configured institutional cohorts, live early warnings, and interactive AI copilot.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLaunchRole('advisor')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-cyan transition-all hover:scale-105"
            >
              Launch Live Platform Demo
            </button>
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              Try Success Copilot
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-6 text-xs text-slate-500 text-center">
        <p className="font-semibold text-slate-400">
          Agentic Student Success Intelligence Platform (ASSIP) • Academic Year 2026-2027
        </p>
        <p className="mt-2">
          Designed for Colleges, Universities, and Engineering Institutes. Compliant with FERPA & Institutional Data Governance.
        </p>
      </footer>
    </div>
  );
};
