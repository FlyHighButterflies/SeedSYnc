import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Simplified test setup that works with or without database
let isConnected = false;

beforeAll(async () => {
  try {
    // Use test database for safety - can use same MongoDB instance but different DB
    const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/seedsync_test';
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });
    
    isConnected = true;
    console.log('✅ Connected to test database');
  } catch (error) {
    console.warn('⚠️ No database connection - running limited tests:', error.message);
    isConnected = false;
  }
}, 10000);

afterAll(async () => {
  if (isConnected && mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}, 10000);

beforeEach(async () => {
  if (isConnected) {
    // Clear all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Helper function to skip database tests if not connected
export const skipIfNoDatabase = () => {
  if (!isConnected) {
    pending('Database not available - skipping test');
  }
};

// Helper function to generate JWT tokens for testing
export const generateTestToken = (userId = '60d5ecb74b24b123456789ab', role = 'farmer') => {
  return jwt.sign(
    { 
      userId, 
      role,
      username: 'testuser'
    },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
};

// Helper function to create test user
export const createTestUser = () => ({
  _id: '60d5ecb74b24b123456789ab',
  username: 'testuser',
  email: 'test@example.com',
  role: 'farmer',
  firstName: 'Test',
  lastName: 'User'
});

// Mock authentication middleware for tests
export const mockAuth = (req, res, next) => {
  req.user = createTestUser();
  next();
};

// Export connection status for conditional tests
export { isConnected };
