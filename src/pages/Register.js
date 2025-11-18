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

  // ADD THIS FUNCTION HERE ↓↓↓
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
      // Use the role directly from the response
      const userRole = result.user?.role;
      
      // Fixed role-based routing
      if (userRole === 'applicant' || userRole === 'jobseeker') {
        navigate('/dashboard/jobseeker');
      } else if (userRole === 'employer') {
        navigate('/dashboard/employer');
      } else {
        // Fallback if role is undefined or unknown
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

  // ... rest of your JSX remains the same
  return (
    // ... your existing JSX
  );
};

export default Register;
