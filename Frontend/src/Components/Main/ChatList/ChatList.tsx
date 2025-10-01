import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Phone, Camera, Plus, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatListProps, ChatInfo, ChatType } from '@/types/chat';
import mockChatApi from '../../services/mockChatApi';

interface EnhancedChatListProps extends ChatListProps {
  chats?: ChatInfo[];
  onChatUpdate?: (chats: ChatInfo[]) => void;
}

const ChatList: React.FC<EnhancedChatListProps> = ({
  onSelectChat,
  chats: propChats,
  onChatUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatData, setChatData] = useState<ChatInfo[]>(propChats || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load chat data
  const loadChatData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (searchQuery.trim()) {
        const filteredChats = await mockChatApi.searchChats(searchQuery);
        setChatData(filteredChats);
        onChatUpdate?.(filteredChats);
      } else {
        const allChats = await mockChatApi.getChats();
        setChatData(allChats);
        onChatUpdate?.(allChats);
      }
    } catch (err) {
      setError('Failed to load chats');
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, onChatUpdate]);

  // Initial load
  useEffect(() => {
    if (!propChats) {
      loadChatData();
    } else {
      setChatData(propChats);
      setLoading(false);
    }
  }, [propChats, loadChatData]);

  // Real-time updates
  useEffect(() => {
    const unsubscribe = mockChatApi.subscribeToUpdates((updatedChats) => {
      if (!searchQuery.trim()) {
        setChatData(updatedChats);
        onChatUpdate?.(updatedChats);
      }
    });

    return () => unsubscribe();
  }, [searchQuery, onChatUpdate]);

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadChatData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, loadChatData]);

  // Use filtered data from API, no need for client-side filtering
  const totalUnread = chatData.filter(chat => chat.unread > 0).length;

  const renderChatItem = (chat: ChatInfo) => (
    <div
      key={chat.id}
      className="flex items-center p-4 hover:bg-muted cursor-pointer transition-colors"
      onClick={() => onSelectChat(chat)}
    >
      <div className="relative mr-3">
        <Avatar className="w-13 h-13">
          <AvatarFallback>{chat.avatar}</AvatarFallback>
        </Avatar>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
        {chat.type === 'group' && chat.members && (
          <div className="absolute -top-1 -right-1 bg-muted-foreground text-muted-foreground-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
            {chat.members}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-sm text-foreground truncate">{chat.name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
        </div>

        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-medium rounded-full px-2 py-0.5 min-w-5 text-center">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (icon: React.ReactNode, title: string, subtitle: string) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-6xl mb-4 text-muted-foreground">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Loading chats...</h3>
      <p className="text-sm text-muted-foreground">Please wait while we fetch your conversations</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="text-6xl mb-4 text-muted-foreground">❌</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Error loading chats</h3>
      <p className="text-sm text-muted-foreground mb-4">{error}</p>
      <button
        onClick={loadChatData}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-around bg-background border-b">
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Chats</span>
            {totalUnread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium rounded-full px-1.5 py-0.5">
                {totalUnread}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Calls</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span>Status</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-4">
              {renderLoadingState()}
            </div>
          ) : error ? (
            <div className="p-4">
              {renderErrorState()}
            </div>
          ) : chatData.length > 0 ? (
            <div className="divide-y">
              {chatData.map(renderChatItem)}
            </div>
          ) : (
            <div className="p-4">
              {renderEmptyState(
                <Search className="w-12 h-12" />,
                "No chats found",
                "Try adjusting your search or start a new conversation"
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calls" className="flex-1 overflow-auto">
          <div className="p-4">
            {renderEmptyState(
              <Phone className="w-12 h-12" />,
              "No calls",
              "Your calls will appear here"
            )}
          </div>
        </TabsContent>

        <TabsContent value="status" className="flex-1 overflow-auto">
          <div className="p-4">
            {renderEmptyState(
              <Camera className="w-12 h-12" />,
              "No status updates",
              "Your friends' status will appear here"
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatList;