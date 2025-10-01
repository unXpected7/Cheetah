import React, { useState, useEffect } from 'react';
import { ChevronLeft, Phone, MoreHorizontal, Search, Phone as PhoneIcon } from 'lucide-react';
import ChatList from './ChatList/ChatList';
import EnhancedChat from './EnhancedChat';
import Top from './TopBar';
import { WhatsAppInterfaceProps, ChatInfo, AuthUser } from '@/types/chat';
import { mockChatApi } from '@/services/mockChatApi';
import { useRealtimeUpdates } from '@/components/RealtimeHooks';

const WhatsAppInterfaceEnhanced: React.FC<WhatsAppInterfaceProps> = ({ user }) => {
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time updates for chats
  useRealtimeUpdates((updatedChats) => {
    setChats(updatedChats);
  });

  // Load chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const response = await mockChatApi.getChats();
        if (response.success) {
          setChats(response.data || []);
        } else {
          setError(response.error || 'Failed to load chats');
        }
      } catch (error) {
        setError('Error loading chats');
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleSelectChat = (chat: ChatInfo) => {
    setSelectedChat(chat);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedChat(null);
  };

  const handleChatUpdate = (updatedChats: ChatInfo[]) => {
    setChats(updatedChats);
    // If the selected chat was updated, update it in the state
    if (selectedChat) {
      const updatedChat = updatedChats.find(c => c.id === selectedChat.id);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  };

  const renderChatPlaceholder = () => (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-6xl mb-4 text-muted-foreground">💬</div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">WhatsApp</h2>
        <p className="text-muted-foreground">Select a chat to start messaging</p>
        {user && (
          <p className="text-sm text-muted-foreground mt-2">
            Welcome, {user.username}!
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation Bar */}
      <Top user={user} onLogout={() => {}} />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Chat List Panel */}
        <div className="w-96 border-r bg-card">
          <ChatList
            onSelectChat={handleSelectChat}
            chats={chats}
            onChatUpdate={handleChatUpdate}
          />
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <EnhancedChat
              user={user}
              chatInfo={selectedChat}
              onBack={handleBackToList}
            />
          ) : (
            renderChatPlaceholder()
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {mobileView === 'list' && (
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <Top user={user} onLogout={() => {}} />

            {/* Chat List */}
            <div className="flex-1 overflow-auto bg-card">
              <ChatList
                onSelectChat={handleSelectChat}
                chats={chats}
                onChatUpdate={handleChatUpdate}
              />
            </div>
          </div>
        )}

        {mobileView === 'chat' && selectedChat && (
          <div className="h-full flex flex-col bg-background">
            {/* Mobile Chat Header */}
            <Top user={user} onLogout={() => {}} />

            {/* Chat Content */}
            <div className="flex-1">
              <EnhancedChat
                user={user}
                chatInfo={selectedChat}
                onBack={handleBackToList}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppInterfaceEnhanced;