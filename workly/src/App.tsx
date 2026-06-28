import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Onboarding from './pages/Onboarding';
import Attendance from './pages/Attendance';
import AuditLogs from './pages/AuditLogs';
import MyPayslips from './pages/MyPayslips';
import Profile from './pages/Profile';
import AccessRequests from './pages/AccessRequests';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isLoggedIn ? <Navigate to="/dashboard" /> : <Landing />
      } />
      <Route path="/login" element={
        isLoggedIn ? <Navigate to="/dashboard" /> : <Login />
      } />
      <Route path="/request-access" element={
        isLoggedIn ? <Navigate to="/dashboard" /> : <Register />
      } />
      <Route path="/" element={
        <ProtectedRoute><Layout /></ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="my-payslips" element={<MyPayslips />} />
        <Route path="profile" element={<Profile />} />
        <Route path="access-requests" element={<AccessRequests />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;