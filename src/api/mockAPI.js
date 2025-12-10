// Mock user database
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff'
  },
  {
    id: 3,
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Test+User&background=f59e0b&color=fff'
  }
];

// Simulate JWT token generation
const generateMockToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  return btoa(JSON.stringify(payload)); // Simple base64 encoding
};

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
  login: async (credentials) => {
    await delay();
    
    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const accessToken = generateMockToken(user);
    const refreshToken = generateMockToken(user) + '_refresh';

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    };
  },

  getCurrentUser: async () => {
    await delay(300);
    
    const token = localStorage.getItem('mockAccessToken');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const decoded = JSON.parse(atob(token));
      const user = mockUsers.find(u => u.id === decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  getStats: async () => {
    await delay(300);
    
    return {
      totalLogins: Math.floor(Math.random() * 100) + 50,
      accountAge: Math.floor(Math.random() * 365) + 30,
      lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      activeSessionsCount: Math.floor(Math.random() * 5) + 1
    };
  },

  getDashboard: async () => {
    await delay(300);
    
    const token = localStorage.getItem('mockAccessToken');
    const decoded = JSON.parse(atob(token));

    return {
      message: 'Welcome to your dashboard!',
      user: decoded,
      data: {
        notifications: Math.floor(Math.random() * 10),
        messages: Math.floor(Math.random() * 20),
        tasks: Math.floor(Math.random() * 15),
        projects: Math.floor(Math.random() * 8)
      },
      recentActivity: [
        { id: 1, action: 'Logged in', timestamp: new Date().toISOString() },
        { id: 2, action: 'Updated profile', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'Changed password', timestamp: new Date(Date.now() - 86400000).toISOString() }
      ]
    };
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('mockAccessToken');
    localStorage.removeItem('mockRefreshToken');
  }
};
