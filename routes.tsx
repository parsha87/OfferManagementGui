import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './src/pages/Dashboard';
import Login from './src/pages/Login';
import InquiryGrid from './src/pages/InquiryGrid';
import AppLayout from './src/components/AppLayout';
import { useAuth } from './src/context/AuthContext';
import React from 'react';
import InquiryForm from './src/pages/InquiryForm';
import UserGrid from './src/pages/User/UserGrid';
import UserForm from './src/pages/User/UserForm';
import InquiryExport from './src/pages/InquiryExport';

// PrivateRoute component checks if the user is authenticated
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// RouterApp component where routes are defined
const RouterApp = () => (
  <Routes>
    {/* Login route */}
    <Route path="/login" element={<Login />} />

    {/* Protected routes */}
    <Route
      path="/*"
      element={
        <PrivateRoute>
          <AppLayout>
            <Routes>
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" />} />
              {/* Dashboard route */}
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Inquiry grid route */}
              <Route path="/inquiries" element={<InquiryGrid />} />
              <Route path="/inquiries/new" element={<InquiryForm />} />
              <Route path="/inquiries/edit/:id" element={<InquiryForm />} />
              <Route path="/inquiries/export" element={<InquiryExport />} />

              {/* USers */}
              <Route path="/users" element={<UserGrid />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
            </Routes>
          </AppLayout>
        </PrivateRoute>
      }
    />
  </Routes>
);

export default RouterApp;
