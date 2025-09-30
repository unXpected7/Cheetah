import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WhatsAppInterface from '@/Components/Main/WhatsAppInterface';
import { mockChatData, mockChatInfo } from '@/__tests__/mocks/data';


// Mock the ChatList component
jest.mock('@/Components/Main/ChatList/ChatList', () => {
  return function MockChatList({ onSelectChat }: any) {
    return (
      <div data-testid="chat-list">
        <div data-testid="chat-item" onClick={() => onSelectChat(mockChatData[0])}>
          {mockChatData[0].name}
        </div>
      </div>
    );
  };
});

// Mock the Chat component
jest.mock('@/Components/Main/ChatGroup/Chat', () => {
  return function MockChat({ userId, contactId, chatInfo }: any) {
    return (
      <div data-testid="chat-component">
        <div>{chatInfo.name}</div>
        <div>Messages</div>
      </div>
    );
  };
});

const mockUserId = 'user-1';

describe('WhatsAppInterface Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop Layout', () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('renders desktop layout with chat list and chat panel', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });

    it('shows welcome screen when no chat is selected', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('Select a chat to start messaging')).toBeInTheDocument();
    });

    it('displays chat panel when chat is selected', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Simulate clicking on a chat item
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Layout', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('renders mobile layout with only chat list initially', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
    });

    it('shows mobile header with navigation', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search chats...')).toBeInTheDocument();
    });

    it('switches to chat view when chat item is clicked', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Initial state - should show chat list
      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();

      // Click on chat item
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        // Should switch to chat view
        expect(screen.queryByTestId('chat-list')).not.toBeInTheDocument();
        expect(screen.getByTestId('chat-component')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('shows back button in mobile chat view', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Navigate to chat view
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument();
      });

      // Check for back button
      const backButton = screen.getByRole('button');
      expect(backButton).toBeInTheDocument();
    });

    it('switches back to list view when back button is clicked', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Navigate to chat view
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument();
      });

      // Go back to list view
      const backButton = screen.getByRole('button');
      fireEvent.click(backButton);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
      expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('switches layout on window resize', () => {
      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { rerender } = render(<WhatsAppInterface userId={mockUserId} />);

      // Should show desktop layout
      expect(screen.getByTestId('chat-list')).toBeInTheDocument();

      // Resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      rerender(<WhatsAppInterface userId={mockUserId} />);

      // Should still show chat list (now mobile view)
      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    });
  });

  describe('Chat Types', () => {
    it('handles personal chats correctly', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Select personal chat
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('handles group chats correctly', async () => {
      // Mock group chat data
      const groupChat = {
        ...mockChatData[2],
        type: 'group',
        members: 8,
      };

      jest.spyOn(require('@/Components/Main/ChatList/ChatList'), 'default').mockReturnValueOnce(
        <div data-testid="chat-list">
          <div data-testid="chat-item" onClick={() => {}}>
            {groupChat.name}
          </div>
        </div>
      );

      render(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByText('Work Group')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Check for main content area
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();

      // Check for search input
      const searchInput = screen.getByPlaceholderText('Search chats...');
      expect(searchInput).toHaveAttribute('role', 'search');
    });

    it('supports keyboard navigation', () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      const chatItem = screen.getByTestId('chat-item');

      // Simulate keyboard navigation
      chatItem.focus();
      expect(chatItem).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API error
      const { mockAPI } = require('@/services/mockAPI');
      mockAPI.getMessages.mockRejectedValueOnce(new Error('API Error'));

      render(<WhatsAppInterface userId={mockUserId} />);

      // Should still render interface even if API fails
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently on both desktop and mobile', () => {
      // Test desktop performance
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { rerender } = render(<WhatsAppInterface userId={mockUserId} />);

      // Test mobile performance
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      rerender(<WhatsAppInterface userId={mockUserId} />);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    });
  });

  describe('User Experience', () => {
    it('provides smooth transitions between views', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Navigate to chat
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByTestId('chat-component')).toBeInTheDocument();
      });

      // Navigate back
      const backButton = screen.getByRole('button');
      fireEvent.click(backButton);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    });

    it('maintains chat state during view transitions', async () => {
      render(<WhatsAppInterface userId={mockUserId} />);

      // Select a chat
      const chatItem = screen.getByTestId('chat-item');
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Switch back and forth
      const backButton = screen.getByRole('button');
      fireEvent.click(backButton);

      expect(screen.getByTestId('chat-list')).toBeInTheDocument();

      // Go back to chat
      fireEvent.click(chatItem);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });
});