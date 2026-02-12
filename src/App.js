import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { handleGoogleCallback, isAuthenticated, getAuthToken, clearAuthToken } from './api/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle OAuth callback on app load
    const token = handleGoogleCallback();

    // Check if user is already authenticated
    if (token || isAuthenticated()) {
      setIsLoggedIn(true);
      setUser({ token: getAuthToken() });
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <span>Initializing...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <Dashboard user={user} onLogout={handleLogout} />
  );
}

export default App;
