import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PostJobForm from '../components/PostJobForm';
import { 
  Briefcase, Users, FileText, TrendingUp, Plus, Edit, Trash2, 
  CheckCircle, XCircle, Calendar, MapPin, Clock, Mail, Phone,
  Filter, Search, Eye, MoreVertical, UserCircle, Download, ExternalLink
} from 'lucide-react';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [filterStatus, setFilterStatus] = useState('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    location: ''
  });
  
  const [editJobData, setEditJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: ''
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const timer = setTimeout(() => fetchEmployerData(), 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const fetchEmployerData = async () => {
    try {
      const config = { withCredentials: true, headers: { 'Content-Type': 'application/json' } };
      const [jobsRes, applicationsRes] = await Promise.all([
        axios.get('/employer/jobs', config),
        axios.get('/employer/applications', config)
      ]);
      
      setJobs(jobsRes.data);
      setApplications(applicationsRes.data);
      setError('');
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      const response = await axios.put(`/employer/applications/${applicationId}`, 
        { status }, { withCredentials: true }
      );
      setApplications(applications.map(app => app._id === applicationId ? response.data : app));
      alert(`Application ${status.toLowerCase()} successfully!`);
    } catch (error) {
      alert('Failed to update application status');
    }
  };

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application);
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async () => {
    if (!interviewDetails.date || !interviewDetails.time || !interviewDetails.location) {
      alert('Please fill in all interview details');
      return;
    }

    try {
      const response = await axios.put(`/employer/applications/${selectedApplication._id}`, 
        { 
          status: 'Interview',
          interviewDate: interviewDetails.date,
          interviewTime: interviewDetails.time,
          interviewLocation: interviewDetails.location
        },
        { withCredentials: true }
      );
      
      setApplications(applications.map(app => 
        app._id === selectedApplication._id ? response.data : app
      ));
      setShowInterviewModal(false);
      setInterviewDetails({ date: '', time: '', location: '' });
      setSelectedApplication(null);
      alert('Interview scheduled successfully!');
    } catch (error) {
      alert('Failed to schedule interview');
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditJobData({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary: job.salary
    });
    setShowEditJobModal(true);
  };

  const handleUpdateJob = async () => {
    try {
      const response = await axios.put(`/employer/jobs/${selectedJob._id}`, 
        editJobData, { withCredentials: true }
      );
      setJobs(jobs.map(job => job._id === selectedJob._id ? response.data : job));
      setShowEditJobModal(false);
      setSelectedJob(null);
      alert('Job updated successfully!');
    } catch (error) {
      alert('Failed to update job');
    }
  };

  const handleUpdateJobStatus = async (jobId, status) => {
    try {
      const response = await axios.put(`/employer/jobs/${jobId}/status`, 
        { status }, { withCredentials: true }
      );
      setJobs(jobs.map(job => job._id === jobId ? response.data : job));
      alert(`Job status updated to ${status}`);
    } catch (error) {
      alert('Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This will also delete all applications.')) {
      return;
    }

    try {
      await axios.delete(`/employer/jobs/${jobId}`, { withCredentials: true });
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully!');
      fetchEmployerData();
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  const handleViewProfile = (application) => {
    setSelectedCandidate(application);
    setShowProfileModal(true);
  };

  const stats = [
    { 
      label: 'Active Jobs', 
      value: jobs.filter(j => j.status === 'Active').length, 
      icon: Briefcase, 
      color: 'bg-blue-500', 
      change: '+12%',
      onClick: () => {
        setActiveTab('jobs');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },
    { 
      label: 'Total Applications', 
      value: applications.length, 
      icon: FileText, 
      color: 'bg-green-500', 
      change: '+23%',
      onClick: () => {
        setActiveTab('applications');
        setFilterStatus('all');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },
    { 
      label: 'Interviews Scheduled', 
      value: applications.filter(a => a.status === 'Interview').length, 
      icon: Calendar, 
      color: 'bg-purple-500', 
      change: '+8%',
      onClick: () => {
        setActiveTab('applications');
        setFilterStatus('Interview');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    },
    { 
      label: 'Hired', 
      value: applications.filter(a => a.status === 'Accepted').length, 
      icon: Users, 
      color: 'bg-teal-500', 
      change: '+15%',
      onClick: () => {
        setActiveTab('applications');
        setFilterStatus('Accepted');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }
  ];

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
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
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => { setError(''); setLoading(true); fetchEmployerData(); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
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
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-teal-100 text-lg">Manage your job postings and candidates effectively</p>
              </div>
              <button
                onClick={() => setShowPostJobForm(true)}
                className="hidden md:flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Post New Job
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <button
                key={index}
                onClick={stat.onClick}
                className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all text-left cursor-pointer hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Tab Navigation */}
          <div className="bg-white rounded-t-2xl shadow-lg">
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all ${
                    activeTab === 'jobs'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    My Job Postings ({jobs.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all ${
                    activeTab === 'applications'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Applications ({applications.length})
                  </div>
                </button>
              </nav>
            </div>

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="p-6">
                {jobs.length === 0 ? (
                  <div className="text-center py-16">
                    <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">You haven't posted any jobs yet</h3>
                    <p className="text-gray-600 mb-8">Start hiring top talent by posting your first job opening</p>
                    <button
                      onClick={() => setShowPostJobForm(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 shadow-lg transform hover:scale-105 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Post New Job
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-teal-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      job.status === 'Active' ? 'bg-green-100 text-green-700' :
                                      job.status === 'Fulfilled' ? 'bg-blue-100 text-blue-700' :
                                      job.status === 'Vacancy Full' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {job.status}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-600 mb-3">{job.company}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {applications.filter(a => a.jobId?._id === job._id).length} Applications
                                  </span>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{job.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleUpdateJobStatus(job._id, 'Fulfilled')}
                            className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all font-medium text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Fulfilled
                          </button>
                          <button
                            onClick={() => handleUpdateJobStatus(job._id, 'Vacancy Full')}
                            className="flex items-center gap-1 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all font-medium text-sm"
                          >
                            <Users className="w-4 h-4" />
                            Vacancy Full
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">All Applications</h3>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No applications received yet</h3>
                    <p className="text-gray-600">Applications will appear here once candidates apply to your jobs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((application) => (
                      <div key={application._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-1">{application.userId?.name || 'Candidate'}</h4>
                            <p className="text-gray-600 mb-2">Applied for: <span className="font-semibold">{application.jobId?.title || 'Job'}</span></p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {application.userId?.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(application.appliedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            application.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                            application.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                            application.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {application.status}
                          </span>
                        </div>

                        {application.status === 'Interview' && application.interviewDate && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                            <p className="font-semibold text-yellow-800 mb-2">Interview Scheduled</p>
                            <div className="text-sm text-yellow-700">
                              <p>📅 {new Date(application.interviewDate).toLocaleDateString()}</p>
                              <p>🕐 {application.interviewTime}</p>
                              <p>📍 {application.interviewLocation}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleViewProfile(application)}
                            className="flex items-center gap-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all font-medium text-sm"
                          >
                            <UserCircle className="w-4 h-4" />
                            View Profile
                          </button>
                          {application.resumeFile && (
                            <a
                              href={`http://localhost:5001${application.resumeFile}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-medium text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View Resume
                            </a>
                          )}
                          {application.resumeFile && (
                            <a
                              href={`http://localhost:5001${application.resumeFile}`}
                              download
                              className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Download Resume
                            </a>
                          )}
                          {application.status === 'Applied' && (
                            <>
                              <button
                                onClick={() => handleScheduleInterview(application)}
                                className="flex items-center gap-1 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all font-medium text-sm"
                              >
                                <Calendar className="w-4 h-4" />
                                Schedule Interview
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(application._id, 'Accepted')}
                                className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all font-medium text-sm"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(application._id, 'Rejected')}
                                className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showPostJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Post New Job</h2>
              <button
                onClick={() => setShowPostJobForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PostJobForm onJobPosted={(job) => { setJobs([...jobs, job]); setShowPostJobForm(false); fetchEmployerData(); }} />
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Schedule Interview</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={interviewDetails.date}
                  onChange={(e) => setInterviewDetails({...interviewDetails, date: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={interviewDetails.time}
                  onChange={(e) => setInterviewDetails({...interviewDetails, time: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={interviewDetails.location}
                  onChange={(e) => setInterviewDetails({...interviewDetails, location: e.target.value})}
                  placeholder="Office address or video call link"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInterviewSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Edit Job</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={editJobData.title}
                  onChange={(e) => setEditJobData({...editJobData, title: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={editJobData.company}
                  onChange={(e) => setEditJobData({...editJobData, company: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editJobData.location}
                  onChange={(e) => setEditJobData({...editJobData, location: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                <input
                  type="text"
                  value={editJobData.salary}
                  onChange={(e) => setEditJobData({...editJobData, salary: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={editJobData.description}
                  onChange={(e) => setEditJobData({...editJobData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowEditJobModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateJob}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700"
              >
                Update Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Modal */}
      {showProfileModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <UserCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedCandidate.userId?.name || 'Candidate'}</h2>
                    <p className="text-purple-100 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {selectedCandidate.userId?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedCandidate.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                  selectedCandidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                  selectedCandidate.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Status: {selectedCandidate.status}
                </span>
                <span className="text-purple-100 text-sm">
                  Applied {new Date(selectedCandidate.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Job Applied For */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Position Applied For
                </h3>
                <p className="text-xl font-semibold text-gray-900">{selectedCandidate.jobId?.title || 'Job Position'}</p>
                <p className="text-gray-600 mt-1">{selectedCandidate.jobId?.company || 'Company'}</p>
              </div>

              {/* Cover Letter */}
              {selectedCandidate.coverLetter && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Cover Letter
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-purple-600">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{selectedCandidate.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Interview Details */}
              {selectedCandidate.status === 'Interview' && selectedCandidate.interviewDate && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-xl p-5">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Interview Scheduled
                  </h3>
                  <div className="space-y-2 text-yellow-700">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">Date:</span> {new Date(selectedCandidate.interviewDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">Time:</span> {selectedCandidate.interviewTime}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-semibold">Location:</span> {selectedCandidate.interviewLocation}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      {selectedCandidate.email || selectedCandidate.userId?.email || 'Not provided'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      {selectedCandidate.phone || selectedCandidate.userId?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resume Actions */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Resume
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedCandidate.resumeUrl || selectedCandidate.resumeFile ? (
                    <>
                      <a
                        href={`http://localhost:5001${selectedCandidate.resumeUrl || selectedCandidate.resumeFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-lg"
                      >
                        <Eye className="w-5 h-5" />
                        View Resume
                      </a>
                      <a
                        href={`http://localhost:5001${selectedCandidate.resumeUrl || selectedCandidate.resumeFile}`}
                        download
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                        Download Resume
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">No resume uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex flex-wrap gap-3">
                {selectedCandidate.status === 'Applied' && (
                  <>
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                        handleScheduleInterview(selectedCandidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-semibold"
                    >
                      <Calendar className="w-5 h-5" />
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedCandidate._id, 'Accepted');
                        setShowProfileModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Candidate
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(selectedCandidate._id, 'Rejected');
                        setShowProfileModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default EmployerDashboard;
