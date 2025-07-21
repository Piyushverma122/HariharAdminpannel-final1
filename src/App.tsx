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
import AwwAwhData from './pages/AwwAwhData';
import SupportWorkers from './pages/SupportWorkers';
import Settings from './pages/Settings';
import Login from './pages/Login';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth(); // Get isLoggedIn state from AuthContext
  console.log("PrivateRoute: Rendering. isLoggedIn:", isLoggedIn);

  // If isLoggedIn is false, redirect to the login page (root path)
  // The 'loading' state is handled directly within AuthProvider now,
  // so `isLoggedIn` will only be `true` or `false` here.
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
              path="/aww-awh-data"
              element={
                <PrivateRoute>
                  <Layout>
                    <AwwAwhData />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/support-workers"
              element={
                <PrivateRoute>
                  <Layout>
                    <SupportWorkers />
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

            {/* ✅ TEMPORARY DEBUGGING CHANGE: Render a message instead of redirecting */}
            {/* This will help us see if an unexpected path is being hit */}
            <Route path="*" element={
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px', color: 'red' }}>
                404 - Page Not Found (Debug Mode)
                <p style={{ fontSize: '16px', color: 'gray' }}>Check your URL and routing configuration.</p>
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
