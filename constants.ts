
import { User } from './types';

export const INITIAL_USERS: User[] = [
  { 
    user_id: 'u1', 
    name: 'Alice Director', 
    role: 'Director', 
    github_username: 'alice_dir', 
    password: 'director_password123' 
  },
  { 
    user_id: 'u2', 
    name: 'Bob Manager', 
    role: 'Manager', 
    github_username: 'bob_mgr', 
    password: 'manager_password123' 
  },
  { 
    user_id: 'u4', 
    name: 'Dave Manager', 
    role: 'Manager', 
    github_username: 'dave_mgr', 
    password: 'manager_password123' 
  },
  { 
    user_id: 'u3', 
    name: 'Charlie Dev', 
    role: 'Employee', 
    github_username: 'charlie_code', 
    password: 'employee_password123' 
  },
];

export const ROLE_PERMISSIONS = {
  Director: ['setup_teams', 'view_all', 'manage_weights'],
  Manager: ['view_dashboard', 'analyze_appraisal', 'view_team'],
  Employee: ['view_personal_appraisal', 'view_transparency_report'],
};

export const GITHUB_API_BASE = 'https://api.github.com';
