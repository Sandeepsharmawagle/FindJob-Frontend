import { useState, useEffect } from 'react';
import { jobsApi } from '../api/endpoints';

/**
 * Custom hook to fetch and manage jobs
 * @param {Object} filters - Optional filters (search, location)
 * @param {boolean} withStatus - Whether to fetch jobs with application status
 */
const useJobs = (filters = {}, withStatus = false) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = withStatus 
        ? await jobsApi.getJobsWithStatus(filters)
        : await jobsApi.getAllJobs(filters);
      
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters), withStatus]);

  return { jobs, loading, error, refetch: fetchJobs };
};

export default useJobs;
