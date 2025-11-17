import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set base URL for axios
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.withCredentials = true;

  console.log('AuthContext initialized with API base URL:', API_BASE_URL);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Checking if user is logged in...');
        console.log('API Base URL:', axios.defaults.baseURL);
        const response = await axios.get('/auth/profile');
        console.log('User profile response:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error checking user profile:', error.response?.data || error.message);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
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
      console.log('API Base URL:', axios.defaults.baseURL);
      const response = await axios.post('/auth/login', { email, password });
      console.log('Login successful:', response.data);
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const { name, email, password, role } = userData;
      console.log('Attempting registration with:', { name, email, role });
      console.log('API Base URL:', axios.defaults.baseURL);
      const response = await axios.post('/auth/register', { name, email, password, role });
      console.log('Registration successful:', response.data);
      setUser(response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
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