import React, { useState } from 'react';
import { MessageSquare, BookOpen, Code, Users } from 'lucide-react';
import AuthManager from './components/Auth/AuthManager';
import WhatsAppInterface from './Components/Main/WhatsAppInterface';
import SwaggerUI from './components/SwaggerUI';
import './App.css';

const DemoApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'chat' | 'swagger'>('auth');
  const [user, setUser] = useState<any>(null);

  const handleAuthenticated = (authUser: any) => {
    setUser(authUser);
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
  };

  const handleShowSwagger = () => {
    setCurrentView('swagger');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 bg-card border-b">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold">WhatsApp Clone Demo</h1>
      </div>

      {currentView === 'chat' && user && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.avatar}
            </div>
            <span className="text-sm font-medium">{user.username}</span>
          </div>
          <button
            onClick={handleShowSwagger}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>API Docs</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      )}

      {currentView === 'swagger' && (
        <button
          onClick={handleBackToChat}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Back to Chat</span>
        </button>
      )}
    </div>
  );

  const renderDemoInfo = () => {
    if (currentView === 'chat') {
      return (
        <div className="flex items-center space-x-4 p-4 bg-blue-50 border-b">
          <div className="flex items-center space-x-2 text-blue-700">
            <Users className="w-5 h-5" />
            <span className="font-medium">Features Demo:</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-blue-600">
            <span>✅ Authentication</span>
            <span>✅ Real-time Updates</span>
            <span>✅ Group Chats</span>
            <span>✅ Message Status</span>
            <span>✅ Typing Indicators</span>
          </div>
        </div>
      );
    }

    if (currentView === 'swagger') {
      return (
        <div className="flex items-center space-x-4 p-4 bg-green-50 border-b">
          <div className="flex items-center space-x-2 text-green-700">
            <Code className="w-5 h-5" />
            <span className="font-medium">Interactive API Documentation</span>
          </div>
          <div className="text-sm text-green-600">
            Explore and test all API endpoints with Swagger UI
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'auth' && renderHeader()}
      {currentView !== 'auth' && renderDemoInfo()}

      <div className="container mx-auto px-4 py-6">
        {currentView === 'auth' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">WhatsApp Clone Demo</h2>
              <p className="text-gray-600 mb-6">
                Experience a modern WhatsApp-inspired chat application with authentication,
                real-time messaging, and comprehensive API documentation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-sm text-gray-600">Secure login and registration with JWT tokens</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Chat</h3>
                  <p className="text-sm text-gray-600">Live messaging with typing indicators and status</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">API Documentation</h3>
                  <p className="text-sm text-gray-600">Interactive Swagger docs with all endpoints</p>
                </div>
              </div>
            </div>
            <AuthManager onAuthenticated={handleAuthenticated} />
          </div>
        )}

        {currentView === 'chat' && <WhatsAppInterface user={user} />}
        {currentView === 'swagger' && <SwaggerUI />}
      </div>
    </div>
  );
};

export default DemoApp;