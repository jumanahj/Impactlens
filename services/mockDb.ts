
import { User, Team, CommitData, ClientFeedback, WorkSubmission, AttendanceRecord, NonTechActivity, ScoreMetrics } from '../types';
import { INITIAL_USERS } from '../constants';

const DB_KEYS = {
  USERS: 'impactlens_users',
  TEAMS: 'impactlens_teams',
  COMMITS: 'impactlens_commits',
  SCORES: 'impactlens_scores',
  FEEDBACK: 'impactlens_client_feedback',
  WORK: 'impactlens_work_submissions',
  ATTENDANCE: 'impactlens_attendance',
  NON_TECH_ACTIVITIES: 'impactlens_non_tech_activities',
};

export const mockDb = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEYS.USERS);
    if (!data) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  },
  getTeams: (): Team[] => {
    const data = localStorage.getItem(DB_KEYS.TEAMS);
    return data ? JSON.parse(data) : [];
  },
  saveTeams: (teams: Team[]) => {
    localStorage.setItem(DB_KEYS.TEAMS, JSON.stringify(teams));
  },
  getCommitsByTeam: (teamId: string): CommitData[] => {
    const data = localStorage.getItem(`${DB_KEYS.COMMITS}_${teamId}`);
    return data ? JSON.parse(data) : [];
  },
  saveCommits: (teamId: string, commits: CommitData[]) => {
    localStorage.setItem(`${DB_KEYS.COMMITS}_${teamId}`, JSON.stringify(commits));
  },

  getAllScores: (): ScoreMetrics[] => {
    const teams = mockDb.getTeams();
    let all: ScoreMetrics[] = [];
    teams.forEach(t => {
      const data = localStorage.getItem(`${DB_KEYS.SCORES}_${t.team_id}`);
      if (data) {
        const teamScores: ScoreMetrics[] = JSON.parse(data);
        all = [...all, ...teamScores.map(s => ({ ...s, team_id: t.team_id }))];
      }
    });
    return all;
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(DB_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },
  saveAttendance: (records: AttendanceRecord[]) => {
    localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(records));
  },
  markAttendance: (userId: string, status: 'Present' | 'Leave' | 'Half-Day') => {
    const records = mockDb.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if record for today already exists (normalize date to YYYY-MM-DD)
    const existingIdx = records.findIndex(r => r.user_id === userId && r.date.startsWith(today));
    
    if (existingIdx !== -1) {
      records[existingIdx].status = status;
    } else {
      records.push({
        id: `att-${userId}-${Date.now()}`,
        user_id: userId,
        date: new Date().toISOString(),
        status
      });
    }
    mockDb.saveAttendance(records);
    return records; // Return updated list for immediate state update
  },

  getNonTechActivities: (): NonTechActivity[] => {
    const data = localStorage.getItem(DB_KEYS.NON_TECH_ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },
  saveNonTechActivities: (activities: NonTechActivity[]) => {
    localStorage.setItem(DB_KEYS.NON_TECH_ACTIVITIES, JSON.stringify(activities));
  },

  saveClientFeedback: (feedback: ClientFeedback) => {
    const current = mockDb.getClientFeedback();
    localStorage.setItem(DB_KEYS.FEEDBACK, JSON.stringify([...current, feedback]));
  },
  getClientFeedback: (): ClientFeedback[] => {
    const data = localStorage.getItem(DB_KEYS.FEEDBACK);
    return data ? JSON.parse(data) : [];
  },
  saveWorkSubmission: (submission: WorkSubmission) => {
    const current = mockDb.getWorkSubmissions();
    localStorage.setItem(DB_KEYS.WORK, JSON.stringify([...current, submission]));
  },
  getWorkSubmissions: (): WorkSubmission[] => {
    const data = localStorage.getItem(DB_KEYS.WORK);
    return data ? JSON.parse(data) : [];
  },

  syncTeamEmployees: (teamId: string, collaborators: {login: string, id: number, avatar_url: string}[]) => {
    const currentUsers = mockDb.getUsers();
    
    let updated = [...currentUsers];
    collaborators.forEach(c => {
      const existingIdx = updated.findIndex(u => u.github_username === c.login || u.user_id === c.login);
      if (existingIdx === -1) {
        updated.push({
          user_id: c.login,
          name: c.login,
          role: 'Employee',
          github_username: c.login,
          password: 'emp123',
          team_id: teamId,
          avatar_url: c.avatar_url,
          is_technical: true
        });
      } else {
        // Update existing user with new team assignment and avatar
        updated[existingIdx] = { 
          ...updated[existingIdx], 
          team_id: teamId, 
          avatar_url: c.avatar_url,
          is_technical: true 
        };
      }
    });

    mockDb.saveUsers(updated);
    return updated;
  },
  
  verifyCredentials: async (usernameOrId: string, password: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = mockDb.getUsers();
    const user = users.find(u => 
      (u.user_id === usernameOrId || u.github_username === usernameOrId) && 
      u.password === password
    );
    return user || null;
  }
};
