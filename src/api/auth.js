// Authentication helper functions for Google OAuth

const API_URL = process.env.REACT_APP_API_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

/**
 * Redirect to backend Google login endpoint
 * @param {string} redirectAfter - URL to redirect after login (default: '/')
 */
export const startGoogleLogin = (redirectAfter = '/') => {
  const loginUrl = `${API_URL}/auth/google/login?redirect=${encodeURIComponent(redirectAfter)}`;
  window.location.href = loginUrl;
};

/**
 * Handle Google OAuth callback
 * Extract token from query parameters and save to localStorage
 * @returns {string|null} - Token if found, null otherwise
 */
export const handleGoogleCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  
  if (token) {
    localStorage.setItem('authToken', token);
    // Clean up URL by removing query parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }
  
  return null;
};

/**
 * Get authentication token from localStorage
 * @returns {string|null} - Token if exists, null otherwise
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Clear authentication token from localStorage
 */
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
