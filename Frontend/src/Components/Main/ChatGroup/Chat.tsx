import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { ChatInfo, ChatMessage } from '@/types/chat';
import { mockAPI } from '@/services/mockAPI';

interface ChatProps {
  userId: string;
  contactId: string;
  chatInfo: ChatInfo;
}

const Chat: React.FC<ChatProps> = ({ userId, contactId, chatInfo }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [userId, contactId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await mockAPI.getMessages(userId, contactId);
      if (response.success) {
        const formattedMessages = response.data.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          message: msg.message,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      } else {
        setError('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    try {
      const response = await mockAPI.sendMessage(userId, contactId, messageToSend);
      if (response.success) {
        const newMsg: ChatMessage = {
          id: response.data.id,
          senderId: userId,
          message: messageToSend,
          timestamp: new Date(response.data.timestamp),
        };
        setMessages(prev => [...prev, newMsg]);
        simulateTyping();
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

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

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="text-2xl text-muted-foreground">⚠️</div>
          <div className="text-sm text-muted-foreground">{error}</div>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const messagesByDate = getMessagesByDate();
  const dateKeys = Object.keys(messagesByDate);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b bg-card">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-primary">
            {chatInfo.avatar}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {chatInfo.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {chatInfo.type === 'personal' && chatInfo.isOnline
              ? 'online'
              : chatInfo.type === 'group' && chatInfo.members
              ? `${chatInfo.members} members`
              : 'offline'}
          </p>
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
                    message.senderId === userId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === userId
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <div className={`text-xs mt-1 ${
                      message.senderId === userId
                        ? 'text-primary-foreground/80 text-right'
                        : 'text-muted-foreground text-left'
                    }`}>
                      {formatTime(message.timestamp)}
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

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;