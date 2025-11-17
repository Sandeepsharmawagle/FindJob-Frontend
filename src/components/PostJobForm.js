import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, Building2, MapPin, DollarSign, FileText, Loader } from 'lucide-react';

const PostJobForm = ({ onJobPosted, onCancel }) => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!jobData.title || !jobData.description || !jobData.company || !jobData.location || !jobData.salary) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const salaryValue = parseFloat(jobData.salary);
    if (isNaN(salaryValue) || salaryValue <= 0) {
      setError('Please enter a valid salary');
      setLoading(false);
      return;
    }

    try {
      console.log('Posting job with data:', {...jobData, salary: salaryValue});
      // Ensure salary is sent as a number
      const jobPayload = {
        ...jobData,
        salary: salaryValue
      };
      
      const response = await axios.post('/jobs', jobPayload, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Job posted successfully:', response.data);
      onJobPosted(response.data);
    } catch (error) {
      console.error('Error posting job:', error);
      console.error('Error response:', error.response);
      
      // More detailed error handling
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (error.response.status === 403) {
          setError('You are not authorized to post jobs.');
        } else if (error.response.status === 400) {
          setError(error.response.data.message || 'Invalid job data provided.');
        } else {
          setError(error.response.data.message || 'Failed to post job. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-shake">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Job Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            required
            value={jobData.title}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g., Software Engineer"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="company"
            required
            value={jobData.company}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g., Tech Corp"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="location"
            required
            value={jobData.location}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g., New York, NY or Remote"
          />
        </div>
      </div>

      {/* Salary */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Salary (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            name="salary"
            required
            min="1"
            step="1000"
            value={jobData.salary}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
            placeholder="e.g., 80000"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Annual salary in USD</p>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            name="description"
            required
            rows="6"
            value={jobData.description}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 resize-vertical"
            placeholder="Describe the job responsibilities, requirements, and benefits..."
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Minimum 50 characters</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Posting Job...
            </>
          ) : (
            <>
              <Briefcase className="w-5 h-5" />
              Post Job
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostJobForm;