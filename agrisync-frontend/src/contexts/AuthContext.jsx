import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  const performLogout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Navigation will be handled by RouterContext based on user state change
  }, []);

  const fetchUserDetails = useCallback(async (token) => {
    // Enhanced token validation
    if (!token || typeof token !== 'string') {
      console.warn("AuthContext: Invalid or missing token. Performing logout.");
      performLogout();
      setLoading(false);
      return;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn("AuthContext: Malformed JWT token. Performing logout.");
      performLogout();
      setLoading(false);
      return;
    }

    try {
      const payloadBase64 = tokenParts[1];
      
      // Add padding if needed for base64 decoding
      const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
      
      const decodedToken = JSON.parse(atob(paddedPayload));
      
      // Check if token is expired
      if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
        console.warn("AuthContext: Token expired. Performing logout.");
        performLogout();
        setLoading(false);
        return;
      }
      
      setUser({ 
        id: decodedToken.user_id, 
        username: decodedToken.username, 
        role: decodedToken.role || 'worker'
      });
    } catch (error) {
      console.error("AuthContext: Failed to decode token. Performing logout.", error);
      performLogout();
    } finally {
      setLoading(false);
    }
  }, [performLogout]);

  useEffect(() => {
    // Listen for custom logout event (e.g., from apiClient interceptor)
    const handleExternalLogout = () => {
        console.log("AuthContext: Received auth-logout-event. Performing logout.");
        performLogout();
    };
    window.addEventListener('auth-logout-event', handleExternalLogout);

    const currentAccessToken = localStorage.getItem('accessToken');
    if (currentAccessToken) {
      setAccessToken(currentAccessToken);
      fetchUserDetails(currentAccessToken);
    } else {
      performLogout(); // Ensure state is clean if no token
      setLoading(false);
    }
    return () => {
        window.removeEventListener('auth-logout-event', handleExternalLogout);
    };
  }, [fetchUserDetails, performLogout]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setAccessToken(access);
      setRefreshToken(refresh);
      await fetchUserDetails(access); // This will also setLoading(false)
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await apiClient.post('/auth/register/', userData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setLoading(false);
      return { success: false, errors: error.response?.data || { detail: 'An unknown error occurred.' } };
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout: performLogout, register, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;