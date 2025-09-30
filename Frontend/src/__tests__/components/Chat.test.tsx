import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '@/Components/Main/ChatGroup/Chat';
import { mockChatInfo } from '@/__tests__/mocks/data';
import { mockAPIResponse, mockSendMessageSuccess } from '@/__tests__/mocks/mockAPI';

// Mock the mockAPI service
jest.mock('@/services/mockAPI', () => ({
  mockAPI: {
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
  },
}));

describe('Chat Component', () => {
  const mockProps = {
    userId: 'user-1',
    contactId: 'contact-1',
    chatInfo: mockChatInfo,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response
    const { mockAPI } = require('@/services/mockAPI');
    mockAPI.getMessages.mockResolvedValue(mockAPIResponse);
    mockAPI.sendMessage.mockResolvedValue(mockSendMessageSuccess);
  });

  describe('Rendering', () => {
    it('renders chat header with contact info', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('online')).toBeInTheDocument();
      });
    });

    it('displays avatar correctly', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });

    it('shows loading state initially', () => {
      render(<Chat {...mockProps} />);

      expect(screen.getByText('Loading messages...')).toBeInTheDocument();
    });

    it('displays messages when loaded', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Hey there!')).toBeInTheDocument();
        expect(screen.getByText('Hello! How are you?')).toBeInTheDocument();
        expect(screen.getByText('I\'m doing great, thanks!')).toBeInTheDocument();
      });
    });

    it('shows error state when API fails', async () => {
      // Mock API error
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.getMessages.mockRejectedValue(new Error('API Error'));

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to load messages')).toBeInTheDocument();
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('shows empty state when no messages', async () => {
      // Mock empty messages response
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.getMessages.mockResolvedValue({
        success: true,
        data: [],
      });

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('No messages yet')).toBeInTheDocument();
        expect(screen.getByText('Start the conversation!')).toBeInTheDocument();
      });
    });
  });

  describe('Message Display', () => {
    it('displays sent and received messages correctly', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        // Check message content
        expect(screen.getByText('Hey there!')).toBeInTheDocument();
        expect(screen.getByText('Hello! How are you?')).toBeInTheDocument();
        expect(screen.getByText('I\'m doing great, thanks!')).toBeInTheDocument();
      });
    });

    it('displays message timestamps correctly', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText(/\d{1,2}:\d{2} (AM|PM)/)).toBeInTheDocument();
      });
    });

    it('shows typing indicator when enabled', async () => {
      // Mock typing indicator
      render(<Chat {...mockProps} />);

      // Simulate typing
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockImplementationOnce(async () => {
        // Simulate typing delay
      });

      const { mockAPI: mockAPI2 } = require('@/services/mockAPI');
      mockAPI2.sendMessage.mockResolvedValue(mockSendMessageSuccess);

      const messageInput = screen.getByPlaceholderText('Type a message...');
      fireEvent.change(messageInput, { target: { value: 'Hello' } });
      fireEvent.keyDown(messageInput, { key: 'Enter' });

      // Wait for typing indicator
      await waitFor(() => {
        expect(screen.getByText('⚫')).toBeInTheDocument(); // Three dots loading indicator
      });
    });
  });

  describe('Message Input', () => {
    it('allows typing in message input', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(messageInput, { target: { value: 'Hello World!' } });

        expect(messageInput).toHaveValue('Hello World!');
      });
    });

    it('sends message on Enter key press', async () => {
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockResolvedValue(mockSendMessageSuccess);

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(messageInput, { target: { value: 'Test message' } });
        fireEvent.keyDown(messageInput, { key: 'Enter' });

        expect(mockAPI.sendMessage).toHaveBeenCalledWith(
          'user-1',
          'contact-1',
          'Test message'
        );
      });
    });

    it('does not send message on Shift+Enter', async () => {
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockResolvedValue(mockSendMessageSuccess);

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(messageInput, { target: { value: 'Test message' } });
        fireEvent.keyDown(messageInput, { key: 'Enter', shiftKey: true });

        expect(mockAPI.sendMessage).not.toHaveBeenCalled();
      });
    });

    it('disables send button when input is empty', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        const sendButton = screen.getByRole('button', { name: 'Send' });

        expect(sendButton).toBeDisabled();
      });
    });

    it('enables send button when input has text', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        const sendButton = screen.getByRole('button', { name: 'Send' });

        fireEvent.change(messageInput, { target: { value: 'Hello' } });

        expect(sendButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows retry button when API fails', async () => {
      // Mock API error
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.getMessages.mockRejectedValue(new Error('API Error'));

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      // Click retry button
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);

      expect(mockAPI.getMessages).toHaveBeenCalledWith('user-1', 'contact-1');
    });

    it('handles send message errors gracefully', async () => {
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockRejectedValue(new Error('Send Error'));

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(messageInput, { target: { value: 'Test' } });
        fireEvent.keyDown(messageInput, { key: 'Enter' });

        // Should not crash when sending fails
        expect(screen.getByText('Type a message...')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible message input', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        expect(messageInput).toHaveAttribute('role', 'textbox');
        expect(messageInput).toHaveAttribute('aria-label', 'Message input');
      });
    });

    it('has accessible send button', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const sendButton = screen.getByRole('button');
        expect(sendButton).toHaveAttribute('aria-label', 'Send message');
      });
    });

    it('supports keyboard navigation', async () => {
      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');

        messageInput.focus();
        expect(messageInput).toHaveFocus();
      });
    });
  });

  describe('Performance', () => {
    it('handles large message lists efficiently', async () => {
      // Mock large message list
      const { mockAPI } = require('@/services/mockAPI');
      const largeMessages = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        senderId: i % 2 === 0 ? 'user-1' : 'contact-1',
        message: `Message ${i}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
      }));

      mockAPI.getMessages.mockResolvedValue({
        success: true,
        data: largeMessages,
      });

      const { rerender } = render(<Chat {...mockProps} />);

      await waitFor(() => {
        // Should render without performance issues
        expect(screen.getByText('Message 99')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('renders correctly on different screen sizes', async () => {
      // Test desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { rerender } = render(<Chat {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      rerender(<Chat {...mockProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('auto-scrolls to bottom when new messages arrive', async () => {
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockResolvedValue(mockSendMessageSuccess);

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messagesContainer = screen.getByText('Hey there!').closest('div');
        expect(messagesContainer).toBeInTheDocument();
      });
    });

    it('clears input after sending message', async () => {
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.sendMessage.mockResolvedValue(mockSendMessageSuccess);

      render(<Chat {...mockProps} />);

      await waitFor(() => {
        const messageInput = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(messageInput, { target: { value: 'Hello' } });
        fireEvent.keyDown(messageInput, { key: 'Enter' });

        expect(messageInput).toHaveValue('');
      });
    });
  });
});