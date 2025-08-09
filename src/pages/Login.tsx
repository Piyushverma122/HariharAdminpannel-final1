import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiService, ApiError } from '../services/apiService';
import { LogIn } from 'lucide-react';

const Login = () => {
  // State for admin login (UDISE Code and password)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // Destructure login function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation

  // useEffect to inject global styles for the login page
  useEffect(() => {
    const style = document.createElement('style');
    // Injecting CSS directly into the head for a self-contained example.
    // In a larger project, consider a dedicated CSS file or a CSS-in-JS solution.
    style.innerHTML = `
      body {
        margin: 0;
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(to bottom right, #e6f4ea, #b6e2c1); /* Soft green gradient background */
        overflow: hidden; /* Prevent scrollbars if content overflows */
        position: relative;
        min-height: 100vh; /* Full viewport height */
        display: flex;
        align-items: center; /* Center vertically */
        justify-content: center; /* Center horizontally */
        perspective: 1000px; /* For potential 3D effects, though not used here */
      }

      /* --- Login Container & Card Styles --- */
      .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 100vw; /* Ensure it doesn't exceed viewport width */
      }

      .login-card {
          background: #FFFFFF; /* Clean, solid white background for the card */
          border-radius: 16px; /* Slightly rounded corners for a modern look */
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); /* Soft, subtle shadow for depth */
          padding: 40px;
          width: 100%;
          max-width: 450px; /* Increased width for better form layout */
          text-align: center;
          position: relative;
          z-index: 10;
          transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions for hover effects */
      }

      .login-card:hover {
          transform: translateY(-5px); /* Subtle lift on hover */
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Slightly more pronounced shadow on hover */
      }

      /* --- Logo & Title --- */
      .login-logo {
          margin-bottom: 25px;
          max-width: 150px;
          height: auto;
          display: block;
          margin-left: auto;
          margin-right: auto;
      }

      .login-title {
          font-size: 32px;
          margin-bottom: 25px;
          color: #2e7d32; /* Dark green color for the title */
          font-weight: 700;
          text-shadow: none; /* Removed text glow for a cleaner look */
      }

      /* --- Form Elements --- */
      .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px; /* Spacing between form elements */
      }

      .login-form input,
      .login-form select {
          padding: 14px;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 16px;
          outline: none; /* Remove default focus outline */
          background-color: #f9f9f9; /* Light background for inputs */
          color: #333; /* Dark text for inputs */
          transition: border 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          text-shadow: none;
          /* Remove custom select arrow styling for consistency */
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: none;
          padding-right: 14px; /* Reset padding for default arrow */
      }

      .login-form input::placeholder {
          color: #999; /* Standard placeholder color */
          text-shadow: none;
      }

      .login-form input:focus,
      .login-form select:focus {
          border-color: #2e7d32; /* Green border on focus */
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.2); /* Green focus glow */
          background-color: #ffffff;
      }

      .login-form button {
          padding: 14px;
          background-color: #2e7d32; /* Solid green button */
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 128, 0, 0.2); /* Subtle button shadow */
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: none;
      }

      .login-form button:hover {
          background-color: #1b5e20; /* Darker green on hover */
          transform: translateY(-2px); /* Lift effect on hover */
          box-shadow: 0 6px 15px rgba(0, 128, 0, 0.3);
      }

      .login-button-icon {
          margin-right: 10px;
          width: 22px;
          height: 22px;
      }

      /* --- Error Message --- */
      .error-message {
          color: red; /* Standard red for errors */
          font-size: 14px;
          margin-top: -10px;
          margin-bottom: 5px;
          font-weight: 500;
          text-shadow: none;
      }

      /* --- Footer --- */
      .login-footer {
          margin-top: 30px;
          font-size: 14px;
          color: #777; /* Dark grey for footer text */
          padding-top: 15px;
          border-top: 1px solid #eee; /* Subtle separator line */
          font-weight: 400;
          text-shadow: none;
      }

      /* --- Responsive Adjustments --- */
      @media (max-width: 600px) {
          .login-card {
              margin: 20px;
              padding: 30px 25px;
              border-radius: 15px;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
              max-width: 90%;
              width: 90%;
          }

          .login-logo {
              max-width: 120px;
              margin-bottom: 20px;
          }

          .login-title {
              font-size: 30px;
              margin-bottom: 20px;
          }

          .login-form {
              gap: 15px;
          }

          .login-form input,
          .login-form select,
          .login-form button {
              padding: 12px 15px;
              font-size: 16px;
              border-radius: 10px;
          }

          .login-button-icon {
              width: 20px;
              height: 20px;
              margin-right: 8px;
          }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // handleLogin function to manage authentication logic for admin only
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Please enter both Admin ID and password.');
      return;
    }

    try {
      // Use API service for login
      const loginData = await ApiService.adminLogin({
        admin_id: username.trim(),
        password: password.trim(),
      });

      // Login successful
      login(`admin-${loginData.admin_id}`, 'admin');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/logo.png" // Path to your logo image in the public folder
          alt="Hari Har Pathshala Logo"
          className="login-logo"
        />
        <h2 className="login-title">Administration Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            id="loginIdentifier"
            placeholder="Admin ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
          <button type="submit">
            <LogIn className="login-button-icon" /> {/* LogIn icon for visual appeal */}
            Log In
          </button>
        </form>
        <div className="login-footer">
          <p>Hari Har Pathshala</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
