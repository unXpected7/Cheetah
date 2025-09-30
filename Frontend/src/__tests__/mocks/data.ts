import { ChatInfo, ChatType } from '@/types/chat';

export const mockChatData: ChatInfo[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '2:30 PM',
    unread: 2,
    isOnline: true,
    avatar: 'JD',
    type: 'personal' as ChatType,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    time: '1:45 PM',
    unread: 0,
    isOnline: true,
    avatar: 'JS',
    type: 'personal' as ChatType,
  },
  {
    id: '3',
    name: 'Work Group',
    lastMessage: 'Mike: Meeting at 3 PM',
    time: '12:30 PM',
    unread: 5,
    isOnline: false,
    avatar: 'WG',
    type: 'group' as ChatType,
    members: 8,
  },
  {
    id: '4',
    name: 'Family',
    lastMessage: 'Mom: Dinner at 7?',
    time: '11:20 AM',
    unread: 1,
    isOnline: false,
    avatar: 'F',
    type: 'group' as ChatType,
    members: 6,
  },
  {
    id: '5',
    name: 'Alex Johnson',
    lastMessage: 'Thanks for your help!',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
    avatar: 'AJ',
    type: 'personal' as ChatType,
  },
  {
    id: '6',
    name: 'Project Channel',
    lastMessage: 'Sarah: New feature deployed',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
    avatar: 'PC',
    type: 'channel' as ChatType,
    members: 12,
  },
  {
    id: '7',
    name: 'Tech Team',
    lastMessage: 'David: Bug fix completed',
    time: '2 days ago',
    unread: 0,
    isOnline: true,
    avatar: 'TT',
    type: 'channel' as ChatType,
    members: 15,
  },
  {
    id: '8',
    name: 'Emily Wilson',
    lastMessage: 'Call me when you\'re free',
    time: '2 days ago',
    unread: 0,
    isOnline: false,
    avatar: 'EW',
    type: 'personal' as ChatType,
  },
];

export const mockFilteredChats = mockChatData.filter(chat =>
  chat.name.toLowerCase().includes('john')
);

export const mockUser = {
  id: 'user-1',
  name: 'Test User',
};

export const mockChatInfo: ChatInfo = {
  id: '1',
  name: 'John Doe',
  lastMessage: 'Hey, how are you doing?',
  time: '2:30 PM',
  unread: 2,
  isOnline: true,
  avatar: 'JD',
  type: 'personal' as ChatType,
};