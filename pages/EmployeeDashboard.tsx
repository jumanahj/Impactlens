
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { mockDb } from '../services/mockDb';
import { CommitData, ClientFeedback, WorkSubmission, AttendanceRecord, NonTechActivity } from '../types';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activities, setActivities] = useState<NonTechActivity[]>([]);
  
  const [feedbackDesc, setFeedbackDesc] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch own attendance and activities
      setAttendance(mockDb.getAttendance().filter(a => a.user_id === user.user_id));
      setActivities(mockDb.getNonTechActivities().filter(a => a.user_id === user.user_id));

      if (user.team_id && user.is_technical) {
        const teamCommits = mockDb.getCommitsByTeam(user.team_id);
        const myCommits = teamCommits.filter(c => 
          c.author_username.toLowerCase() === user.github_username?.toLowerCase() ||
          c.author_username.toLowerCase() === user.user_id.toLowerCase()
        );
        setCommits(myCommits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    }
  }, [user]);

  const handleFeedbackUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackDesc.trim()) return;
    setSubmitting(true);
    const feedback: ClientFeedback = {
      id: `cf-${Date.now()}`,
      user_id: user!.user_id,
      description: feedbackDesc,
      date: new Date().toISOString(),
      file_name: 'simulated_upload.pdf'
    };
    mockDb.saveClientFeedback(feedback);
    setFeedbackDesc('');
    setSuccessMsg('Feedback uploaded successfully!');
    setSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleWorkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) return;
    setSubmitting(true);
    const submission: WorkSubmission = {
      id: `ws-${Date.now()}`,
      user_id: user!.user_id,
      title: workTitle,
      description: workDesc,
      date: new Date().toISOString(),
      file_name: 'work_report.docx'
    };
    mockDb.saveWorkSubmission(submission);
    setWorkTitle('');
    setWorkDesc('');
    setSuccessMsg('Work report submitted successfully!');
    setSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const attendanceRate = attendance.length > 0 ? (attendance.filter(a => a.status === 'Present').length / attendance.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-8 z-10">
          <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 overflow-hidden group">
            {user?.avatar_url ? (
              <img src={user.avatar_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
            ) : (
              <span className="text-4xl font-black text-white">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {user?.name}</h1>
            <div className="flex items-center gap-3 mt-2">
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                 {user?.is_technical ? 'Technical Staff' : 'Operational Staff'}
               </span>
               <span className="text-slate-400 font-bold text-xs font-mono">@{user?.github_username || user?.user_id}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 z-10">
           <div className="bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Attendance</p>
              <p className="text-2xl font-black text-indigo-600">{attendanceRate.toFixed(1)}%</p>
           </div>
           <div className="bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Contributions</p>
              <p className="text-2xl font-black text-emerald-600">{activities.length + commits.length}</p>
           </div>
        </div>
        
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
      </header>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl font-bold text-center animate-bounce shadow-lg shadow-emerald-50">
          {successMsg}
        </div>
      )}

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-black text-slate-900 mb-2">Work Submission</h2>
            <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Reports & Deliverables</p>
            <form onSubmit={handleWorkUpload} className="space-y-4">
              <input 
                type="text" 
                placeholder="Submission Title"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold outline-none shadow-inner"
              />
              <textarea 
                placeholder="Describe your work..."
                value={workDesc}
                onChange={(e) => setWorkDesc(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold outline-none min-h-[100px] shadow-inner"
              />
              <button type="submit" disabled={submitting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg shadow-slate-200">Submit Report</button>
            </form>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-black text-slate-900 mb-2">Client Recognition</h2>
            <p className="text-xs text-slate-500 mb-6 font-bold uppercase tracking-wider">Appreciation Log</p>
            <form onSubmit={handleFeedbackUpload} className="space-y-4">
              <textarea 
                placeholder="Paste appreciation message..."
                value={feedbackDesc}
                onChange={(e) => setFeedbackDesc(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none min-h-[174px] shadow-inner"
              />
              <button type="submit" disabled={submitting} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100">Post Feedback</button>
            </form>
          </section>
        </div>

        {user?.is_technical ? (
          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">Technical Audit Log</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Source: GitHub Sync</p>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Commit Message</th>
                    <th className="px-8 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {commits.length === 0 ? (
                    <tr><td colSpan={2} className="px-8 py-20 text-center text-slate-400 italic">No sync records found.</td></tr>
                  ) : (
                    commits.map((c) => (
                      <tr key={c.commit_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-800 leading-snug">
                          {c.commit_message}
                          <div className="mt-1 font-mono text-[9px] text-indigo-400 uppercase tracking-tighter">SHA: {c.github_commit_hash.substring(0, 7)}</div>
                        </td>
                        <td className="px-8 py-5 text-slate-500 text-right font-medium">
                          {new Date(c.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Operational Workflow</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Your role is evaluated based on coordination, attendance, and client deliverables. GitHub data is not used for your assessment.</p>
          </section>
        )}
      </div>
      
      <footer className="pt-8 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Data Privacy Vault Enabled &bull; Secure Contribution Log &bull; &copy; 2024</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
