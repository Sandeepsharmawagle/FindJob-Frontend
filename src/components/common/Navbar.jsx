import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isJobsDropdown, setIsJobsDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-gray-800">THE SS</div>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Jobs Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsJobsDropdown(!isJobsDropdown)}
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Jobs
                <ChevronDown className="w-4 h-4" />
              </button>
              {isJobsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/jobs"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsJobsDropdown(false)}
                  >
                    Browse All Jobs
                  </Link>
                  {user && user.role === 'applicant' && (
                    <Link
                      to="/applications"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsJobsDropdown(false)}
                    >
                      My Applications
                    </Link>
                  )}
                </div>
              )}
            </div>

            {user && user.role === 'employer' && (
              <Link
                to="/dashboard/employer"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Post Jobs
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to={`/dashboard/${user.role === 'applicant' ? 'user' : user.role}`}
                  className="hidden md:block text-teal-700 hover:text-teal-800 font-semibold transition-colors"
                >
                  {user.role === 'employer' ? 'Employer Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/jobs"
                  className="hidden md:block text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="text-teal-700 hover:text-teal-800 font-semibold transition-colors"
                >
                  Employer Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Candidate Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
