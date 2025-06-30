import request from 'supertest';
import app from '../src/app.js';
import TradeModel from '../src/models/TradeModel.js';
import { generateTestToken, createTestUser } from './setup.js';

describe('Trade API', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
        await TradeModel.deleteMany({});
        testUser = createTestUser();
        authToken = generateTestToken(testUser._id, 'farmer');
    });

    describe('POST /api/trades', () => {
        it('should create a new trade with authentication', async () => {
            const tradeData = {
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: testUser._id,
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                pricePerKg: 2.50,
                totalAmount: 250,
                status: 'pending'
            };

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', `Bearer ${authToken}`)
                .send(tradeData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.buyerId).toBe(tradeData.buyerId);
            expect(response.body.sellerId).toBe(tradeData.sellerId);
        });

        it('should reject unauthenticated requests', async () => {
            const tradeData = {
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: testUser._id,
                cropId: '60d5ecb74b24b123456789ae'
            };

            await request(app)
                .post('/api/trades')
                .send(tradeData)
                .expect(401);
        });

        it('should validate required fields', async () => {
            const invalidTradeData = { buyerId: 'buyer123' }; // Missing required fields

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidTradeData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/trades', () => {
        it('should get all trades for authenticated user', async () => {
            await TradeModel.create({
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: testUser._id,
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                status: 'pending'
            });

            const response = await request(app)
                .get('/api/trades')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('_id');
        });

        it('should reject unauthenticated requests', async () => {
            await request(app)
                .get('/api/trades')
                .expect(401);
        });
    });

    describe('PUT /api/trades/:id', () => {
        it('should update a trade when authorized', async () => {
            const trade = await TradeModel.create({
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: testUser._id,
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                status: 'pending'
            });

            const updatedData = { status: 'completed', quantity: 150 };

            const response = await request(app)
                .put(`/api/trades/${trade._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.status).toBe(updatedData.status);
            expect(response.body.quantity).toBe(updatedData.quantity);
        });

        it('should reject unauthorized trade updates', async () => {
            const trade = await TradeModel.create({
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: '60d5ecb74b24b123456789ad', // Different user
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                status: 'pending'
            });

            const updatedData = { status: 'completed' };

            await request(app)
                .put(`/api/trades/${trade._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(403);
        });
    });

    describe('DELETE /api/trades/:id', () => {
        it('should delete a trade when authorized', async () => {
            const trade = await TradeModel.create({
                buyerId: testUser._id,
                sellerId: '60d5ecb74b24b123456789ad',
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                status: 'pending'
            });

            await request(app)
                .delete(`/api/trades/${trade._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            const trades = await TradeModel.find();
            expect(trades.length).toBe(0);
        });

        it('should reject unauthorized trade deletions', async () => {
            const trade = await TradeModel.create({
                buyerId: '60d5ecb74b24b123456789ac',
                sellerId: '60d5ecb74b24b123456789ad', // Different users
                cropId: '60d5ecb74b24b123456789ae',
                quantity: 100,
                status: 'pending'
            });

            await request(app)
                .delete(`/api/trades/${trade._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(403);
        });
    });
});