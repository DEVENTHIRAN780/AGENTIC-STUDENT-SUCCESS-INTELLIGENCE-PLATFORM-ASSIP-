import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Shield, Sparkles, 
  ArrowRight, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole }) => {
  const { login, register, quickSwitchRole } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole || 'advisor');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'register') {
        await register({ name, email, role });
        onClose();
      } else {
        setForgotSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole: UserRole) => {
    setLoading(true);
    try {
      await quickSwitchRole(demoRole);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-glow-cyan mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' ? 'Institutional Sign In' : mode === 'register' ? 'Register New Account' : 'Recover Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Agentic Student Success Intelligence Platform
          </p>
        </div>

        {/* 1-Click Demo Accounts Quick-Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
            ⚡ Quick 1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-500 text-left transition-colors"
            >
              <p className="font-bold text-slate-900 dark:text-white">🎓 Student</p>
              <p className="text-[10px] text-slate-400">Alex Kumar (IT)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('advisor')}
              className="p-2 rounded-xl border border-cyan-500/40 bg-cyan-50/20 dark:bg-cyan-950/20 text-left transition-colors"
            >
              <p className="font-bold text-cyan-600 dark:text-cyan-400">📋 Advisor</p>
              <p className="text-[10px] text-slate-400">Prof. Rajeshwar</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('faculty')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-500 text-left transition-colors"
            >
              <p className="font-bold text-slate-900 dark:text-white">👩‍🏫 Faculty</p>
              <p className="text-[10px] text-slate-400">Dr. Sunita (CSE)</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl border border-purple-500/40 bg-purple-50/20 dark:bg-purple-950/20 text-left transition-colors"
            >
              <p className="font-bold text-purple-600 dark:text-purple-400">🛡️ Admin</p>
              <p className="text-[10px] text-slate-400">Dean of Academics</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-2 mb-4 border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-center space-y-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              Reset Instructions Dispatched
            </p>
            <p className="text-slate-500">
              Check your university inbox for a temporary sign-in link.
            </p>
            <button
              type="button"
              onClick={() => { setMode('login'); setForgotSubmitted(false); }}
              className="mt-3 text-brand-600 dark:text-cyan-400 font-bold hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="advisor@demo.com or student@demo.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-brand-600 dark:text-cyan-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Member</option>
                  <option value="advisor">Academic Advisor</option>
                  <option value="admin">Institutional Administrator</option>
                </select>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-brand-600"
                />
                <label htmlFor="remember" className="text-slate-600 dark:text-slate-400 font-medium">
                  Remember my session on this device
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow-cyan transition-all"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Workspace' : mode === 'register' ? 'Complete Registration' : 'Send Recovery Email'}
            </button>

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <p className="text-slate-500">
                  New to the institution?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-brand-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-brand-600 dark:text-cyan-400 font-bold hover:underline"
                >
                  Already have an account? Sign In
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
