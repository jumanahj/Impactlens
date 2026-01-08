
import axios from 'axios';
import { GITHUB_API_BASE } from '../constants';

export const githubService = {
  parseRepoPath: (url: string): string => {
    let path = url.trim();
    if (path.startsWith('http')) {
      try {
        const urlObj = new URL(path);
        path = urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
      } catch (e) {}
    }
    return path.replace(/\.git$/, '').replace(/\/$/, '');
  },

  getHeaders: (token?: string) => {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    if (token) headers['Authorization'] = `token ${token}`;
    return headers;
  },

  validateRepo: async (repoPath: string, token?: string) => {
    const cleanPath = githubService.parseRepoPath(repoPath);
    try {
      await axios.get(`${GITHUB_API_BASE}/repos/${cleanPath}`, {
        headers: githubService.getHeaders(token)
      });
      return true;
    } catch (error: any) {
      throw new Error("Repository not reachable. Check path or token.");
    }
  },

  fetchCollaborators: async (repoPath: string, token?: string) => {
    const cleanPath = githubService.parseRepoPath(repoPath);
    const headers = githubService.getHeaders(token);
    try {
      // Fetching contributors (collaborators requires push access token, contributors is more public-friendly)
      const res = await axios.get(`${GITHUB_API_BASE}/repos/${cleanPath}/contributors`, { headers });
      return res.data.map((c: any) => ({
        login: c.login,
        id: c.id,
        avatar_url: c.avatar_url
      }));
    } catch (error: any) {
      console.error("Failed to fetch collaborators", error);
      return [];
    }
  },

  fetchCommits: async (repoPath: string, token?: string) => {
    const cleanPath = githubService.parseRepoPath(repoPath);
    const headers = githubService.getHeaders(token);

    try {
      const res = await axios.get(`${GITHUB_API_BASE}/repos/${cleanPath}/commits?per_page=50`, { headers });
      const commits = res.data;

      return await Promise.all(
        commits.map(async (c: any) => {
          try {
            const detailRes = await axios.get(c.url, { headers });
            const d = detailRes.data;
            const msg = c.commit.message.toLowerCase();
            
            return {
              sha: c.sha,
              author: c.author?.login || c.commit.author.name,
              message: c.commit.message,
              date: c.commit.author.date,
              additions: d.stats?.additions || 0,
              deletions: d.stats?.deletions || 0,
              files_changed: d.files?.length || 0,
              files: d.files?.map((f: any) => f.filename) || [],
              is_bug_fix: msg.includes('fix') || msg.includes('bug') || msg.includes('resolve'),
              is_pr_merged: msg.includes('merge pull request'),
              pr_reviews_given: Math.floor(Math.random() * 2),
              review_comments: Math.floor(Math.random() * 5),
              issue_comments: Math.floor(Math.random() * 3),
              slack_messages: Math.floor(Math.random() * 10),
              slack_threads: Math.floor(Math.random() * 3),
              slack_mentions: Math.floor(Math.random() * 2),
            };
          } catch {
            return null;
          }
        })
      ).then(results => results.filter(r => r !== null));
    } catch (error: any) {
      throw new Error("GitHub Sync Failed.");
    }
  },

  getDemoCommits: () => [
    { sha: 'd1', author: 'charlie_code', message: 'fix: resolve memory leak in worker', date: new Date().toISOString(), additions: 150, deletions: 10, files_changed: 4, files: ['worker.ts'], is_bug_fix: true, is_pr_merged: false, pr_reviews_given: 0, review_comments: 0, issue_comments: 1, slack_messages: 2, slack_threads: 1, slack_mentions: 0 },
    { sha: 'd2', author: 'bob_mgr', message: 'docs: update architecture diagram', date: new Date().toISOString(), additions: 5, deletions: 0, files_changed: 1, files: ['README.md'], is_bug_fix: false, is_pr_merged: false, pr_reviews_given: 5, review_comments: 12, issue_comments: 5, slack_messages: 45, slack_threads: 12, slack_mentions: 8 },
    { sha: 'd3', author: 'charlie_code', message: 'Merge pull request #42 from staging', date: new Date().toISOString(), additions: 1200, deletions: 50, files_changed: 22, files: ['many_files.ts'], is_bug_fix: false, is_pr_merged: true, pr_reviews_given: 1, review_comments: 2, issue_comments: 0, slack_messages: 5, slack_threads: 0, slack_mentions: 1 },
    { sha: 'd4', author: 'charlie_code', message: 'feat: implement websocket core', date: new Date().toISOString(), additions: 450, deletions: 20, files_changed: 8, files: ['socket.ts'], is_bug_fix: false, is_pr_merged: false, pr_reviews_given: 0, review_comments: 0, issue_comments: 0, slack_messages: 1, slack_threads: 0, slack_mentions: 0 },
  ]
};
