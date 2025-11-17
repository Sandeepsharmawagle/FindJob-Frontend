import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Clock } from 'lucide-react';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Fulfilled':
        return 'bg-orange-100 text-orange-800';
      case 'Vacancy Full':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (salary) => {
    return `₹${(salary / 100000).toFixed(1)}L`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now - posted;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div
      onClick={() => navigate(`/jobs/${job._id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-indigo-500"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-lg font-semibold text-gray-700 mb-1">{job.company}</p>
        </div>
        {job.hasApplied && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            Applied
          </span>
        )}
      </div>

      {/* Job Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm font-semibold text-green-600">
            {formatSalary(job.salary)} per year
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{getTimeAgo(job.createdAt)}</span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {job.status && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          )}
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default JobCard;
