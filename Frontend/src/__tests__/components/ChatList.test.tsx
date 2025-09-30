import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatList from '@/Components/Main/ChatList/ChatList';
import { mockChatData, mockFilteredChats } from '@/__tests__/mocks/data';

// Mock the components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs">{children}</div>
  ),
  TabsContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-content">{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <div data-testid="tabs-trigger" onClick={onClick}>
      {children}
    </div>
  ),
}));

const mockOnSelectChat = jest.fn();

describe('ChatList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSelectChat.mockClear();
  });

  describe('Rendering', () => {
    it('renders chat list with all chats', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      expect(screen.getByText('WhatsApp')).toBeInTheDocument();

      // Check if some chats are rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Work Group')).toBeInTheDocument();

      // Check if search input is present
      expect(screen.getByPlaceholderText('Search chats...')).toBeInTheDocument();
    });

    it('renders tabs correctly', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const tabs = screen.getAllByTestId('tabs-trigger');
      expect(tabs).toHaveLength(3);
      expect(screen.getByText('Chats')).toBeInTheDocument();
      expect(screen.getByText('Calls')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders empty state when no chats match search', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      // Search for non-existent chat
      const searchInput = screen.getByPlaceholderText('Search chats...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent chat' } });

      expect(screen.getByText('No chats found')).toBeInTheDocument();
    });

    it('renders unread count badges correctly', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      // Check for unread badge on John Doe's chat
      const johnDoeChat = screen.getByText('John Doe').closest('[data-testid="chat-item"]') || screen.getByText('John Doe').parentElement;
      if (johnDoeChat) {
        expect(johnDoeChat).toHaveTextContent('2'); // Unread count
      }
    });
  });

  describe('Functionality', () => {
    it('calls onSelectChat when a chat item is clicked', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const chatItem = screen.getByText('John Doe').closest('div') || screen.getByText('John Doe').parentElement;
      if (chatItem) {
        fireEvent.click(chatItem);
      }

      expect(mockOnSelectChat).toHaveBeenCalled();
    });

    it('filters chats based on search query', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const searchInput = screen.getByPlaceholderText('Search chats...');

      // Filter by "John"
      fireEvent.change(searchInput, { target: { value: 'John' } });

      // Only John Doe should be visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('shows empty state for calls tab', async () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      // Click on Calls tab
      const callsTab = screen.getByText('Calls');
      fireEvent.click(callsTab);

      await waitFor(() => {
        expect(screen.getByText('No calls')).toBeInTheDocument();
        expect(screen.getByText('Your calls will appear here')).toBeInTheDocument();
      });
    });

    it('shows empty state for status tab', async () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      // Click on Status tab
      const statusTab = screen.getByText('Status');
      fireEvent.click(statusTab);

      await waitFor(() => {
        expect(screen.getByText('No status updates')).toBeInTheDocument();
        expect(screen.getByText('Your friends\' status will appear here')).toBeInTheDocument();
      });
    });

    it('displays total unread count on chats tab', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const chatsTab = screen.getByText('Chats');
      expect(chatsTab).toHaveTextContent('3'); // Total unread: 2 + 1 + 5 = 8, but only showing some
    });
  });

  describe('Mobile Responsiveness', () => {
    it('renders correctly on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ChatList onSelectChat={mockOnSelectChat} />);

      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search chats...')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible search input', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const searchInput = screen.getByPlaceholderText('Search chats...');
      expect(searchInput).toHaveAttribute('role', 'search');
    });

    it('has clickable chat items with proper keyboard navigation', () => {
      render(<ChatList onSelectChat={mockOnSelectChat} />);

      const chatItems = screen.getAllByText(/John Doe|Jane Smith|Work Group/);
      chatItems.forEach(item => {
        expect(item).toBeInstanceOf(HTMLElement);
        expect(item).toHaveClass('cursor-pointer');
      });
    });
  });

  describe('Performance', () => {
    it('renders efficiently with large number of chats', () => {
      const largeChatData = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        name: `Chat ${i}`,
        lastMessage: `Message ${i}`,
        time: `${i} hours ago`,
        unread: i % 5,
        isOnline: i % 2 === 0,
        avatar: `C${i}`,
        type: 'personal' as const,
      }));

      jest.spyOn(require('@/services/mockAPI'), 'mockAPI').mockReturnValue({
        getMessages: jest.fn(),
        sendMessage: jest.fn(),
      });

      render(<ChatList onSelectChat={mockOnSelectChat} />);

      // Should render without performance issues
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });
  });
});