export type ChatType = 'personal' | 'group' | 'channel';

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
}

export interface ChatInfo {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline?: boolean;
  avatar: string;
  type: ChatType;
  members?: number;
}

export interface Tab {
  id: 'chats' | 'calls' | 'status';
  label: string;
  icon: string;
  badge?: number;
}

export interface ChatListProps {
  onSelectChat: (chat: ChatInfo) => void;
}

export interface WhatsAppInterfaceProps {
  userId: string;
}