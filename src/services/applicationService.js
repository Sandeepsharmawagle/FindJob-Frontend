import api from './api';

const applicationService = {
  // Apply for a job
  applyForJob: async (jobId, formData) => {
    const response = await api.post('/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user's applications
  getUserApplications: async () => {
    const response = await api.get('/applications/');
    return response.data;
  },

  // Get applications for employer's jobs
  getEmployerApplications: async () => {
    const response = await api.get('/employer/applications');
    return response.data;
  },

  // Update application status (employer only)
  updateApplicationStatus: async (applicationId, statusData) => {
    const response = await api.put(`/employer/applications/${applicationId}`, statusData);
    return response.data;
  }
};

export default applicationService;
