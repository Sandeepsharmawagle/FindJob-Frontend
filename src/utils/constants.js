/**
 * Constants used throughout the application
 */

// User roles
export const USER_ROLES = {
  APPLICANT: 'applicant',
  EMPLOYER: 'employer',
  ADMIN: 'admin'
};

// Application statuses
export const APPLICATION_STATUS = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted'
};

// Job statuses
export const JOB_STATUS = {
  ACTIVE: 'Active',
  FULFILLED: 'Fulfilled',
  VACANCY_FULL: 'Vacancy Full',
  CLOSED: 'Closed'
};

// Status colors for badges
export const STATUS_COLORS = {
  Applied: { bg: '#e3f2fd', color: '#1976d2' },
  Interview: { bg: '#fff8e1', color: '#f57f17' },
  Rejected: { bg: '#ffebee', color: '#b71c1c' },
  Accepted: { bg: '#e8f5e9', color: '#388e3c' },
  Active: { bg: '#e8f5e9', color: '#388e3c' },
  Fulfilled: { bg: '#fff3e0', color: '#e65100' },
  'Vacancy Full': { bg: '#fce4ec', color: '#c2185b' },
  Closed: { bg: '#f5f5f5', color: '#757575' }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  JOBS: {
    BASE: '/jobs',
    BROWSE: '/jobs/browse',
    EMPLOYER: '/employer/jobs'
  },
  APPLICATIONS: {
    BASE: '/applications',
    APPLY: '/applications/apply',
    EMPLOYER: '/employer/applications'
  }
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Form validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  DESCRIPTION_MIN_LENGTH: 50,
  TITLE_MIN_LENGTH: 3
};
