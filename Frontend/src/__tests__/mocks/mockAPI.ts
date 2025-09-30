import { ChatMessage } from '@/types/chat';

import { jest } from '@jest/globals';

// Mock API responses
export const mockAPIResponse = {
  getMessages: jest.fn(),
  sendMessage: jest.fn(),
};

export const mockMessagesSuccess = {
  success: true,
  data: [
    {
      id: '1',
      senderId: 'user-1',
      message: 'Hey there!',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      senderId: 'contact-1',
      message: 'Hello! How are you?',
      timestamp: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: '3',
      senderId: 'user-1',
      message: 'I\'m doing great, thanks!',
      timestamp: new Date(Date.now() - 30000).toISOString(),
    },
  ],
};

export const mockSendMessageSuccess = {
  success: true,
  data: {
    id: '4',
    senderId: 'user-1',
    message: 'New message',
    timestamp: new Date().toISOString(),
  },
};

export const mockAPIError = {
  success: false,
  error: 'Failed to fetch messages',
};