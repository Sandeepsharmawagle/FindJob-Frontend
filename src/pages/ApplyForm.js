import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Send, Loader, X, Mail, Phone } from 'lucide-react';

const ApplyForm = () => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [job, setJob] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setResume(file);
    } else {
      setError('Please upload a valid PDF or DOC file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobId', jobId);
    formData.append('email', email);
    formData.append('phone', phone);
    if (coverLetter) {
      formData.append('coverLetter', coverLetter);
    }
    
    try {
      await axios.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to={`/jobs/${jobId}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Job Details
            </Link>
            <h1 className="text-4xl font-bold mb-2">Apply for Position</h1>
            {job && (
              <div className="text-blue-100">
                <p className="text-2xl font-semibold">{job.title}</p>
                <p className="text-lg">{job.company}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {success ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your application has been submitted successfully. We'll review it and get back to you soon.
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Redirecting to your dashboard...</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-7 h-7 text-blue-600" />
                  Application Form
                </h2>
                <p className="text-gray-600 mt-2">Please fill in the details below to submit your application</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-shake">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                )}
                
                {/* Resume Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-3 border-dashed rounded-2xl p-12 transition-all ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : resume
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center">
                      {resume ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-8 h-8 text-green-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-800">{resume.name}</p>
                            <p className="text-sm text-gray-500">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResume(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all font-medium"
                          >
                            <X className="w-4 h-4" />
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <label
                              htmlFor="resume"
                              className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
                            >
                              <Upload className="w-5 h-5" />
                              Upload a file
                            </label>
                            <input
                              id="resume"
                              name="resume"
                              type="file"
                              className="hidden"
                              onChange={(e) => setResume(e.target.files[0])}
                              accept=".pdf,.doc,.docx"
                            />
                            <p className="text-gray-600 mt-3">or drag and drop</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      <Mail className="w-5 h-5 inline mr-2" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      <Phone className="w-5 h-5 inline mr-2" />
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Cover Letter <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows="8"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Tell us why you're a great fit for this position..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {coverLetter.length} characters
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !resume || !email || !phone}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplyForm;