import request from 'supertest';
import app from '../src/app.js';
import CropModel from '../src/models/CropModel.js';
import { generateTestToken, createTestUser } from './setup.js';

describe('Crop API', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
        await CropModel.deleteMany({});
        testUser = createTestUser();
        authToken = generateTestToken(testUser._id, testUser.role);
    });

    describe('POST /api/crops', () => {
        it('should create a new crop with authentication', async () => {
            const cropData = { 
                name: 'Wheat', 
                variety: 'Winter Wheat',
                type: 'Cereal', 
                quantity: 100,
                pricePerKg: 2.50,
                location: 'Farm A'
            };
            
            const response = await request(app)
                .post('/api/crops')
                .set('Authorization', `Bearer ${authToken}`)
                .send(cropData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.name).toBe(cropData.name);
            expect(response.body.variety).toBe(cropData.variety);
        });

        it('should reject unauthenticated requests', async () => {
            const cropData = { name: 'Wheat', type: 'Cereal', quantity: 100 };
            
            await request(app)
                .post('/api/crops')
                .send(cropData)
                .expect(401);
        });

        it('should validate required fields', async () => {
            const invalidCropData = { quantity: 100 }; // Missing required name
            
            const response = await request(app)
                .post('/api/crops')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidCropData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/crops', () => {
        it('should get all crops for authenticated user', async () => {
            await CropModel.create({ 
                name: 'Corn', 
                variety: 'Sweet Corn',
                type: 'Cereal', 
                quantity: 50,
                userId: testUser._id 
            });
            
            const response = await request(app)
                .get('/api/crops')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0].name).toBe('Corn');
        });

        it('should reject unauthenticated requests', async () => {
            await request(app)
                .get('/api/crops')
                .expect(401);
        });
    });

    describe('PUT /api/crops/:id', () => {
        it('should update a crop owned by the user', async () => {
            const crop = await CropModel.create({ 
                name: 'Rice', 
                variety: 'Basmati',
                type: 'Cereal', 
                quantity: 30,
                userId: testUser._id 
            });
            
            const updatedData = { name: 'Brown Rice', quantity: 40 };

            const response = await request(app)
                .put(`/api/crops/${crop._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.name).toBe(updatedData.name);
            expect(response.body.quantity).toBe(updatedData.quantity);
        });

        it('should reject unauthorized crop updates', async () => {
            const crop = await CropModel.create({ 
                name: 'Rice', 
                type: 'Cereal', 
                quantity: 30,
                userId: '60d5ecb74b24b123456789ac' // Different user
            });
            
            const updatedData = { name: 'Brown Rice', quantity: 40 };

            await request(app)
                .put(`/api/crops/${crop._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(403); // Forbidden
        });
    });

    describe('DELETE /api/crops/:id', () => {
        it('should delete a crop owned by the user', async () => {
            const crop = await CropModel.create({ 
                name: 'Barley', 
                type: 'Cereal', 
                quantity: 20,
                userId: testUser._id 
            });

            await request(app)
                .delete(`/api/crops/${crop._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            const crops = await CropModel.find();
            expect(crops.length).toBe(0);
        });

        it('should reject unauthorized crop deletions', async () => {
            const crop = await CropModel.create({ 
                name: 'Barley', 
                type: 'Cereal', 
                quantity: 20,
                userId: '60d5ecb74b24b123456789ac' // Different user
            });

            await request(app)
                .delete(`/api/crops/${crop._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(403); // Forbidden
        });
    });
});