
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { User, Role } from './types';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import DirectorDashboard from './pages/DirectorDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

interface AuthContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: Role[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Show navbar only if logged in OR on landing page
  if (!user) {
    return (
      <nav className="fixed w-full z-50 px-8 py-6 flex justify-between items-center transition-all">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">ImpactLens</span>
        </Link>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          Login
        </button>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900">ImpactLens</span>
        </Link>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block border-r border-slate-200 pr-8">
          <p className="text-sm font-black text-slate-900">{user.name}</p>
          <p className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'Director' ? 'text-indigo-600' : user.role === 'Manager' ? 'text-amber-600' : 'text-emerald-600'}`}>
            {user.role} Portal
          </p>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('impactlens_session');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('impactlens_session', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('impactlens_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/director/*" element={
                <ProtectedRoute allowedRoles={['Director']}>
                  <DirectorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/manager/*" element={
                <ProtectedRoute allowedRoles={['Manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employee/*" element={
                <ProtectedRoute allowedRoles={['Employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
};

export default App;
