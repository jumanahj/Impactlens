
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { mockDb } from '../services/mockDb';

const Login = () => {
  const { login, user: existingUser } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (existingUser) {
      navigate(`/${existingUser.role.toLowerCase()}`);
    }
  }, [existingUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await mockDb.verifyCredentials(username, password);
      
      if (user) {
        login(user);
        // Automatic redirection based on detected role
        navigate(`/${user.role.toLowerCase()}`);
      } else {
        setError('Identification failed. Check your credentials or contact your administrator.');
      }
    } catch (err) {
      setError('A system error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] -z-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[120px] -z-10 rounded-full"></div>

      <div className="max-w-md w-full animate-fade-in">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors font-black text-xs uppercase tracking-widest group">
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to ImpactLens
        </Link>

        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500"></div>

          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-slate-200 animate-float">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access Portal</h1>
            <p className="mt-2 text-slate-400 text-[10px] font-black italic tracking-[0.2em] uppercase">Identity Verification Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-black uppercase tracking-tight text-center animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-2">Username or ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Identification string"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold outline-none placeholder:text-slate-300 shadow-inner"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-2">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold outline-none placeholder:text-slate-300 shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest leading-relaxed">
              Protected by ImpactLens Intelligence Layer<br/>&copy; 2024 Enterprise Dynamics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
