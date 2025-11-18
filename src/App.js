import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
        <Route path="/dashboard/employer" element={<EmployerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        
        {/* Fallback for undefined roles */}
        <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;