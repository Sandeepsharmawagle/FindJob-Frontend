import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = API_BASE_URL;
    
    // Set token from localStorage if exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token loaded from localStorage');
    }
  }, [API_BASE_URL]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found in localStorage');
          setLoading(false);
          return;
        }

        console.log('Checking user profile with token...');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get('/auth/profile');
        console.log('User profile response:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error checking user profile:', error.response?.data || error.message);
        // Clear invalid token
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token saved to localStorage');
        
        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: 'Login failed - no token received' };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { name, email, password, role } = userData;
      console.log('Attempting registration with:', { name, email, role });
      
      const response = await axios.post('/auth/register', { name, email, password, role });
      console.log('Registration response:', response.data);
      
      if (response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token saved to localStorage');
        
        // Set Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: 'Registration failed - no token received' };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out...');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove Authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
