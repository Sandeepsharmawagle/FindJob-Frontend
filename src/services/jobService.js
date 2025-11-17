import api from './api';

const jobService = {
  // Get all jobs (with optional filters)
  getAllJobs: async (filters = {}) => {
    const { search, location } = filters;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get jobs with application status for logged-in user
  getJobsWithStatus: async (filters = {}) => {
    const { search, location } = filters;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    
    const response = await api.get(`/jobs/browse?${params.toString()}`);
    return response.data;
  },

  // Get single job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create new job (employer only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job (employer only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/employer/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Update job status (employer only)
  updateJobStatus: async (jobId, status) => {
    const response = await api.put(`/employer/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // Delete job (employer only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/employer/jobs/${jobId}`);
    return response.data;
  },

  // Get employer's jobs
  getEmployerJobs: async () => {
    const response = await api.get('/employer/jobs');
    return response.data;
  }
};

export default jobService;
