import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, TrendingUp, Users, Building2, ChevronRight, Zap, Shield, Award } from 'lucide-react';
import { MainLayout } from '../layouts';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}&location=${location}`);
  };

  const popularSearches = [
    'Software Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Full Stack Developer',
    'Business Analyst'
  ];

  const categories = [
    { name: 'Technology', icon: Briefcase, count: '2,500+', color: 'bg-blue-100 text-blue-600' },
    { name: 'Marketing', icon: TrendingUp, count: '1,200+', color: 'bg-green-100 text-green-600' },
    { name: 'Sales', icon: Users, count: '1,800+', color: 'bg-purple-100 text-purple-600' },
    { name: 'Finance', icon: Building2, count: '950+', color: 'bg-orange-100 text-orange-600' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Quick Apply',
      description: 'Apply to multiple jobs with one click using your profile',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Verified Companies',
      description: 'All employers are verified for your safety and trust',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Award,
      title: 'Smart Matching',
      description: 'AI-powered job recommendations based on your profile',
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Find Your <span className="text-cyan-300">Dream Job</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with top companies and discover opportunities that match your skills and aspirations
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center px-4 py-4 bg-gray-50 rounded-xl">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                Search Jobs
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8 text-center">
            <p className="text-blue-100 mb-4 text-lg">Popular Searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    navigate(`/jobs?search=${search}`);
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Active Jobs' },
              { number: '5,000+', label: 'Companies' },
              { number: '50,000+', label: 'Candidates' },
              { number: '15,000+', label: 'Success Stories' }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore thousands of jobs in your field of interest
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => navigate('/jobs')}
                className="bg-white rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-500 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mb-6`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-lg">{category.count} jobs available</p>
                <div className="mt-4 flex items-center text-indigo-600 font-semibold">
                  Explore <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Everything you need for a successful job search</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform">
                <div className={`w-20 h-20 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of job seekers and employers on THE SS Job Portal today
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Create Free Account
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
