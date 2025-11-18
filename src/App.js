import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import ApplyForm from './pages/ApplyForm';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Job routes */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/apply/:jobId" element={<ApplyForm />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard/jobseeker" element={<UserDashboard />} />
          <Route path="/dashboard/user" element={<UserDashboard />} />
          <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          
          {/* Fallback routes */}
          <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
