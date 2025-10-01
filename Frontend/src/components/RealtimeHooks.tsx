import { useState, useEffect, useRef, useCallback } from 'react';
import { mockChatApi } from '../services/mockChatApi';
import { ChatInfo, ChatMessage, TypingIndicator } from '../types/chat';

export const useRealtimeUpdates = (onUpdate?: (chats: ChatInfo[]) => void) => {
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    if (onUpdate) {
      unsubscribeRef.current = mockChatApi.subscribeToUpdates(onUpdate);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [onUpdate]);

  return unsubscribeRef.current;
};

export const useRealtimeMessages = (onNewMessage?: (message: ChatMessage) => void) => {
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    if (onNewMessage) {
      unsubscribeRef.current = mockChatApi.subscribeToMessages(onNewMessage);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [onNewMessage]);

  return unsubscribeRef.current;
};

export const useTypingIndicators = (chatId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const indicators = mockChatApi.getTypingIndicators(chatId);
    const userIds = indicators.map(indicator => indicator.userId);
    setTypingUsers(userIds);

    // Clean up typing indicators after a delay
    const interval = setInterval(() => {
      setTypingUsers(prev => prev.filter(userId => {
        const indicator = mockChatApi.getTypingIndicators(chatId)
          .find(ind => ind.userId === userId);
        return indicator?.isTyping;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId]);

  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    await mockChatApi.sendTypingIndicator(chatId, isTyping);
  }, [chatId]);

  return { typingUsers, sendTypingIndicator };
};

export const useRealtimeSearch = (query: string, onResults?: (results: ChatInfo[]) => void) => {
  useEffect(() => {
    if (!query.trim()) {
      onResults?.([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await mockChatApi.searchChats(query);
        if (response.success) {
          onResults?.(response.data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        onResults?.([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onResults]);

  return { search: query };
};