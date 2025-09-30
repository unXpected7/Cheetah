import React, { useState } from 'react';
import './ChatList.scss';

const ChatList = ({ onSelectChat }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');

  const chatData = {
    chats: [
      {
        id: 1,
        name: 'John Doe',
        lastMessage: 'Hey, how are you doing?',
        time: '2:30 PM',
        unread: 2,
        isOnline: true,
        avatar: '👤',
        type: 'personal'
      },
      {
        id: 2,
        name: 'Jane Smith',
        lastMessage: 'See you tomorrow!',
        time: '1:45 PM',
        unread: 0,
        isOnline: true,
        avatar: '👩',
        type: 'personal'
      },
      {
        id: 3,
        name: 'Work Group',
        lastMessage: 'Mike: Meeting at 3 PM',
        time: '12:30 PM',
        unread: 5,
        isOnline: false,
        avatar: '👥',
        type: 'group',
        members: 8
      },
      {
        id: 4,
        name: 'Family',
        lastMessage: 'Mom: Dinner at 7?',
        time: '11:20 AM',
        unread: 1,
        isOnline: false,
        avatar: '👨‍👩‍👧‍👦',
        type: 'group',
        members: 6
      },
      {
        id: 5,
        name: 'Alex Johnson',
        lastMessage: 'Thanks for your help!',
        time: 'Yesterday',
        unread: 0,
        isOnline: false,
        avatar: '👨',
        type: 'personal'
      },
      {
        id: 6,
        name: 'Project Channel',
        lastMessage: 'Sarah: New feature deployed',
        time: 'Yesterday',
        unread: 0,
        isOnline: false,
        avatar: '💬',
        type: 'channel',
        members: 12
      },
      {
        id: 7,
        name: 'Tech Team',
        lastMessage: 'David: Bug fix completed',
        time: '2 days ago',
        unread: 0,
        isOnline: true,
        avatar: '💻',
        type: 'channel',
        members: 15
      },
      {
        id: 8,
        name: 'Emily Wilson',
        lastMessage: 'Call me when you\'re free',
        time: '2 days ago',
        unread: 0,
        isOnline: false,
        avatar: '👩',
        type: 'personal'
      }
    ]
  };

  const filteredChats = chatData.chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return filteredChats.map(chat => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-avatar">
              <span className="avatar">{chat.avatar}</span>
              {chat.isOnline && <div className="online-indicator"></div>}
              {chat.type === 'group' && (
                <div className="group-indicator">
                  <span>{chat.members}</span>
                </div>
              )}
            </div>
            <div className="chat-content">
              <div className="chat-header">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-time">{chat.time}</div>
              </div>
              <div className="chat-info">
                <div className="last-message">{chat.lastMessage}</div>
                {chat.unread > 0 && (
                  <div className="unread-count">{chat.unread}</div>
                )}
              </div>
            </div>
          </div>
        ));

      case 'calls':
        return (
          <div className="empty-state">
            <div className="empty-icon">📞</div>
            <div className="empty-title">No calls</div>
            <div className="empty-subtitle">Your calls will appear here</div>
          </div>
        );

      case 'status':
        return (
          <div className="empty-state">
            <div className="empty-icon">📸</div>
            <div className="empty-title">No status updates</div>
            <div className="empty-subtitle">Your friends' status will appear here</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="chat-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <span className="tab-icon">💬</span>
          <span className="tab-text">Chats</span>
          <span className="tab-unread">{filteredChats.filter(chat => chat.unread > 0).length}</span>
        </div>
        <div
          className={`tab ${activeTab === 'calls' ? 'active' : ''}`}
          onClick={() => setActiveTab('calls')}
        >
          <span className="tab-icon">📞</span>
          <span className="tab-text">Calls</span>
        </div>
        <div
          className={`tab ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          <span className="tab-icon">📸</span>
          <span className="tab-text">Status</span>
        </div>
      </div>

      <div className="chats-container">
        {renderTabContent()}
      </div>

      <div className="fab">
        <span className="fab-icon">✏️</span>
      </div>
    </div>
  );
};

export default ChatList;