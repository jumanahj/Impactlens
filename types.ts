
export type Role = 'Director' | 'Manager' | 'Employee';

export interface User {
  user_id: string;
  name: string;
  role: Role;
  github_username: string;
  password?: string;
  team_id?: string;
  avatar_url?: string;
  is_technical?: boolean;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  status: 'Present' | 'Leave' | 'Half-Day';
}

export interface NonTechActivity {
  id: string;
  user_id: string;
  type: 'Meeting' | 'Client Interaction' | 'Initiative' | 'Ownership' | 'Leadership';
  description: string;
  impact_points: number;
  date: string;
}

export interface ClientFeedback {
  id: string;
  user_id: string;
  description: string;
  date: string;
  file_name?: string; // Simulated file name
}

export interface WorkSubmission {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  file_name?: string; // Simulated file name
}

export interface AppraisalWeights {
  technical: number;
  collaboration: number;
  business_impact: number;
  professionalism: number;
}

export interface AppraisalScores {
  technical_score: number;
  collaboration_score: number;
  business_score: number;
  professional_score: number;
  final_appraisal_rating: number; 
  ai_narrative: string;
}

export interface Team {
  team_id: string;
  team_name: string;
  repo_url: string; 
  created_by: string;
  assigned_manager_id?: string;
  github_token?: string;
  weights?: AppraisalWeights;
}

export interface CommitData {
  commit_id: string;
  github_commit_hash: string;
  author_username: string;
  lines_added: number;
  lines_deleted: number;
  commit_message: string;
  timestamp: string;
  files_changed: number;
  is_bug_fix: boolean;
  is_pr_merged: boolean;
  pr_reviews_given: number;
  review_comments: number;
  issue_comments: number;
  slack_messages: number;
  slack_threads: number;
  slack_mentions: number;
  mentoring_score: number;
  client_appreciation: number;
  attendance_rate: number; 
  org_involvement: number;
  activity_score: number;
  impact_score: number;
  collaboration_score: number;
  visibility_score: number;
  final_score: number;
  ai_explanation?: string;
}

export interface ScoreMetrics {
  user_id: string;
  team_id?: string; // Add team context
  avg_activity: number;
  avg_impact: number;
  avg_collaboration: number;
  avg_visibility: number;
  non_tech_score: number; // Added field
  final_contribution_score: number;
  rank: number;
  badge: 'Silent Architect' | 'High Visibility / Low Impact' | 'Balanced Contributor' | 'Star Performer' | 'N/A';
  appraisal?: AppraisalScores;
  z_score?: number;
}
