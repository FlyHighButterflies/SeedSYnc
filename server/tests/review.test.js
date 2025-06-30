import request from 'supertest';
import app from '../src/app.js';
import ReviewModel from '../src/models/ReviewModel.js';
import { generateTestToken, createTestUser } from './setup.js';

describe('Review API', () => {
    let authToken;
    let testUser;

    beforeEach(async () => {
        await ReviewModel.deleteMany({});
        testUser = createTestUser();
        authToken = generateTestToken(testUser._id, 'farmer');
    });

    describe('POST /api/reviews', () => {
        it('should create a new review with authentication', async () => {
            const reviewData = {
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 5,
                comment: 'Excellent farmer to work with!',
                tradeId: '60d5ecb74b24b123456789ae'
            };

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .send(reviewData)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.rating).toBe(reviewData.rating);
            expect(response.body.comment).toBe(reviewData.comment);
        });

        it('should reject unauthenticated requests', async () => {
            const reviewData = {
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 5,
                comment: 'Great!'
            };

            await request(app)
                .post('/api/reviews')
                .send(reviewData)
                .expect(401);
        });

        it('should validate required fields', async () => {
            const invalidReviewData = { comment: 'Missing rating' };

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidReviewData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/reviews', () => {
        it('should get reviews for authenticated user', async () => {
            await ReviewModel.create({
                reviewerId: testUser._id,
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 4,
                comment: 'Good service'
            });

            const response = await request(app)
                .get('/api/reviews')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should reject unauthenticated requests', async () => {
            await request(app)
                .get('/api/reviews')
                .expect(401);
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it('should update review when user owns it', async () => {
            const review = await ReviewModel.create({
                reviewerId: testUser._id,
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 4,
                comment: 'Good service'
            });

            const updatedData = { rating: 5, comment: 'Excellent service!' };

            const response = await request(app)
                .put(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.rating).toBe(updatedData.rating);
            expect(response.body.comment).toBe(updatedData.comment);
        });

        it('should reject unauthorized review updates', async () => {
            const review = await ReviewModel.create({
                reviewerId: '60d5ecb74b24b123456789ad', // Different user
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 4,
                comment: 'Good service'
            });

            const updatedData = { rating: 5 };

            await request(app)
                .put(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedData)
                .expect(403);
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should delete review when user owns it', async () => {
            const review = await ReviewModel.create({
                reviewerId: testUser._id,
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 4,
                comment: 'Good service'
            });

            await request(app)
                .delete(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(204);

            const reviews = await ReviewModel.find();
            expect(reviews.length).toBe(0);
        });

        it('should reject unauthorized review deletions', async () => {
            const review = await ReviewModel.create({
                reviewerId: '60d5ecb74b24b123456789ad', // Different user
                revieweeId: '60d5ecb74b24b123456789ac',
                rating: 4,
                comment: 'Good service'
            });

            await request(app)
                .delete(`/api/reviews/${review._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(403);
        });
    });
});
