import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-memory user storage (for hackathon - replace with database later)
interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: Date;
  subscriptionTier?: 'free' | 'premium';
  storageUsed?: number;
}

// File-based persistence for users
const USERS_FILE = path.join(__dirname, '../../storage/users.json');

// Initialize users array from file or empty array
const loadUsers = (): User[] => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      console.log(`📋 Loaded ${parsed.length} users from storage`);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
};

// Save users to file
const saveUsers = (users: User[]): void => {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log(`💾 Saved ${users.length} users to storage`);
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const users: User[] = loadUsers();

// Generate unique user ID using crypto UUID
const generateUniqueUserId = (): string => {
  let userId: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    // Generate a random UUID (guaranteed unique)
    userId = crypto.randomUUID();
    attempts++;

    // Extra safety check (though UUID collisions are virtually impossible)
    if (!users.find(u => u.id === userId)) {
      break;
    }
  } while (attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique user ID');
  }

  return userId;
};

// Helper to generate JWT token
const generateToken = (userId: string, email: string) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ userId, email }, secret, { expiresIn: '7d' }) as string;
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'Please provide email, password, and full name'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique user ID
    const uniqueId = generateUniqueUserId();

    // Create user with default free tier
    const newUser: User = {
      id: uniqueId,
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      createdAt: new Date(),
      subscriptionTier: 'free',
      storageUsed: 0
    };

    users.push(newUser);
    saveUsers(users); // Persist to file

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    console.log(`✅ New user registered: ${email} | ID: ${newUser.id} | Tier: FREE | Total Users: ${users.length}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        subscriptionTier: newUser.subscriptionTier,
        storageUsed: newUser.storageUsed
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    console.log(`✅ User logged in: ${email} | ID: ${user.id} | Tier: ${user.subscriptionTier?.toUpperCase() || 'FREE'}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        subscriptionTier: user.subscriptionTier || 'free',
        storageUsed: user.storageUsed || 0
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user (protected route)
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt
      }
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Get all users (for debugging - remove in production)
export const getAllUsers = (req: Request, res: Response) => {
  res.json({
    success: true,
    count: users.length,
    users: users.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      createdAt: u.createdAt
    }))
  });
};
