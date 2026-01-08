
import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Team, User, ScoreMetrics, AttendanceRecord, NonTechActivity } from '../types';
import { mockDb } from '../services/mockDb';
import { githubService } from '../services/githubService';
import { useAuth } from '../App';

const DirectorDashboard = () => {
  const { user: currentUser } = useAuth();
  const [view, setView] = useState<'provisioning' | 'performance' | 'attendance'>('performance');
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allScores, setAllScores] = useState<ScoreMetrics[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [nonTechActs, setNonTechActs] = useState<NonTechActivity[]>([]);

  // Form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [assignedManagerId, setAssignedManagerId] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [scannedMembers, setScannedMembers] = useState<{login: string, avatar_url: string}[]>([]);

  const refreshData = () => {
    setTeams(mockDb.getTeams());
    setUsers(mockDb.getUsers());
    setAllScores(mockDb.getAllScores());
    setAttendance(mockDb.getAttendance());
    setNonTechActs(mockDb.getNonTechActivities());
  };

  useEffect(() => {
    refreshData();
    const managers = mockDb.getUsers().filter(u => u.role === 'Manager');
    if (managers.length > 0) setAssignedManagerId(managers[0].user_id);
  }, []);

  const managersList = useMemo(() => users.filter(u => u.role === 'Manager'), [users]);

  const cleanRepoPath = (path: string) => {
    return path.replace(/https?:\/\/github\.com\//, '').replace(/\/$/, '').trim();
  };

  const handleTestAndScan = async () => {
    if (!newRepoUrl) return;
    setTesting(true);
    setTestResult(null);
    setScannedMembers([]);
    try {
      const repoPath = cleanRepoPath(newRepoUrl);
      await githubService.validateRepo(repoPath, githubToken);
      const collaborators = await githubService.fetchCollaborators(repoPath, githubToken);
      setScannedMembers(collaborators);
      setTestResult({ success: true, message: `Connected! Found ${collaborators.length} collaborators.` });
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newRepoUrl) return;
    const repoPath = cleanRepoPath(newRepoUrl);
    const teamId = `t${Date.now()}`;
    const newTeam: Team = {
      team_id: teamId,
      team_name: newTeamName,
      repo_url: repoPath,
      created_by: currentUser!.user_id,
      assigned_manager_id: assignedManagerId || undefined,
      github_token: githubToken.trim() || undefined
    };
    
    // Save Team
    const existingTeams = mockDb.getTeams();
    mockDb.saveTeams([...existingTeams, newTeam]);

    // Sync Members
    if (scannedMembers.length > 0) {
      mockDb.syncTeamEmployees(teamId, scannedMembers as any);
    }

    // Reset Form and Refresh Local State
    setNewTeamName(''); 
    setNewRepoUrl(''); 
    setGithubToken(''); 
    setTestResult(null); 
    setScannedMembers([]);
    refreshData();
  };

  const teamGroupedEmployees = useMemo(() => {
    const employeeUsers = users.filter(u => u.role === 'Employee');
    const groups: Record<string, User[]> = {};
    employeeUsers.forEach(u => {
      const tid = u.team_id || 'unassigned';
      if (!groups[tid]) groups[tid] = [];
      groups[tid].push(u);
    });
    return groups;
  }, [users]);

  const multiTeamChartData = useMemo(() => {
    return allScores.map(s => {
      const user = users.find(u => u.user_id === s.user_id || u.github_username === s.user_id);
      const team = teams.find(t => t.team_id === s.team_id);
      return {
        name: user?.name || s.user_id,
        x: Number((s.avg_activity + s.avg_visibility).toFixed(2)),
        y: Number(s.avg_impact.toFixed(2)),
        final: Number(s.final_contribution_score.toFixed(2)),
        team: team?.team_name || 'Global',
        role: user?.is_technical ? 'Technical' : 'Operational'
      };
    });
  }, [allScores, users, teams]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Director Governance</h1>
          <p className="text-slate-500 font-medium">Organizational Strategy & Performance Visibility</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setView('performance')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${view === 'performance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Performance Matrix
          </button>
          <button 
            onClick={() => setView('attendance')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${view === 'attendance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Attendance & Activities
          </button>
          <button 
            onClick={() => setView('provisioning')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${view === 'provisioning' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Team Provisioning
          </button>
        </div>
      </header>

      {view === 'performance' && (
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">Multi-Team Impact Analysis</h2>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Technical</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Operational</span>
                 </div>
              </div>
           </div>
           
           <div className="h-[500px]">
              {multiTeamChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="x" name="Visibility" label={{ value: 'Visibility (Activity + Social)', position: 'bottom', offset: -10, fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis type="number" dataKey="y" name="Impact" label={{ value: 'Performance Impact', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'bold' }} />
                    <ZAxis type="number" dataKey="final" range={[100, 1000]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="All Contributors" data={multiTeamChartData}>
                      {multiTeamChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.role === 'Technical' ? '#6366f1' : '#10b981'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic font-medium">
                   No organizational data synced yet.
                </div>
              )}
           </div>
        </section>
      )}

      {view === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Attendance Overview</h2>
              <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="border-b border-slate-100">
                          <th className="py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Employee</th>
                          <th className="py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Team</th>
                          <th className="py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Attendance Rate</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {users.filter(u => u.role === 'Employee').map(u => {
                          const userAtt = attendance.filter(a => a.user_id === u.user_id);
                          const presentCount = userAtt.filter(a => a.status === 'Present').length;
                          const rate = userAtt.length > 0 ? (presentCount / userAtt.length) * 100 : 0;
                          const teamName = teams.find(t => t.team_id === u.team_id)?.team_name || 'N/A';
                          return (
                            <tr key={u.user_id} className="hover:bg-slate-50 transition-all">
                               <td className="py-4 font-bold text-slate-800">{u.name}</td>
                               <td className="py-4 text-slate-500 font-medium">{teamName}</td>
                               <td className="py-4 text-right font-mono font-black text-indigo-600">{rate.toFixed(1)}%</td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </section>

           <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Non-Technical Contribution Audit</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                 {nonTechActs.length === 0 ? (
                    <p className="text-center text-slate-400 italic py-10">No activities recorded.</p>
                 ) : (
                    nonTechActs.map(act => {
                       const actor = users.find(u => u.user_id === act.user_id);
                       return (
                          <div key={act.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                             <div>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{actor?.name || act.user_id} &bull; {act.type}</p>
                                <p className="text-sm font-bold text-slate-700">{act.description}</p>
                             </div>
                             <span className="font-black text-emerald-600 text-sm">+{act.impact_points}pts</span>
                          </div>
                       );
                    })
                 )}
              </div>
           </section>
        </div>
      )}

      {view === 'provisioning' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Provision New Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Team Label</label>
                  <input type="text" required value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="e.g. Core Engineering" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Manager Lead</label>
                  <select value={assignedManagerId} onChange={e => setAssignedManagerId(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none">
                    <option value="">Choose a Manager...</option>
                    {managersList.map(m => <option key={m.user_id} value={m.user_id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">GitHub Repository</label>
                  <div className="flex gap-2">
                    <input type="text" required value={newRepoUrl} onChange={e => setNewRepoUrl(e.target.value)} placeholder="owner/repo" className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all font-bold outline-none" />
                    <button type="button" onClick={handleTestAndScan} disabled={testing} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {testing ? '...' : 'Scan'}
                    </button>
                  </div>
                  {testResult && <p className={`text-[10px] mt-1 font-bold ${testResult.success ? 'text-emerald-600' : 'text-rose-600'}`}>{testResult.message}</p>}
                </div>
                <button type="submit" disabled={!testResult?.success} className="w-full py-4 bg-slate-900 text-white rounded-[2rem] font-black text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50">Initialize Team</button>
              </form>
            </div>
          </div>
          <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                 <h2 className="text-xl font-black text-slate-900">Active Organization Hierarchy</h2>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Repo Mapping & Talent Distribution</p>
              </div>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">{teams.length} Teams</span>
            </div>
            <div className="flex-1 p-8 space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar">
              {teams.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic">No teams provisioned.</div>
              ) : teams.map(team => (
                <div key={team.team_id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 group hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{team.team_name}</h3>
                      <p className="text-xs text-slate-400 font-mono font-medium">{team.repo_url}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-indigo-500 block mb-1">Assigned Manager</span>
                      <span className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-tight shadow-sm">
                        {managersList.find(u => u.user_id === team.assigned_manager_id)?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Allocated Talent ({teamGroupedEmployees[team.team_id]?.length || 0})</span>
                    <div className="flex flex-wrap gap-2">
                      {teamGroupedEmployees[team.team_id]?.length > 0 ? teamGroupedEmployees[team.team_id].map(emp => (
                        <div key={emp.user_id} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:scale-105 transition-transform">
                          {emp.avatar_url ? (
                            <img src={emp.avatar_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-600 border border-indigo-100">{emp.name?.charAt(0)}</div>
                          )}
                          <span className="text-xs font-bold text-slate-700">@{emp.github_username || emp.user_id}</span>
                          {!emp.is_technical && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Non-Technical"></span>}
                        </div>
                      )) : (
                        <span className="text-xs text-slate-400 italic">No talent mapped yet.</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorDashboard;
