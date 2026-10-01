import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Sparkles, Calendar, BookOpen, AlertTriangle, 
  CheckCircle2, ChevronRight, RefreshCw, GraduationCap 
} from 'lucide-react';
import { api } from '../../api/client';
import { Student } from '../../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onOpenStudyPlanner?: () => void;
  onOpenRoadmap?: () => void;
  onOpenRiskModal?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  metricsSnapshot?: any;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  student,
  onOpenStudyPlanner,
  onOpenRoadmap,
  onOpenRiskModal
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hi ${student?.name?.split(' ')[0] || 'Alex'}. I've reviewed your recent academic activity across your enrolled courses in Semester ${student?.semester || 5}.\n\nYour performance in Data Structures has improved by 12%, but your attendance in Operating Systems has dropped to 78%.\n\nHow can I help you accelerate your academic goals today?`,
      timestamp: 'Just now',
      suggestedActions: [
        'Create study plan',
        'Explain my risk',
        'Plan this week\'s study',
        'Check graduation progress',
        'Find weak subjects',
        'Prepare for upcoming exam'
      ],
      metricsSnapshot: {
        gpa: student?.gpa || 8.42,
        attendance: student?.attendancePct || 91,
        academicHealth: student?.academicHealth || 82,
        riskLevel: student?.riskLevel || 'low'
      }
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatCopilot(textToSend, student.id);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
        metricsSnapshot: res.contextMetrics
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I've analyzed your academic indicators for Semester ${student.semester}. Your overall GPA is ${student.gpa} and attendance stands at ${student.attendancePct}%. Focus on Operating Systems lab makeups to protect your honors track standing.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: ['Create study plan', 'Explain my risk', 'Find weak subjects']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.toLowerCase().includes('study plan') && onOpenStudyPlanner) {
      handleSend(action);
      onOpenStudyPlanner();
    } else if (action.toLowerCase().includes('graduation') && onOpenRoadmap) {
      handleSend(action);
      onOpenRoadmap();
    } else if (action.toLowerCase().includes('risk') && onOpenRiskModal) {
      onOpenRiskModal();
    } else {
      handleSend(action);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full shadow-2xl flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-cyan">
                <Bot className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Success Copilot
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-cyan-400 border border-brand-500/20">
                  AI Context Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Connected to Student Profile • ST2024-1001
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Academic Context Rail */}
        <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">GPA</span>
              <p className="font-bold text-slate-900 dark:text-white font-mono">{student.gpa}</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Attendance</span>
              <p className="font-bold text-slate-900 dark:text-white font-mono">{student.attendancePct}%</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Academic Health</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{student.academicHealth}/100</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            LOW RISK
          </span>
        </div>

        {/* Chat Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Action Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(act)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="h-3 w-3 text-cyan-500" />
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-500" />
              Success Copilot is synthesizing student records...
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
          <form 
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Success Copilot about courses, risk, exams..."
              className="flex-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-xl p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-xs transition-colors flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
