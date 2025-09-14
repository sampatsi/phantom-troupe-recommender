import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'org_admin';
  education: {
    degree: string;
    branch: string;
    year: number;
    cgpa: number;
  };
  skills: string[];
  certifications: string[];
  preferences: {
    roles: string[];
    locations: string[];
    stiped_min: number;
    org_types: string[];
  };
  constraints: {
    disability: boolean;
    gender: string;
    income_band: string;
  };
  language_pref: string[];
  geo: {
    type: string;
    coordinates: number[];
  };
  isActive: boolean;
  lastLogin: string;
}

export interface Internship {
  _id: string;
  title: string;
  org: string;
  org_type: string;
  description: string;
  skills_required: string[];
  skills_nice_to_have: string[];
  education_required: {
    degree: string[];
    branches: string[];
    year_min: number;
  };
  location: string;
  is_remote: boolean;
  stipend: number;
  duration_months: number;
  application_deadline: string;
  language_required: string[];
  diversity_eligibility: {
    women_only: boolean;
    pwd_friendly: boolean;
    ews_priority: boolean;
  };
  geo: {
    type: string;
    coordinates: number[];
  };
  verified: boolean;
  posted_at: string;
  posted_by: string;
  isActive: boolean;
  application_count: number;
}

export interface Recommendation {
  internshipId: string;
  title: string;
  org: string;
  location: string;
  stipend: number;
  duration_months: number;
  score: number;
  why: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Facets {
  locations: string[];
  org_types: string[];
}

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    api.post('/api/auth/login', { email, password }).then(res => res.data),
  
  register: (userData: Partial<User> & { password: string }): Promise<AuthResponse> =>
    api.post('/api/auth/register', userData).then(res => res.data),
  
  getProfile: (): Promise<{ user: User }> =>
    api.get('/api/auth/profile').then(res => res.data),
  
  updateProfile: (userData: Partial<User>): Promise<{ message: string; user: User }> =>
    api.put('/api/auth/profile', userData).then(res => res.data),
  
  changePassword: (currentPassword: string, newPassword: string): Promise<{ message: string }> =>
    api.put('/api/auth/change-password', { currentPassword, newPassword }).then(res => res.data),
  
  deactivateAccount: (): Promise<{ message: string }> =>
    api.delete('/api/auth/deactivate').then(res => res.data),
};

// Internship API
export const internshipAPI = {
  getRecommendations: (limit: number = 10): Promise<{ count: number; items: Recommendation[] }> =>
    api.get(`/api/recommendations?limit=${limit}`).then(res => res.data),
  
  getInternship: (id: string): Promise<Internship> =>
    api.get(`/api/internships/${id}`).then(res => res.data),
  
  getFacets: (): Promise<Facets> =>
    api.get('/api/facets').then(res => res.data),
};

// Health API
export const healthAPI = {
  check: (): Promise<{ ok: boolean; now: string; database: any }> =>
    api.get('/health').then(res => res.data),
};

export default api;
