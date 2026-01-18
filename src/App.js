import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
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
      // In a real app, you would fetch user info from the backend using the token
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
    return <div className="app-loading">Загрузка...</div>;
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Observer Frontend</h1>
        <button onClick={handleLogout} className="logout-button">
          Выход
        </button>
      </header>
      
      <main className="app-main">
        <div className="auth-success">
          <h2>✓ Вы авторизованы</h2>
          <p>Добро пожаловать в Observer!</p>
          {user && user.token && (
            <p className="token-info">Token сохранен в localStorage</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
