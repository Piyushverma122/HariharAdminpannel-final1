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
import AwwAwhData from './pages/AwwAwhData'; // This component is now expected to handle Teachers Stats content
import SupportWorkers from './pages/SupportWorkers'; // This component is now expected to handle Student Stats content
import Settings from './pages/Settings';
import Login from './pages/Login';
import SchoolStats from './pages/SchoolStats'; // NEW: Import the SchoolStats component

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
              path="/aww-awh-data" // This route's content should now be Teachers Stats
              element={
                <PrivateRoute>
                  <Layout>
                    <AwwAwhData />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/support-workers" // This route's content should now be Student Stats
              element={
                <PrivateRoute>
                  <Layout>
                    <SupportWorkers />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/school-stats" // NEW: Route for the School Stats page
              element={
                <PrivateRoute>
                  <Layout>
                    <SchoolStats />
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