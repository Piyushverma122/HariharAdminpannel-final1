import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  authToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Crucial for initial state

  // Effect to load auth token from localStorage on initial mount
  useEffect(() => {
    console.log("AuthContext: useEffect [initial load] - Checking localStorage...");
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      setAuthToken(storedToken);
      setIsLoggedIn(true);
      console.log("AuthContext: useEffect [initial load] - Found token. isLoggedIn: true");
    } else {
      setIsLoggedIn(false);
      console.log("AuthContext: useEffect [initial load] - No token found. isLoggedIn: false");
    }
    setLoading(false); // Authentication state has been determined
    console.log("AuthContext: useEffect [initial load] - Loading complete. loading: false");
  }, []); // Runs only once on mount

  // Login function - receives the token from your login API call (or dummy token)
  const login = useCallback((token: string) => {
    console.log("AuthContext: login() called.");
    localStorage.setItem('authToken', token); // Store the token
    setAuthToken(token);
    setIsLoggedIn(true); // Set logged in state
    console.log("AuthContext: login() - Token set, isLoggedIn: true");
  }, []);

  // Logout function
  const logout = useCallback(() => {
    console.log("AuthContext: logout() called.");
    localStorage.removeItem('authToken'); // Remove the token
    setAuthToken(null);
    setIsLoggedIn(false); // Set logged out state
    console.log("AuthContext: logout() - Token removed, isLoggedIn: false");
  }, []);

  // Render "Loading..." until the authentication state is determined
  if (loading) {
    console.log("AuthContext: Rendering 'Loading...' because loading is true.");
    return <div>Loading authentication...</div>;
  }

  // Render children once loading is complete
  console.log("AuthContext: Rendering children. isLoggedIn:", isLoggedIn, "authToken:", authToken);
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    