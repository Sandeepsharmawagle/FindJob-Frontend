import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      const userRole = result.user?.role;
      
      if (userRole === 'applicant' || userRole === 'jobseeker') {
        navigate('/dashboard/jobseeker');
      } else if (userRole === 'employer') {
        navigate('/dashboard/employer');
      } else {
        console.error('Unknown role:', userRole);
        navigate('/');
      }
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  const features = [
    'Create your professional profile',
    'Get instant job recommendations',
    'Apply to unlimited positions',
    'Track all your applications in one place'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex">
      {/* Left Side - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-700 to-blue-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -top-20 -right-20 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute transform -rotate-45 -bottom-20 -left-20 w-96 h-96 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-bold mb-6">Start Your Career Journey</h2>
          <p className="text-xl text-cyan-100 mb-10">
            Join our platform and unlock endless career opportunities
          </p>

          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-purple-50">{feature}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <p className="text-2xl font-bold mb-2">100% Free Forever</p>
            <p className="text-purple-100">No credit card required. Start applying today!</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                THE SS Job Portal
              </h1>
            </Link>
            <p className="text-gray-600 text-lg">Create your free account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-shake">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I am a...
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="applicant">Job Seeker</option>
                  <option value="employer">Employer / Recruiter</option>
                </select>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-cyan-600 hover:text-cyan-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-white font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-cyan-600 rounded-xl text-cyan-600 font-semibold hover:bg-cyan-50 transition-all"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
