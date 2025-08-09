import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SchoolStats from './pages/SchoolStats';
import StudentDetails from './pages/StudentDetails';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth(); // Get isLoggedIn state from AuthContext
  console.log("PrivateRoute: Rendering. isLoggedIn:", isLoggedIn);

  // If isLoggedIn is false, redirect to the login page (root path)
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Login Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes - wrapped with PrivateRoute */}
            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/school-stats"
              element={
                <PrivateRoute>
                  <Layout>
                    <SchoolStats />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/student-details"
              element={
                <PrivateRoute>
                  <Layout>
                    <StudentDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Fallback Route: If no other route matches, redirect to dashboard (or login if not authenticated) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;