import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

// Secret keys (in production, use environment variables)
const ACCESS_TOKEN_SECRET = 'your-access-token-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret-key-change-in-production';

// Token expiration times (shortened for testing)
const ACCESS_TOKEN_EXPIRY = '30s'; // 30 seconds 
const REFRESH_TOKEN_EXPIRY = '2m'; // 2 minutes 

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const users = [
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

// Store for refresh tokens (in production, use Redis or database)
let refreshTokens = [];

// Helper function to generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      role: user.role 
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// Middleware to verify access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired access token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Find user
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token
  refreshTokens.push(refreshToken);

  // Send response
  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    }
  });
});

// Refresh token endpoint
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // Find full user data
    const fullUser = users.find(u => u.id === user.id);
    if (!fullUser) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(fullUser);

    res.json({ accessToken });
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  }

  res.json({ message: 'Logged out successfully' });
});

// Protected route - Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar
  });
});

// Protected route - Get user stats
app.get('/api/user/stats', authenticateToken, (req, res) => {
  res.json({
    totalLogins: Math.floor(Math.random() * 100) + 50,
    accountAge: Math.floor(Math.random() * 365) + 30,
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    activeSessionsCount: Math.floor(Math.random() * 5) + 1
  });
});

// Protected route - Get dashboard data
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard!',
    user: req.user,
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
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log('\n📝 Available test accounts:');
  console.log('   Email: admin@example.com | Password: admin123');
  console.log('   Email: user@example.com  | Password: user123');
  console.log('   Email: test@example.com  | Password: test123');
  console.log('\n🔑 Access Token expires in: 30 seconds');
  console.log('🔄 Refresh Token expires in: 2 minutes\n');
});
