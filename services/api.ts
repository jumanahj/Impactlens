
import { githubService } from './githubService';
import { mockDb } from './mockDb';
import { CommitData, ScoreMetrics, User } from '../types';

export const api = {
  syncTeamData: async (teamId: string, useDemo: boolean = false) => {
    const teams = mockDb.getTeams();
    const team = teams.find(t => t.team_id === teamId);
    if (!team) throw new Error("Team not found");

    const rawCommits = useDemo ? githubService.getDemoCommits() : await githubService.fetchCommits(team.repo_url, team.github_token);

    const processedCommits: CommitData[] = rawCommits.map((c: any) => {
      const activity_score = (1 * 1) + (c.is_pr_merged ? 2 : 0);
      const impact_score = (c.is_bug_fix ? 5 : 0) + (c.is_pr_merged ? 3 : 0) + (c.files_changed * 0.5);
      const collaboration_score = (c.pr_reviews_given * 4) + (c.review_comments * 2) + (c.issue_comments * 1.5);
      const visibility_score = (c.slack_messages * 1) + (c.slack_threads * 2) + (c.slack_mentions * 1.5);
      const final_score = (0.2 * activity_score) + (0.6 * impact_score) + (0.2 * collaboration_score);

      return {
        ...c,
        commit_id: c.sha,
        github_commit_hash: c.sha,
        author_username: c.author,
        timestamp: c.date,
        commit_message: c.message,
        activity_score,
        impact_score,
        collaboration_score,
        visibility_score,
        final_score
      };
    });

    mockDb.saveCommits(teamId, processedCommits);
    api.calculateTeamRankings(teamId);
    return processedCommits;
  },

  calculateTeamRankings: (teamId: string) => {
    const commits = mockDb.getCommitsByTeam(teamId);
    const users = mockDb.getUsers();
    const allAttendance = mockDb.getAttendance();
    const allNonTechActs = mockDb.getNonTechActivities();
    const allFeedback = mockDb.getClientFeedback();

    // Determine all users that should be ranked in this team
    const teamMembers = users.filter(u => u.team_id === teamId);
    const commitAuthors = Array.from(new Set(commits.map(c => c.author_username)));
    
    // Union of explicit team members and commit authors
    const usernamesToProcess = Array.from(new Set([
      ...teamMembers.map(u => u.user_id),
      ...teamMembers.map(u => u.github_username),
      ...commitAuthors
    ])).filter(id => id);

    const userMetricsList: ScoreMetrics[] = [];

    usernamesToProcess.forEach(id => {
      const user = users.find(u => u.user_id === id || u.github_username === id);
      if (!user || user.team_id !== teamId) return;

      const userCommits = commits.filter(c => c.author_username === id || c.author_username === user.github_username);
      const userFeedback = allFeedback.filter(f => f.user_id === user.user_id);
      const userAttendance = allAttendance.filter(a => a.user_id === user.user_id);
      const userNonTech = allNonTechActs.filter(a => a.user_id === user.user_id);

      // Technical Metrics
      let avgImpact = 0;
      let avgActivity = 0;
      let avgCollab = 0;
      let avgVis = 0;
      let commitFinalBase = 0;

      if (userCommits.length > 0) {
        avgImpact = userCommits.reduce((a, b) => a + b.impact_score, 0) / userCommits.length;
        avgActivity = userCommits.reduce((a, b) => a + b.activity_score, 0) / userCommits.length;
        avgCollab = userCommits.reduce((a, b) => a + b.collaboration_score, 0) / userCommits.length;
        avgVis = userCommits.reduce((a, b) => a + b.visibility_score, 0) / userCommits.length;
        commitFinalBase = userCommits.reduce((a, b) => a + b.final_score, 0) / userCommits.length;
      }

      // Non-Technical Metrics
      const feedbackBonus = userFeedback.length * 1.5;
      const attendanceScore = (userAttendance.filter(a => a.status === 'Present').length / (userAttendance.length || 1)) * 5;
      const activityImpact = userNonTech.reduce((a, b) => a + b.impact_points, 0);
      
      const non_tech_score = attendanceScore + activityImpact + feedbackBonus;

      // Composite Scoring Logic (Role-Aware)
      let final_contribution_score = 0;
      const isTech = user.is_technical !== false;

      if (isTech) {
        // For technical roles: 70% Technical + 30% Non-Technical
        final_contribution_score = (commitFinalBase * 0.7) + (non_tech_score * 0.3);
      } else {
        // For non-technical roles: 100% Non-Technical
        final_contribution_score = non_tech_score;
        // Map non-tech into visibility/impact for chart compatibility
        avgVis = attendanceScore;
        avgImpact = activityImpact + feedbackBonus;
      }

      userMetricsList.push({
        user_id: user.user_id,
        team_id: teamId,
        avg_impact: avgImpact,
        avg_activity: avgActivity,
        avg_collaboration: avgCollab,
        avg_visibility: avgVis,
        non_tech_score: non_tech_score,
        final_contribution_score: final_contribution_score,
        rank: 0,
        badge: 'Balanced Contributor'
      });
    });

    if (userMetricsList.length === 0) return;

    const teamAvgImpact = userMetricsList.reduce((a, b) => a + b.avg_impact, 0) / userMetricsList.length;
    const teamAvgVisibility = userMetricsList.reduce((a, b) => a + (b.avg_activity + b.avg_visibility), 0) / userMetricsList.length;

    userMetricsList.forEach(u => {
      const combinedVisibility = u.avg_activity + u.avg_visibility;
      if (u.avg_impact > teamAvgImpact && combinedVisibility < teamAvgVisibility) {
        u.badge = 'Silent Architect';
      } else if (u.avg_impact < teamAvgImpact && combinedVisibility > teamAvgVisibility) {
        u.badge = 'High Visibility / Low Impact';
      } else if (u.final_contribution_score > (teamAvgImpact * 1.2)) {
        u.badge = 'Star Performer';
      }
    });

    userMetricsList.sort((a, b) => b.final_contribution_score - a.final_contribution_score);
    userMetricsList.forEach((r, i) => r.rank = i + 1);

    localStorage.setItem(`impactlens_scores_${teamId}`, JSON.stringify(userMetricsList));
  }
};
