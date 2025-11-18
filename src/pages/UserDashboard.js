import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Briefcase, Calendar, MapPin, Clock, FileText, TrendingUp, CheckCircle, XCircle, AlertCircle, Search, Filter, Building2, DollarSign, Eye } from 'lucide-react';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'applications'
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchApplications(), fetchJobs()]);
      setLoading(false);
    };
    
    const timer = setTimeout(() => {
      fetchData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === filterStatus));
    }
  }, [filterStatus, applications]);

  const fetchApplications = async () => {
    try {
      setError('');
      
      const response = await api.get('/applications/');
      
      setApplications(response.data);
      setFilteredApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch applications';
        setError(`Error loading applications: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/browse');
      console.log('Jobs fetched:', response.data);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Jobs error details:', error.response?.data);
      // Don't show error for jobs, just log it - applications are more critical
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-700',
      'Interview': 'bg-yellow-100 text-yellow-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      case 'Interview': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending', value: applications.filter(a => a.status === 'Applied').length, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length, icon: CheckCircle, color: 'bg-green-500' }
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => { setError(''); setLoading(true); fetchApplications(); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-blue-100 text-lg">Browse jobs and track all your applications in one place</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 border-b border-gray-200">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-6 py-4 font-semibold transition-all border-b-4 flex items-center gap-2 ${
                    activeTab === 'browse'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Search className="w-5 h-5" />
                  Browse Jobs ({jobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-6 py-4 font-semibold transition-all border-b-4 flex items-center gap-2 ${
                    activeTab === 'applications'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Briefcase className="w-5 h-5" />
                  My Applications ({applications.length})
                </button>
              </div>
            </div>

            {/* Browse Jobs Tab */}
            {activeTab === 'browse' && (
              <div>
                {jobs.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No jobs available</h3>
                    <p className="text-gray-600">Check back later for new opportunities</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    {jobs.map((job) => (
                      <div key={job._id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                            <p className="text-gray-600 font-medium flex items-center gap-2 mb-2">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${job.salary?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {job.hasApplied && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <CheckCircle className="w-4 h-4" /> Applied
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex gap-3">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                          {!job.hasApplied && (
                            <Link
                              to={`/apply/${job._id}`}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                            >
                              Apply Now
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                {/* Filter Section */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Applications List */}
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {filterStatus === 'all' ? "You haven't applied for any jobs yet" : `No ${filterStatus} applications`}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      {filterStatus === 'all' 
                        ? 'Switch to Browse Jobs tab to explore opportunities' 
                        : 'Try changing the filter to see other applications'}
                    </p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg transform hover:scale-105"
                    >
                      <Search className="w-5 h-5" />
                      Browse Jobs
                    </button>
                  </div>
                ) : (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="p-6 hover:bg-gray-50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          {application.jobId?.title || 'Job Title'}
                          <span className={`${getStatusColor(application.status)} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                            {getStatusIcon(application.status)}
                            {application.status || 'Pending'}
                          </span>
                        </h3>
                        <p className="text-gray-600 font-medium mb-2">{application.jobId?.company || 'Company Name'}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.jobId?.location || 'Location'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interview Details */}
                    {application.status === 'Interview' && application.interviewDate && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Interview Scheduled
                        </h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                          <p>📅 {new Date(application.interviewDate).toLocaleDateString()}</p>
                          <p>🕐 {application.interviewTime}</p>
                          <p>📍 {application.interviewLocation}</p>
                        </div>
                      </div>
                    )}

                    {/* Accepted Message */}
                    {application.status === 'Accepted' && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mt-4">
                        <p className="font-semibold text-green-800 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          🎉 Congratulations! Your application has been accepted!
                        </p>
                      </div>
                    )}

                    {/* Rejected Message */}
                    {application.status === 'Rejected' && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
                        <p className="font-semibold text-red-800 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Unfortunately, your application was not selected this time.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
