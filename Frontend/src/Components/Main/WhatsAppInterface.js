import React, { useState } from 'react';
import ChatList from './ChatList/ChatList';
import Chat from './ChatGroup/Chat';
import './WhatsAppInterface.scss';

const WhatsAppInterface = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedChat(null);
  };

  return (
    <div className="whatsapp-interface">
      {/* Mobile Header (Chat List View) */}
      {mobileView === 'list' && (
        <div className="mobile-header">
          <div className="header-left">
            <span className="menu-icon">☰</span>
            <h1 className="app-title">WhatsApp</h1>
          </div>
          <div className="header-right">
            <span className="icon-button">🔍</span>
            <span className="icon-button">📱</span>
            <span className="icon-button">⋯</span>
          </div>
        </div>
      )}

      {/* Mobile Header (Chat View) */}
      {mobileView === 'chat' && selectedChat && (
        <div className="mobile-header-chat">
          <div className="chat-header-left">
            <button
              className="back-button"
              onClick={handleBackToList}
            >
              ←
            </button>
            <div className="chat-avatar">
              <span>{selectedChat.avatar}</span>
            </div>
            <div className="chat-info">
              <div className="chat-name">{selectedChat.name}</div>
              <div className="chat-status">
                {selectedChat.type === 'personal' && selectedChat.isOnline && 'online'}
                {selectedChat.type === 'group' && `${selectedChat.members} members`}
              </div>
            </div>
          </div>
          <div className="chat-header-right">
            <span className="icon-button">📞</span>
            <span className="icon-button">🎵</span>
            <span className="icon-button">⋯</span>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="desktop-layout">
        {/* Chat List Panel */}
        <div className="chat-list-panel">
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {selectedChat ? (
            <Chat
              userId={userId}
              contactId={selectedChat.id}
              chatInfo={selectedChat}
            />
          ) : (
            <div className="welcome-screen">
              <div className="welcome-icon">💬</div>
              <h2>WhatsApp</h2>
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {mobileView === 'list' && (
          <div className="mobile-chat-list">
            <ChatList onSelectChat={handleSelectChat} />
          </div>
        )}

        {mobileView === 'chat' && selectedChat && (
          <div className="mobile-chat-view">
            <div className="mobile-chat-container">
              {selectedChat.type === 'personal' ? (
                <Chat
                  userId={userId}
                  contactId={selectedChat.id}
                  chatInfo={selectedChat}
                />
              ) : (
                <div className="group-chat-placeholder">
                  <div className="placeholder-header">
                    <div className="placeholder-avatar">
                      <span>{selectedChat.avatar}</span>
                    </div>
                    <div className="placeholder-info">
                      <h3>{selectedChat.name}</h3>
                      <p>{selectedChat.members} members</p>
                    </div>
                  </div>
                  <div className="placeholder-content">
                    <p>Group chat features coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppInterface;