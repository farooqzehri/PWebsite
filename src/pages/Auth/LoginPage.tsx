import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, Building2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@bismillah.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch {
      setError('Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@bismillah.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#2f3e46] border border-[#cad2c5]/80 dark:border-[#354f52] rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#52796f] text-white mx-auto flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-[#cad2c5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#2f3e46] dark:text-white">
            Agency Portal Login
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#cad2c5]">
            Sign in to manage Quetta properties, leads, and agency inquiries.
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="p-3.5 rounded-2xl bg-[#f4f7f4] dark:bg-[#1f2b30] border border-[#cad2c5]/60 dark:border-[#354f52] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#2f3e46] dark:text-white block">Demo Admin Access:</span>
            <span className="text-slate-500 font-mono text-[11px]">admin@bismillah.com • admin123</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="px-2.5 py-1.5 rounded-lg bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto Fill</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bismillah.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2f3e46] dark:text-slate-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#1f2b30] border border-[#cad2c5] dark:border-[#354f52] rounded-xl text-xs sm:text-sm text-[#2f3e46] dark:text-white focus:ring-2 focus:ring-[#52796f] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#52796f] hover:bg-[#3f5f57] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs font-semibold text-slate-500 dark:text-[#cad2c5] hover:text-[#52796f]">
            ← Return to Public Homepage
          </Link>
        </div>

      </div>
    </div>
  );
};
