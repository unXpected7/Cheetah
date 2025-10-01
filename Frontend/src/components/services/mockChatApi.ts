import { ChatInfo, ChatType, ChatMessage, AuthUser, MessageStatus, Reaction } from '@/types/chat';
import { ApiResponse, LoginRequest, RegisterRequest, JWTToken, MessageRequest, SearchQuery, TypingIndicator, WebSocketMessage } from '@/types/api';

// Mock data generator
const generateMockChatData = (): ChatInfo[] => {
  const names = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
    'Emily Davis', 'Chris Taylor', 'Lisa Anderson', 'Tom Martinez', 'Anna Garcia',
    'Robert Lee', 'Jennifer White', 'Michael Clark', 'Amanda Rodriguez', 'Daniel Harris',
    'Jessica Taylor', 'William Johnson', 'Ashley Williams', 'Christopher Brown', 'Amanda Jones',
    'Matthew Miller', 'Samantha Davis', 'Joseph Wilson', 'Sarah Moore', 'Daniel Taylor',
    'Michelle Anderson', 'James Thomas', 'Elizabeth Jackson', 'Charles White', 'Patricia Harris'
  ];

  const groupNames = [
    'Work Group', 'Family Circle', 'Project Team', 'Friends Forever', 'Book Club',
    'Gaming Squad', 'Study Group', 'Office Colleagues', 'College Buddies', 'Neighbors',
    'Team Alpha', 'Company Updates', 'Design Team', 'Marketing Group', 'Support Team',
    'Development Squad', 'Community Group', 'Volunteer Team', 'Sports Club', 'Music Lovers',
    'Foodie Friends', 'Travel Enthusiasts', 'Tech Community', 'Book Club Monthly', 'Fitness Group'
  ];

  const channelNames = [
    'General Channel', 'Announcements', 'Tech Updates', 'Marketing Team', 'Design Hub',
    'Development Channel', 'Customer Support', 'Sales Team', 'HR Updates', 'Company News',
    'Product Launch', 'Security Team', 'Innovation Lab', 'Customer Feedback', 'Performance Reports',
    'Weekly Standup', 'Code Reviews', 'Design System', 'API Documentation', 'Project Management'
  ];

  const lastMessages = [
    // Personal messages
    'Hey, how are you doing?',
    'See you tomorrow!',
    'Thanks for your help!',
    'Call me when you\'re free',
    'Let\'s catch up soon',
    'Happy birthday! 🎉',
    'Check out this article I found',
    'Are we still on for lunch?',
    'Great job on the presentation!',
    'Can you send me the files?',
    'Let\'s schedule a call',
    'The deadline is approaching',
    'Meeting rescheduled to 4 PM',
    'Thanks for the coffee yesterday!',
    'How was your weekend?',
    'Good luck with your interview!',
    'Thanks for the recommendation!',
    'Are we still meeting today?',
    'I\'ll send you the details later',
    'Congratulations on the promotion!',

    // Group messages
    'Mike: Meeting at 3 PM',
    'Sarah: Don\'t forget the deadline',
    'John: Thanks everyone for the input',
    'Lisa: I\'ve shared the documents',
    'David: The new design looks great!',
    'Emily: Let\'s move this to discussion',
    'Chris: Quick sync call in 15 min',
    'Anna: Team lunch at 1 PM',
    'Tom: The presentation is ready',
    'Robert: All systems are operational',
    'Jennifer: Happy Friday everyone!',
    'Michael: The client loved the proposal',
    'Amanda: Code review completed',
    'Daniel: Deployment successful',
    'Jessica: New features are live',

    // Channel messages
    'Sarah: New feature deployed',
    'David: Bug fix completed',
    'Mike: Security update pushed',
    'Lisa: Design system updated',
    'John: API documentation updated',
    'Emily: Performance improvements live',
    'Chris: Weekly report published',
    'Anna: New hire onboarding started',
    'Tom: Budget review meeting',
    'Robert: Q3 results are in',
    'Jennifer: Customer feedback survey',
    'Michael: Server maintenance scheduled',
    'Amanda: Marketing campaign launched',
    'Daniel: Team training session',
    'Jessica: Company announcement',
  ];

  const times = [
    '2:30 PM', '1:45 PM', '12:30 PM', '11:20 AM', '10:15 AM', '9:30 AM', '8:45 AM',
    'Yesterday', '2 days ago', '3 days ago', 'Last week', '5 days ago', '1 week ago',
    '2 weeks ago', '3 weeks ago', '1 month ago', '2 months ago', '3 months ago', '6 months ago'
  ];

  const statusMessages = [
    '🎉 Celebrating my birthday!', '📚 Reading a great book', '🏃‍♂️ Morning workout',
    '🍳 Trying a new recipe', '🎵 Working on music', '🎮 Gaming session',
    '🌅 Beautiful sunrise', '📊 Working on reports', '☕ Coffee break',
    '🌴 Beach day', '🏔️ Mountain hiking', '🎨 Working on design',
    '💻 Coding session', '🎬 Movie night', '🍕 Pizza time'
  ];

  // Generate 40 diverse chat entries (more realistic)
  const mockData: ChatInfo[] = [];

  // Personal chats (25) - more realistic personal connections
  for (let i = 0; i < 25; i++) {
    const name = names[i % names.length];
    const isOnline = Math.random() > 0.3; // More people online during work hours
    const unread = Math.random() > 0.6 ? Math.floor(Math.random() * 8) + 1 : 0;

    // More realistic time distribution for personal chats
    let time;
    const timeRand = Math.random();
    if (timeRand < 0.3) time = times[Math.floor(Math.random() * 7)]; // Today
    else if (timeRand < 0.6) time = times[Math.floor(Math.random() * 3) + 7]; // Last 3 days
    else time = times[Math.floor(Math.random() * times.length - 10) + 10]; // Older

    mockData.push({
      id: `personal-${i + 1}`,
      name,
      lastMessage: lastMessages[Math.floor(Math.random() * lastMessages.length)],
      time,
      unread,
      isOnline,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      type: 'personal' as ChatType,
    });
  }

  // Group chats (12) - realistic work and social groups
  for (let i = 0; i < 12; i++) {
    const name = groupNames[i % groupNames.length];
    const members = Math.floor(Math.random() * 30) + 5;
    const unread = Math.random() > 0.5 ? Math.floor(Math.random() * 12) + 1 : 0;

    let time;
    const timeRand = Math.random();
    if (timeRand < 0.4) time = times[Math.floor(Math.random() * 7)];
    else if (timeRand < 0.7) time = times[Math.floor(Math.random() * 3) + 7];
    else time = times[Math.floor(Math.random() * times.length - 10) + 10];

    // Ensure group messages have proper format
    const senderName = names[Math.floor(Math.random() * names.length)];
    const messageTypes = [
      `${senderName}: Meeting scheduled`,
      `${senderName}: Shared a file`,
      `${senderName}: Updated project`,
      `${senderName}: Team announcement`,
      `${senderName}: Deadline reminder`,
      `${senderName}: Great work everyone!`,
      `${senderName}: Quick question`,
    ];

    mockData.push({
      id: `group-${i + 1}`,
      name,
      lastMessage: messageTypes[Math.floor(Math.random() * messageTypes.length)],
      time,
      unread,
      isOnline: Math.random() > 0.5,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      type: 'group' as ChatType,
      members,
    });
  }

  // Channel chats (8) - professional channels
  for (let i = 0; i < 8; i++) {
    const name = channelNames[i % channelNames.length];
    const members = Math.floor(Math.random() * 100) + 20;
    const unread = Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 1 : 0;

    let time;
    const timeRand = Math.random();
    if (timeRand < 0.5) time = times[Math.floor(Math.random() * 7)];
    else if (timeRand < 0.8) time = times[Math.floor(Math.random() * 3) + 7];
    else time = times[Math.floor(Math.random() * times.length - 10) + 10];

    const senderName = names[Math.floor(Math.random() * names.length)];
    const messageTypes = [
      `${senderName}: New update available`,
      `${senderName}: Security notice`,
      `${senderName}: Documentation updated`,
      `${senderName}: Feature deployed`,
      `${senderName}: Bug fixed`,
      `${senderName}: Performance improvement`,
      `${senderName}: Team announcement`,
      `${senderName}: Project milestone`,
    ];

    mockData.push({
      id: `channel-${i + 1}`,
      name,
      lastMessage: messageTypes[Math.floor(Math.random() * messageTypes.length)],
      time,
      unread,
      isOnline: Math.random() > 0.4,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      type: 'channel' as ChatType,
      members,
    });
  }

  // Sort by unread count (high priority first) and then by time
  return mockData.sort((a, b) => {
    // Sort by unread count first (chats with unread messages appear first)
    if (a.unread !== b.unread) {
      return b.unread - a.unread;
    }

    // Then sort by time (newer chats first)
    const timePriority = {
      '2:30 PM': 1, '1:45 PM': 2, '12:30 PM': 3, '11:20 AM': 4, '10:15 AM': 5,
      '9:30 AM': 6, '8:45 AM': 7, 'Yesterday': 8, '2 days ago': 9, '3 days ago': 10,
      'Last week': 11, '5 days ago': 12, '1 week ago': 13, '2 weeks ago': 14,
      '3 weeks ago': 15, '1 month ago': 16, '2 months ago': 17, '3 months ago': 18, '6 months ago': 19
    };

    const aPriority = timePriority[a.time as keyof typeof timePriority] || 20;
    const bPriority = timePriority[b.time as keyof typeof timePriority] || 20;

    return aPriority - bPriority;
  });
};

let cachedChats: ChatInfo[] | null = null;
let lastCacheTime = 0;

// Mock authentication data
let mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'JD',
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2023-01-01'),
  },
  {
    id: 'user-2',
    username: 'janesmith',
    email: 'jane@example.com',
    avatar: 'JS',
    isOnline: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'user-3',
    username: 'mikejohnson',
    email: 'mike@example.com',
    avatar: 'MJ',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    createdAt: new Date('2023-02-01'),
  },
];

let currentUser: AuthUser | null = null;
let jwtToken: string | null = null;
let mockMessages: { [chatId: string]: ChatMessage[] } = {};
let mockTypingIndicators: TypingIndicator[] = [];

// Initialize mock messages
const initializeMockMessages = () => {
  const sampleMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      senderId: 'user-1',
      message: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'read',
    },
    {
      id: 'msg-2',
      senderId: 'user-2',
      message: 'I\'m doing great! Thanks for asking.',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'read',
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      message: 'Let\'s catch up soon!',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: 'read',
    },
  ];

  Object.keys(cachedChats || {}).forEach(chatId => {
    mockMessages[chatId] = [...sampleMessages];
  });
};

// Enhanced Mock API service
export const mockChatApi = {
  // Authentication endpoints
  login: async (request: LoginRequest): Promise<ApiResponse<AuthUser>> => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const user = mockUsers.find(u => u.email === request.email);
    if (user && request.password === 'password123') {
      currentUser = user;
      jwtToken = `mock-jwt-token-${user.id}-${Date.now()}`;
      return {
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: false,
      error: 'Invalid credentials',
      timestamp: new Date().toISOString(),
    };
  },

  register: async (request: RegisterRequest): Promise<ApiResponse<AuthUser>> => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Check if user already exists
    if (mockUsers.find(u => u.email === request.email)) {
      return {
        success: false,
        error: 'User already exists',
        timestamp: new Date().toISOString(),
      };
    }

    const newUser: AuthUser = {
      id: `user-${mockUsers.length + 1}`,
      username: request.username,
      email: request.email,
      avatar: request.username.slice(0, 2).toUpperCase(),
      isOnline: true,
      lastSeen: new Date(),
      createdAt: new Date(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;
    jwtToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;

    return {
      success: true,
      data: newUser,
      timestamp: new Date().toISOString(),
    };
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));

    if (!currentUser) {
      return {
        success: false,
        error: 'No user logged in',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: currentUser,
      timestamp: new Date().toISOString(),
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));

    currentUser = null;
    jwtToken = null;

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Chat endpoints
  getChats: async (): Promise<ApiResponse<ChatInfo[]>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    // Cache data for 5 minutes
    const now = Date.now();
    if (cachedChats && (now - lastCacheTime) < 5 * 60 * 1000) {
      return {
        success: true,
        data: cachedChats,
        timestamp: new Date().toISOString(),
      };
    }

    cachedChats = generateMockChatData();
    lastCacheTime = now;

    // Initialize mock messages if not already done
    if (Object.keys(mockMessages).length === 0) {
      initializeMockMessages();
    }

    return {
      success: true,
      data: cachedChats,
      timestamp: new Date().toISOString(),
    };
  },

  searchChats: async (query: string): Promise<ApiResponse<ChatInfo[]>> => {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));

    const allChats = await this.getChats();
    const filteredChats = allChats.data?.filter(chat =>
      chat.name.toLowerCase().includes(query.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(query.toLowerCase())
    ) || [];

    return {
      success: true,
      data: filteredChats,
      timestamp: new Date().toISOString(),
    };
  },

  getChatById: async (id: string): Promise<ApiResponse<ChatInfo | null>> => {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));

    const allChats = await this.getChats();
    const chat = allChats.data?.find(chat => chat.id === id) || null;

    return {
      success: true,
      data: chat,
      timestamp: new Date().toISOString(),
    };
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));

    const allChats = await this.getChats();
    const unreadCount = allChats.data?.filter(chat => chat.unread > 0).length || 0;

    return {
      success: true,
      data: unreadCount,
      timestamp: new Date().toISOString(),
    };
  },

  markChatAsRead: async (id: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));

    if (cachedChats) {
      const chat = cachedChats.find(c => c.id === id);
      if (chat) {
        chat.unread = 0;
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Message endpoints
  getMessages: async (chatId: string): Promise<ApiResponse<ChatMessage[]>> => {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    const messages = mockMessages[chatId] || [];

    return {
      success: true,
      data: messages,
      timestamp: new Date().toISOString(),
    };
  },

  sendMessage: async (chatId: string, message: string): Promise<ApiResponse<ChatMessage>> => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    if (!currentUser) {
      return {
        success: false,
        error: 'No user logged in',
        timestamp: new Date().toISOString(),
      };
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      message,
      timestamp: new Date(),
      status: 'sent',
    };

    if (!mockMessages[chatId]) {
      mockMessages[chatId] = [];
    }

    mockMessages[chatId].push(newMessage);

    // Update chat list with last message
    if (cachedChats) {
      const chat = cachedChats.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = message;
        chat.time = 'Just now';
        if (chat.senderId !== currentUser.id) {
          chat.unread = (chat.unread || 0) + 1;
        }
      }
    }

    return {
      success: true,
      data: newMessage,
      timestamp: new Date().toISOString(),
    };
  },

  updateMessageStatus: async (messageId: string, status: MessageStatus): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));

    // Find and update message status
    for (const chatId in mockMessages) {
      const message = mockMessages[chatId].find(m => m.id === messageId);
      if (message) {
        message.status = status;
        break;
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Group chat endpoints
  createGroup: async (name: string, members: string[]): Promise<ApiResponse<ChatInfo>> => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const newGroup: ChatInfo = {
      id: `group-${Date.now()}`,
      name,
      lastMessage: 'Group created',
      time: 'Just now',
      unread: 0,
      isOnline: true,
      avatar: name.slice(0, 2).toUpperCase(),
      type: 'group',
      members: members.length + 1,
    };

    if (cachedChats) {
      cachedChats.unshift(newGroup);
    }

    return {
      success: true,
      data: newGroup,
      timestamp: new Date().toISOString(),
    };
  },

  // Real-time features
  subscribeToUpdates: (callback: (chats: ChatInfo[]) => void): () => void => {
    const interval = setInterval(() => {
      if (cachedChats && Math.random() > 0.7) {
        const randomChat = cachedChats[Math.floor(Math.random() * cachedChats.length)];
        if (randomChat && Math.random() > 0.5) {
          randomChat.lastMessage = `New message: ${['Hello', 'Hey', 'Update', 'Reminder', 'Info'][Math.floor(Math.random() * 5)]}`;
          randomChat.time = 'Just now';
          if (Math.random() > 0.6) {
            randomChat.unread = (randomChat.unread || 0) + 1;
          }
          callback([...cachedChats]);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  },

  subscribeToMessages: (callback: (message: ChatMessage) => void): () => void => {
    const interval = setInterval(() => {
      if (Object.keys(mockMessages).length > 0 && Math.random() > 0.8) {
        const chatIds = Object.keys(mockMessages);
        const randomChatId = chatIds[Math.floor(Math.random() * chatIds.length)];

        if (currentUser && Math.random() > 0.5) {
          // Simulate incoming message
          const incomingMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'user-2',
            message: ['Hello!', 'How are you?', 'Check this out!', 'See you soon!', 'Thanks!'][Math.floor(Math.random() * 5)],
            timestamp: new Date(),
            status: 'delivered',
          };

          mockMessages[randomChatId].push(incomingMessage);
          callback(incomingMessage);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  },

  sendTypingIndicator: async (chatId: string, isTyping: boolean): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));

    if (!currentUser) return {
      success: false,
      error: 'No user logged in',
      timestamp: new Date().toISOString(),
    };

    const indicator: TypingIndicator = {
      userId: currentUser.id,
      chatId,
      isTyping,
      timestamp: new Date(),
    };

    const existingIndex = mockTypingIndicators.findIndex(i => i.userId === currentUser?.id && i.chatId === chatId);
    if (existingIndex >= 0) {
      mockTypingIndicators[existingIndex] = indicator;
    } else {
      mockTypingIndicators.push(indicator);
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  getTypingIndicators: (chatId: string): TypingIndicator[] => {
    return mockTypingIndicators.filter(i => i.chatId === chatId && i.isTyping);
  },

  // Search functionality
  searchMessages: async (query: string, chatId?: string): Promise<ApiResponse<ChatMessage[]>> => {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

    const results: ChatMessage[] = [];

    const chatIds = chatId ? [chatId] : Object.keys(mockMessages);

    for (const id of chatIds) {
      const chatMessages = mockMessages[id] || [];
      const filteredMessages = chatMessages.filter(msg =>
        msg.message.toLowerCase().includes(query.toLowerCase())
      );
      results.push(...filteredMessages);
    }

    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    };
  },

  // Swagger documentation helper
  getApiSpec: (): any => {
    return {
      openapi: '3.0.0',
      info: {
        title: 'WhatsApp Clone API',
        description: 'Mock API for WhatsApp Clone Frontend Application',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'api@whatsapp-clone.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3001/api',
          description: 'Development server'
        }
      ],
      paths: {
        '/auth/login': {
          post: {
            summary: 'User login',
            tags: ['Authentication'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginRequest' }
                }
              }
            },
            responses: {
              200: {
                description: 'Login successful',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/AuthResponse' }
                  }
                }
              }
            }
          }
        },
        '/auth/register': {
          post: {
            summary: 'User registration',
            tags: ['Authentication'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RegisterRequest' }
                }
              }
            },
            responses: {
              200: {
                description: 'Registration successful',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/AuthResponse' }
                  }
                }
              }
            }
          }
        },
        '/chats': {
          get: {
            summary: 'Get all chats',
            tags: ['Chats'],
            responses: {
              200: {
                description: 'List of chats',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/ChatInfo' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/chats/{id}/messages': {
          get: {
            summary: 'Get messages for a chat',
            tags: ['Messages'],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            responses: {
              200: {
                description: 'Messages for the chat',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/ChatMessage' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: 'Send a new message',
            tags: ['Messages'],
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' }
              }
            ],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              200: {
                description: 'Message sent successfully',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/MessageResponse' }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          LoginRequest: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' }
            }
          },
          RegisterRequest: {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
              username: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string' }
            }
          },
          AuthResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { $ref: '#/components/schemas/AuthUser' },
              error: { type: 'string' }
            }
          },
          AuthUser: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              avatar: { type: 'string' },
              isOnline: { type: 'boolean' },
              lastSeen: { type: 'string', format: 'date-time' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          },
          ChatInfo: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              lastMessage: { type: 'string' },
              time: { type: 'string' },
              unread: { type: 'number' },
              isOnline: { type: 'boolean' },
              avatar: { type: 'string' },
              type: { type: 'string', enum: ['personal', 'group', 'channel'] },
              members: { type: 'number' }
            }
          },
          ChatMessage: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              senderId: { type: 'string' },
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['sent', 'delivered', 'read', 'failed'] }
            }
          },
          MessageResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { $ref: '#/components/schemas/ChatMessage' },
              error: { type: 'string' }
            }
          }
        }
      }
    };
  }
};

export default mockChatApi;