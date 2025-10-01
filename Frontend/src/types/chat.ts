export type ChatType = 'personal' | 'group' | 'channel';

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: Reaction[];
  attachments?: Attachment[];
}

export interface MessageStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  readBy?: string[];
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  chatId: string;
  isTyping: boolean;
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
  user?: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JWTToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface MessageRequest {
  chatId: string;
  message: string;
  attachments?: Attachment[];
}

export interface SearchQuery {
  query: string;
  type?: 'chats' | 'messages' | 'contacts';
  limit?: number;
}