import React, { useState } from 'react';
import { ChevronLeft, Phone, Music, MoreHorizontal, Search, Phone as PhoneIcon } from 'lucide-react';
import ChatList from './ChatList/ChatList';
import Chat from './ChatGroup/Chat';
import { WhatsAppInterfaceProps, ChatInfo } from '@/types/chat';

const WhatsAppInterface: React.FC<WhatsAppInterfaceProps> = ({ userId }) => {
  const [selectedChat, setSelectedChat] = useState<ChatInfo | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const handleSelectChat = (chat: ChatInfo) => {
    setSelectedChat(chat);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedChat(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Chat List Panel */}
        <div className="w-96 border-r bg-card">
          <ChatList onSelectChat={handleSelectChat} />
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <Chat
              userId={userId}
              contactId={selectedChat.id}
              chatInfo={selectedChat}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 text-muted-foreground">💬</div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">WhatsApp</h2>
                <p className="text-muted-foreground">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full">
        {mobileView === 'list' && (
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <header className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">WhatsApp</h1>
                <div className="flex items-center gap-4">
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* Chat List */}
            <div className="flex-1 overflow-auto bg-card">
              <ChatList onSelectChat={handleSelectChat} />
            </div>
          </div>
        )}

        {mobileView === 'chat' && selectedChat && (
          <div className="h-full flex flex-col bg-background">
            {/* Mobile Chat Header */}
            <header className="bg-primary text-primary-foreground p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={handleBackToList}
                    className="p-1 hover:bg-primary/80 rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {selectedChat.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-sm truncate">
                      {selectedChat.name}
                    </h2>
                    <p className="text-xs text-primary/80">
                      {selectedChat.type === 'personal' && selectedChat.isOnline
                        ? 'online'
                        : selectedChat.type === 'group' && selectedChat.members
                        ? `${selectedChat.members} members`
                        : 'offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <Music className="w-5 h-5" />
                  </button>
                  <button className="p-1 hover:bg-primary/80 rounded transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* Chat Content */}
            <div className="flex-1">
              {selectedChat.type === 'personal' ? (
                <Chat
                  userId={userId}
                  contactId={selectedChat.id}
                  chatInfo={selectedChat}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4 text-muted-foreground">👥</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {selectedChat.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {selectedChat.members} members
                    </p>
                    <p className="text-muted-foreground">
                      Group chat features coming soon!
                    </p>
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