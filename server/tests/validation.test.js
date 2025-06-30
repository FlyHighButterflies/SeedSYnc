import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { 
    validateUserRegistration,
    validateUserLogin,
    validateCropCreation,
    validateCropSearch,
    handleValidationErrors,
    sanitizeInputs
} from '../src/validators/index.js';

// Create a test app to test validation middleware
const createTestApp = (validators) => {
    const app = express();
    app.use(express.json());
    
    app.post('/test', 
        ...validators,
        handleValidationErrors,
        sanitizeInputs,
        (req, res) => res.json({ success: true, data: req.body })
    );
    
    return app;
};

describe('Express-Validator Implementation Tests', () => {
    
    describe('User Registration Validation', () => {
        const app = createTestApp(validateUserRegistration);
        
        it('should accept valid user registration data', async () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'John Doe',
                contactNumber: '+1234567890',
                address: '123 Main Street, City',
                role: 'farmer',
                terms: true
            };
            
            const response = await request(app)
                .post('/test')
                .send(validData);
                
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
        
        it('should reject invalid email format', async () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password123',
                fullName: 'John Doe',
                contactNumber: '+1234567890',
                address: '123 Main Street, City',
                role: 'farmer',
                terms: true
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'email',
                    message: expect.stringContaining('email')
                })
            );
        });
        
        it('should reject weak password', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: '123', // Too short, no letters
                fullName: 'John Doe',
                contactNumber: '+1234567890',
                address: '123 Main Street, City',
                role: 'farmer',
                terms: true
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'password'
                })
            );
        });
        
        it('should reject invalid role', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'John Doe',
                contactNumber: '+1234567890',
                address: '123 Main Street, City',
                role: 'invalid_role',
                terms: true
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'role',
                    message: expect.stringContaining('farmer')
                })
            );
        });
        
        it('should require terms acceptance', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: 'password123',
                fullName: 'John Doe',
                contactNumber: '+1234567890',
                address: '123 Main Street, City',
                role: 'farmer',
                terms: false
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'terms'
                })
            );
        });
    });
    
    describe('User Login Validation', () => {
        const app = createTestApp(validateUserLogin);
        
        it('should accept valid login data', async () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123'
            };
            
            const response = await request(app)
                .post('/test')
                .send(validData);
                
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
        
        it('should reject empty password', async () => {
            const invalidData = {
                email: 'test@example.com',
                password: ''
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'password'
                })
            );
        });
    });
    
    describe('Crop Creation Validation', () => {
        const app = createTestApp(validateCropCreation);
        
        it('should accept valid crop data', async () => {
            const validData = {
                name: 'Tomatoes',
                variety: 'Cherry',
                description: 'Fresh organic cherry tomatoes',
                initialWeightKg: 100.5,
                pricePerKg: 5.99,
                harvestDate: '2025-07-01T00:00:00.000Z',
                expiryDate: '2025-12-31T00:00:00.000Z'
            };
            
            const response = await request(app)
                .post('/test')
                .send(validData);
                
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Tomatoes');
            expect(response.body.data.pricePerKg).toBe(5.99);
        });
        
        it('should reject negative weight', async () => {
            const invalidData = {
                name: 'Tomatoes',
                initialWeightKg: -10
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'initialWeightKg'
                })
            );
        });
        
        it('should reject past expiry date', async () => {
            const invalidData = {
                name: 'Tomatoes',
                expiryDate: '2020-01-01T00:00:00.000Z' // Past date
            };
            
            const response = await request(app)
                .post('/test')
                .send(invalidData);
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'expiryDate',
                    message: expect.stringContaining('future')
                })
            );
        });
    });
    
    describe('Crop Search Validation', () => {
        const app = express();
        app.use(express.json());
        
        app.get('/test', 
            ...validateCropSearch,
            handleValidationErrors,
            (req, res) => res.json({ success: true, query: req.query })
        );
        
        it('should accept valid search parameters', async () => {
            const response = await request(app)
                .get('/test')
                .query({
                    query: 'tomato',
                    type: 'fuzzy',
                    minPrice: 1.5,
                    maxPrice: 10.0,
                    limit: 20
                });
                
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
        
        it('should reject invalid price range', async () => {
            const response = await request(app)
                .get('/test')
                .query({
                    query: 'tomato',
                    minPrice: 10.0,
                    maxPrice: 5.0 // Max less than min
                });
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'maxPrice'
                })
            );
        });
        
        it('should reject invalid limit', async () => {
            const response = await request(app)
                .get('/test')
                .query({
                    query: 'tomato',
                    limit: 150 // Over max limit
                });
                
            expect(response.status).toBe(400);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'limit'
                })
            );
        });
    });
    
    describe('Input Sanitization', () => {
        const app = createTestApp([]);
        
        it('should sanitize XSS attempts', async () => {
            const maliciousData = {
                name: '<script>alert("xss")</script>',
                description: 'Normal text with <img src=x onerror=alert(1)>'
            };
            
            const response = await request(app)
                .post('/test')
                .send(maliciousData);
                
            expect(response.status).toBe(200);
            // Check that dangerous characters are escaped
            expect(response.body.data.name).not.toContain('<script>');
            expect(response.body.data.description).not.toContain('<img');
        });
        
        it('should remove empty fields', async () => {
            const dataWithEmpties = {
                name: 'Valid Name',
                emptyString: '',
                nullValue: null,
                undefinedValue: undefined,
                validField: 'Valid Value'
            };
            
            const response = await request(app)
                .post('/test')
                .send(dataWithEmpties);
                
            expect(response.status).toBe(200);
            expect(response.body.data).not.toHaveProperty('emptyString');
            expect(response.body.data).not.toHaveProperty('nullValue');
            expect(response.body.data).not.toHaveProperty('undefinedValue');
            expect(response.body.data.name).toBe('Valid Name');
            expect(response.body.data.validField).toBe('Valid Value');
        });
    });
});

describe('Validation Error Response Format', () => {
    const app = createTestApp(validateUserRegistration);
    
    it('should return standardized error format', async () => {
        const response = await request(app)
            .post('/test')
            .send({}); // Empty body to trigger multiple validation errors
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Validation failed');
        expect(response.body).toHaveProperty('errors');
        expect(response.body).toHaveProperty('errorCount');
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errorCount).toBeGreaterThan(0);
        
        // Check error object structure
        const firstError = response.body.errors[0];
        expect(firstError).toHaveProperty('field');
        expect(firstError).toHaveProperty('message');
        expect(firstError).toHaveProperty('location');
    });
});
