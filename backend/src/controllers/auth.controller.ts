import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
// MongoDB imports disabled - using file-based storage only
// import { User, IUser } from '../models/user.model';
// import { isConnected } from '../config/database';

// File-based user storage interface (fallback)
interface UserFile {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  subscription: {
    tier: 'free' | 'premium';
    startDate?: string;
    endDate?: string;
    paymentId?: string;
  };
  storageUsed: number;
  favorites: string[];
}

const USERS_FILE = path.join(__dirname, '../../storage/users.json');

// Load users from file (fallback when MongoDB is not available)
const loadUsersFromFile = async (): Promise<UserFile[]> => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save users to file (fallback when MongoDB is not available)
const saveUsersToFile = async (users: UserFile[]): Promise<void> => {
  try {
    const dir = path.dirname(USERS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users to file:', error);
  }
};

// Generate unique user ID
const generateUniqueUserId = (): string => {
  return crypto.randomUUID();
};

// Helper to generate JWT token
const generateToken = (userId: string, email: string) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Please provide email, password, and name',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = generateUniqueUserId();

    // Use file-based storage only (MongoDB disabled)
    const users = await loadUsersFromFile();

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists',
      });
    }

    const newUser: UserFile = {
      id: uniqueId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      subscription: {
        tier: 'free',
      },
      storageUsed: 0,
      favorites: [],
    };

    users.push(newUser);
    await saveUsersToFile(users);

    const token = generateToken(newUser.id, newUser.email);

    console.log(`✅ New user registered: ${email} | ID: ${newUser.id}`);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        storageUsed: newUser.storageUsed,
        favorites: newUser.favorites,
      },
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
        error: 'Please provide email and password',
      });
    }

    // Use file-based storage only (MongoDB disabled)
    const users = await loadUsersFromFile();

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id, user.email);

    console.log(`✅ User logged in: ${email} | Tier: ${user.subscription?.tier?.toUpperCase()}`);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        storageUsed: user.storageUsed,
        favorites: user.favorites,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user (protected route)
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Use file-based storage only (MongoDB disabled)
    const users = await loadUsersFromFile();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        storageUsed: user.storageUsed,
        favorites: user.favorites,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

// Get all users (for debugging - remove in production)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Use file-based storage only (MongoDB disabled)
    const users = await loadUsersFromFile();
    return res.json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        subscription: u.subscription,
        storageUsed: u.storageUsed,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Helper function to get user by ID (used by other controllers)
export const getUserById = async (userId: string): Promise<any> => {
  // Use file-based storage only (MongoDB disabled)
  const users = await loadUsersFromFile();
  return users.find((u) => u.id === userId);
};

// Helper function to update user (used by other controllers)
export const updateUser = async (userId: string, updates: any): Promise<any> => {
  // Use file-based storage only (MongoDB disabled)
  const users = await loadUsersFromFile();
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    await saveUsersToFile(users);
    return users[userIndex];
  }
  return null;
};
