
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [demoStep, setDemoStep] = useState(0);

  // Auto-play demo simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, 2500); // Cycle every 2.5s per step, ~12.5s total loop
    return () => clearInterval(timer);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      title: 'GitHub Collaboration Tracking',
      desc: 'Deep integration with GitHub repositories to automatically fetch and map contributions.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Team & Repo Insights',
      desc: 'Understand team dynamics with repo-based grouping and manager accountability mapping.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857" />
        </svg>
      ),
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Contribution Audits',
      desc: 'Clear transparency for developers to view their own technical and non-technical impact signals.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Role-based Dashboards',
      desc: 'Tailored experiences for Directors, Managers, and Employees to drive organizational excellence.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      color: 'bg-rose-50 text-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Live Demo Split */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/50 via-slate-50 to-transparent -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Headline & CTA */}
          <div className="text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Impact-Driven Intelligence
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              See team impact <br/> 
              <span className="text-indigo-600">before you login</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
              AI-Driven Developer & Team Intelligence. The ultimate platform for technical excellence and organizational transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
              >
                Login to Dashboard
              </button>
              <button 
                onClick={scrollToFeatures}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side: Animated Demo Preview */}
          <div className="relative group animate-slide-up delay-200">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10 rounded-full animate-pulse"></div>
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden aspect-[4/3] flex flex-col relative">
              {/* Fake Window Controls */}
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300"></div>
                <div className="ml-4 bg-white px-3 py-1 rounded-md text-[9px] font-bold text-slate-400 border border-slate-100 flex-1 text-center truncate">
                  {demoStep === 0 && "Director / New Sync"}
                  {demoStep === 1 && "Director / Team Formation"}
                  {demoStep === 2 && "Employee / Contribution Audit"}
                  {demoStep === 3 && "Employee / Recognition Feed"}
                  {demoStep === 4 && "Manager / Strategic Insights"}
                </div>
              </div>

              {/* Demo Content Area */}
              <div className="flex-1 p-8 overflow-hidden relative">
                <DemoDisplay step={demoStep} />
                
                {/* Step Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0,1,2,3,4].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${demoStep === s ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features-section" className="px-8 py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={feature.title} 
              className={`p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500`}
            >
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-20 border-t border-slate-200 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">ImpactLens &bull; AI-Powered Technical Governance</p>
      </footer>
    </div>
  );
};

const DemoDisplay = ({ step }: { step: number }) => {
  switch (step) {
    case 0: // Director Sync
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900">Provision Repository</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-slate-400 font-mono text-xs">github.com/</span>
              <span className="text-indigo-600 font-bold text-xs animate-pulse">facebook/react</span>
              <div className="ml-auto w-1 h-4 bg-indigo-600 animate-pulse"></div>
            </div>
          </div>
          <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg">Scanning Repository...</button>
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborators Identified</p>
            <div className="flex gap-2">
              {[1,2,3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center animate-in zoom-in duration-300 delay-${i*100}`}>
                  <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-[10px] text-slate-300">+</span>
              </div>
            </div>
          </div>
        </div>
      );
    case 1: // Team Formation
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-2xl shadow-indigo-100">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h4 className="text-lg font-black">Frontend-Core</h4>
                    <p className="text-xs text-indigo-100/70">facebook/react</p>
                 </div>
                 <span className="px-2 py-1 bg-white/20 rounded text-[9px] font-black uppercase">Active</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-indigo-200">Lead Manager</span>
                    <span className="font-bold">Ravi K.</span>
                 </div>
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/10 border-2 border-indigo-600 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-white/20"></div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-600">Organization Mapping Synchronized</span>
           </div>
        </div>
      );
    case 2: // Employee Audit
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end mb-2">
             <h3 className="text-sm font-black text-slate-900">Contribution Audit</h3>
             <span className="text-[10px] text-slate-400 font-bold italic">Source: Git</span>
          </div>
          <div className="space-y-2">
            {[
              { m: 'Fixed navbar hydration issue', d: '12 Mar 2026', c: 'a1b2c3' },
              { m: 'Refactored auth hook logic', d: '10 Mar 2026', c: 'd4e5f6' },
              { m: 'Improved LCP performance', d: '09 Mar 2026', c: 'g7h8i9' }
            ].map((commit, i) => (
              <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">{commit.m}</p>
                  <p className="text-[10px] text-slate-400">{commit.d}</p>
                </div>
                <span className="text-[9px] font-mono text-indigo-500 font-black">#{commit.c}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 3: // Feedback
      return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500 flex flex-col justify-center h-full pb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl relative">
            <h3 className="text-sm font-black text-slate-900 mb-4">Client Feedback</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                 <p className="text-xs text-slate-600 italic">"The team delivered the authentication module way ahead of schedule. Exceptional performance!"</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Bonus Applied</span>
              </div>
            </div>
            {/* Success Toast Overlay */}
            <div className="absolute -top-4 -right-4 bg-emerald-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl animate-bounce">
              Impact Synchronized!
            </div>
          </div>
        </div>
      );
    case 4: // Manager Dashboard
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
           <h3 className="text-sm font-black text-slate-900">Team Impact Matrix</h3>
           <div className="h-32 w-full bg-slate-50 rounded-2xl border border-slate-200 relative p-4 flex items-end justify-between gap-2 overflow-hidden">
             {/* Mock Scatter Plot */}
             {[40, 70, 55, 90, 30].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                 <div className="w-full bg-indigo-100 rounded-t-lg relative group transition-all duration-700" style={{ height: `${h}%` }}>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full shadow-lg border-2 border-white animate-pulse"></div>
                 </div>
                 <span className="text-[8px] font-bold text-slate-400">Dev {i+1}</span>
               </div>
             ))}
             {/* Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
                <div className="border-t border-slate-300 w-full"></div>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
               <span className="text-[9px] font-black text-indigo-500 uppercase block">Top Performer</span>
               <span className="text-xs font-bold text-slate-700">@octocat</span>
             </div>
             <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
               <span className="text-[9px] font-black text-emerald-500 uppercase block">Reliability</span>
               <span className="text-xs font-bold text-slate-700">98.4%</span>
             </div>
           </div>
        </div>
      );
    default:
      return null;
  }
};

const RoleCard = ({ role, color, desc }: { role: string, color: string, desc: string }) => (
  <div className="relative p-10 bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-500">
    <div className={`text-${color}-600 font-black text-sm uppercase tracking-widest mb-4`}>{role}</div>
    <h3 className="text-2xl font-black text-slate-900 mb-4">{role} Portal</h3>
    <p className="text-slate-500 leading-relaxed font-medium mb-8">{desc}</p>
    <div className={`w-full h-1 bg-${color}-600/10 rounded-full overflow-hidden`}>
      <div className={`w-1/3 h-full bg-${color}-600`}></div>
    </div>
  </div>
);

export default LandingPage;
