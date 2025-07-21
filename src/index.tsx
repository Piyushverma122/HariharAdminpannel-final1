import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // ✅ import your AuthContext

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ wrap your app */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
