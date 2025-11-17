import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Briefcase, Calendar, MapPin, Clock, FileText, TrendingUp, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const timer = setTimeout(() => {
      fetchApplications();
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

  const fetchApplications = async (retryCount = 0) => {
    try {
      const config = { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      };
      
      const response = await axios.get('/applications/', config);
      setApplications(response.data);
      setFilteredApplications(response.data);
      setError('');
      setLoading(false);
    } catch (error) {
      if (retryCount < 3 && (error.code === 'ECONNABORTED' || error.message.includes('Network Error'))) {
        setTimeout(() => fetchApplications(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      let errorMessage = 'Failed to fetch applications';
      if (error.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
      
      setError(errorMessage);
      setLoading(false);
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
                <p className="text-blue-100 text-lg">Track and manage all your job applications in one place</p>
              </div>
              <Link
                to="/jobs"
                className="hidden md:flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
              >
                <Search className="w-5 h-5" />
                Find More Jobs
              </Link>
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

        {/* Applications Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with Filter */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  My Applications
                </h2>
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
                    ? 'Start your journey by exploring thousands of job opportunities' 
                    : 'Try changing the filter to see other applications'}
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg transform hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                  Browse Jobs
                </Link>
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
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
