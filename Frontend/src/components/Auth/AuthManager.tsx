import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types/chat';
import { mockChatApi } from '../../services/mockChatApi';
import AuthLogin from './AuthLogin';
import AuthRegister from './AuthRegister';

interface AuthManagerProps {
  onAuthenticated: (user: AuthUser) => void;
}

const AuthManager: React.FC<AuthManagerProps> = ({ onAuthenticated }) => {
  const [authState, setAuthState] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage or existing session)
    const checkExistingSession = async () => {
      try {
        const response = await mockChatApi.getCurrentUser();
        if (response.success && response.data) {
          onAuthenticated(response.data);
        }
      } catch (error) {
        // No existing session, proceed with authentication
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, [onAuthenticated]);

  const handleLogin = (user: AuthUser) => {
    onAuthenticated(user);
  };

  const handleRegister = (user: AuthUser) => {
    onAuthenticated(user);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authState === 'login' ? (
          <AuthLogin
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthState('register')}
          />
        ) : (
          <AuthRegister
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthState('login')}
          />
        )}
      </div>
    </div>
  );
};

export default AuthManager;