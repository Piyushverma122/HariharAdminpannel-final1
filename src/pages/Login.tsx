import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../config/apiConfig';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(to bottom right, #e6f4ea, #b6e2c1);
      }

      .login-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .login-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0, 128, 0, 0.2);
        padding: 40px;
        width: 100%;
        max-width: 400px;
        text-align: center;
      }

      .login-title {
        font-size: 28px;
        margin-bottom: 20px;
        color: #2e7d32;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .login-form input,
      .login-form select {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
        outline: none;
        transition: border 0.3s ease;
      }

      .login-form input:focus,
      .login-form select:focus {
        border-color: #2e7d32;
      }

      .login-form button {
        padding: 12px;
        background-color: #2e7d32;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.3s ease;
      }

      .login-form button:hover {
        background-color: #1b5e20;
      }

      .error-message {
        color: red;
        font-size: 14px;
      }

      .login-footer {
        margin-top: 25px;
        font-size: 13px;
        color: #777;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (response.ok && data.status === true) {
        login(data.token || 'dummy-token', data.role || role);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
          </select>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <div className="login-footer">
          <p>© 2025 Your Company</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
