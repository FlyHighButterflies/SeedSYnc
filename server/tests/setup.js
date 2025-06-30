import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Test database setup
const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/seedsync_test';

beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

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

// Global test timeout
jest.setTimeout(10000);
