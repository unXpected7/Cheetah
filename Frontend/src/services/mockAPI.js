const MOCK_API_DELAY = 1000;

const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Another User',
    createdAt: new Date().toISOString(),
  }
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    message: 'Hello there!',
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    message: 'Hi! How can I help you?',
    timestamp: new Date().toISOString(),
  }
];

const mockChats = [
  {
    id: 1,
    userId: 1,
    contactId: 2,
    lastMessage: 'Hi! How can I help you?',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  },
  {
    id: 2,
    userId: 2,
    contactId: 1,
    lastMessage: 'Hello there!',
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  }
];

const simulateDelay = (data, success = true) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success,
        data,
        message: success ? 'Success' : 'Failed',
        timestamp: new Date().toISOString(),
      });
    }, MOCK_API_DELAY);
  });
};

export const mockAPI = {
  async login(email, password) {
    console.log('Mock login attempt:', { email, password });

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return simulateDelay({
        user: userWithoutPassword,
        token: `mock-token-${user.id}-${Date.now()}`,
        expiresIn: 3600,
      });
    } else {
      return simulateDelay(null, false);
    }
  },

  async signup(email, password, name) {
    console.log('Mock signup attempt:', { email, password, name });

    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return simulateDelay(null, false);
    }

    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return simulateDelay({
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
      expiresIn: 3600,
    });
  },

  async getChats(userId) {
    console.log('Mock getChats for user:', userId);

    const userChats = mockChats.filter(chat => chat.userId === userId);
    const chats = userChats.map(chat => ({
      id: chat.id,
      contact: mockUsers.find(u => u.id === chat.contactId),
      lastMessage: chat.lastMessage,
      lastMessageTime: chat.lastMessageTime,
      unreadCount: chat.unreadCount,
    }));

    return simulateDelay(chats);
  },

  async getMessages(userId, contactId) {
    console.log('Mock getMessages between:', userId, contactId);

    const messages = mockMessages.filter(
      msg => (msg.senderId === userId && msg.receiverId === contactId) ||
             (msg.senderId === contactId && msg.receiverId === userId)
    );

    return simulateDelay(messages);
  },

  async sendMessage(senderId, receiverId, messageText) {
    console.log('Mock sendMessage:', { senderId, receiverId, messageText });

    const newMessage = {
      id: mockMessages.length + 1,
      senderId,
      receiverId,
      message: messageText,
      timestamp: new Date().toISOString(),
    };

    mockMessages.push(newMessage);

    return simulateDelay(newMessage);
  },

  async getUserProfile(userId) {
    console.log('Mock getUserProfile:', userId);

    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return simulateDelay(userWithoutPassword);
    }
    return simulateDelay(null, false);
  },
};