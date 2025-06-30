import request from 'supertest';
import app from '../src/app.js';
import InventoryModel from '../src/models/inventoryModel.js';
import { generateTestToken, createTestUser } from './setup.js';

describe('Inventory API', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
        await InventoryModel.deleteMany({});
        testUser = createTestUser();
        authToken = generateTestToken(testUser._id, 'farmer');
    });

    describe('POST /api/inventory', () => {
        it('should create a new inventory item with authentication', async () => {
            const inventoryData = {
                cropName: 'Wheat',
                variety: 'Winter Wheat',
                quantity: 100,
                pricePerKg: 2.50,
                location: 'Farm A',
                farmerId: testUser._id
            };

            const response = await request(app)
                .post('/api/inventory')
                .set('Authorization', `Bearer ${authToken}`)
                .send(inventoryData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.cropName).toBe(inventoryData.cropName);
        });

        it('should reject unauthenticated requests', async () => {
            const inventoryData = {
                cropName: 'Wheat',
                quantity: 100
            };

            await request(app)
                .post('/api/inventory')
                .send(inventoryData)
                .expect(401);
        });

        it('should validate required fields', async () => {
            const invalidInventoryData = { quantity: 100 }; // Missing cropName

            const response = await request(app)
                .post('/api/inventory')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidInventoryData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/inventory', () => {
        it('should get inventory for authenticated user', async () => {
            await InventoryModel.create({
                cropName: 'Corn',
                quantity: 50,
                farmerId: testUser._id
            });

            const response = await request(app)
                .get('/api/inventory')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should reject unauthenticated requests', async () => {
            await request(app)
                .get('/api/inventory')
                .expect(401);
        });
    });

    describe('PUT /api/inventory/:id', () => {
        it('should update inventory item when user owns it', async () => {
            const inventory = await InventoryModel.create({
                cropName: 'Rice',
                quantity: 30,
                farmerId: testUser._id
            });

            const updatedData = { quantity: 50, pricePerKg: 3.00 };

            const response = await request(app)
                .put(`/api/inventory/${inventory._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.quantity).toBe(updatedData.quantity);
        });

        it('should reject unauthorized inventory updates', async () => {
            const inventory = await InventoryModel.create({
                cropName: 'Rice',
                quantity: 30,
                farmerId: '60d5ecb74b24b123456789ad' // Different user
            });


            const updatedData = { quantity: 50 };

            await request(app)
                .put(`/api/inventory/${inventory._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(403);
        });
    });

    describe('DELETE /api/inventory/:id', () => {
        it('should delete inventory item when user owns it', async () => {
            const inventory = await InventoryModel.create({
                cropName: 'Barley',
                quantity: 20,
                farmerId: testUser._id
            });

            await request(app)
                .delete(`/api/inventory/${inventory._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            const inventoryItems = await InventoryModel.find();
            expect(inventoryItems.length).toBe(0);
        });

        it('should reject unauthorized inventory deletions', async () => {
            const inventory = await InventoryModel.create({
                cropName: 'Barley',
                quantity: 20,
                farmerId: '60d5ecb74b24b123456789ad' // Different user
            });

            await request(app)
                .delete(`/api/inventory/${inventory._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(403);
        });
    });
});