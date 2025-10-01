import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, Smile, MoreHorizontal, Phone, Video, UserPlus } from 'lucide-react';
import { ChatInfo, ChatMessage, AuthUser, TypingIndicator } from '@/types/chat';
import { mockChatApi } from '../../services/mockChatApi';
import { useRealtimeMessages, useTypingIndicators } from '../RealtimeHooks';

interface EnhancedChatProps {
  user?: AuthUser;
  chatInfo: ChatInfo;
  onBack?: () => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({ user, chatInfo, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { typingUsers, sendTypingIndicator } = useTypingIndicators(chatInfo.id);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await mockChatApi.getMessages(chatInfo.id);
        if (response.success) {
          setMessages(response.data || []);
        } else {
          setError('Failed to load messages');
        }
      } catch (error) {
        setError('Error loading messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [chatInfo.id]);

  // Handle real-time messages
  useRealtimeMessages((newMessage) => {
    if (newMessage.senderId !== user?.id) {
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      const response = await mockChatApi.sendMessage(chatInfo.id, messageToSend);
      if (response.success) {
        setMessages(prev => [...prev, response.data!]);
        setIsTyping(false);
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      setError('Error sending message');
    }
  };

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNewMessage(text);

    if (text.trim()) {
      sendTypingIndicator(true);
      clearTimeout((window as any).typingTimer);
      (window as any).typingTimer = setTimeout(() => {
        sendTypingIndicator(false);
      }, 1000);
    } else {
      sendTypingIndicator(false);
    }
  }, [sendTypingIndicator]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const getMessagesByDate = () => {
    const messagesByDate: { [key: string]: ChatMessage[] } = {};

    messages.forEach(message => {
      const dateKey = formatMessageDate(message.timestamp);
      if (!messagesByDate[dateKey]) {
        messagesByDate[dateKey] = [];
      }
      messagesByDate[dateKey].push(message);
    });

    return messagesByDate;
  };

  const messagesByDate = getMessagesByDate();
  const dateKeys = Object.keys(messagesByDate);

  const getStatusEmoji = (status?: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓👁️';
      case 'failed': return '❌';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Enhanced Chat Header */}
      <div className="flex items-center p-4 border-b bg-card">
        <button
          onClick={onBack}
          className="lg:hidden mr-3 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinecap="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-primary">
            {chatInfo.avatar}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {chatInfo.name}
            </h3>
            {chatInfo.type === 'group' && chatInfo.members && (
              <span className="text-xs text-muted-foreground">
                {chatInfo.members} members
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {typingUsers.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {typingUsers.map(id => 'Someone').join(', ')} is typing...
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {chatInfo.type === 'personal' && chatInfo.isOnline
                  ? 'online'
                  : chatInfo.type === 'group' && chatInfo.members
                  ? `${chatInfo.members} members`
                  : 'offline'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <UserPlus className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {dateKeys.map(dateKey => (
          <div key={dateKey} className="text-center">
            <div className="text-xs text-muted-foreground font-medium px-2 mb-3">
              {dateKey}
            </div>
            <div className="space-y-2">
              {messagesByDate[dateKey].map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.senderId === user?.id
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm mb-1">{message.message}</p>
                    <div className={`text-xs ${
                      message.senderId === user?.id
                        ? 'text-primary-foreground/80 text-right'
                        : 'text-muted-foreground text-left'
                    }`}>
                      {formatTime(message.timestamp)}
                      {message.senderId === user?.id && (
                        <span className="ml-1">{getStatusEmoji(message.status)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-4xl mb-4 text-muted-foreground">💬</div>
            <h4 className="font-medium text-foreground mb-1">No messages yet</h4>
            <p className="text-sm text-muted-foreground">
              Start the conversation!
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              disabled={isTyping}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !user}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChat;