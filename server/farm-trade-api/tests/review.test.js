const request = require('supertest');
const app = require('../src/app');
const ReviewModel = require('../src/models/ReviewModel');

describe('Review API', () => {
    beforeEach(async () => {
        await ReviewModel.deleteMany({});
    });

    it('should create a new review', async () => {
        const reviewData = {
            cropId: '60d5ec49f1a2c8b1f8c8b1a1',
            userId: '60d5ec49f1a2c8b1f8c8b1a2',
            rating: 5,
            comment: 'Excellent crop quality!'
        };

        const response = await request(app)
            .post('/api/reviews')
            .send(reviewData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.cropId).toBe(reviewData.cropId);
        expect(response.body.userId).toBe(reviewData.userId);
        expect(response.body.rating).toBe(reviewData.rating);
        expect(response.body.comment).toBe(reviewData.comment);
    });

    it('should get all reviews', async () => {
        await ReviewModel.create({
            cropId: '60d5ec49f1a2c8b1f8c8b1a1',
            userId: '60d5ec49f1a2c8b1f8c8b1a2',
            rating: 5,
            comment: 'Excellent crop quality!'
        });

        const response = await request(app)
            .get('/api/reviews')
            .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
    });

    it('should update a review', async () => {
        const review = await ReviewModel.create({
            cropId: '60d5ec49f1a2c8b1f8c8b1a1',
            userId: '60d5ec49f1a2c8b1f8c8b1a2',
            rating: 5,
            comment: 'Excellent crop quality!'
        });

        const updatedData = {
            rating: 4,
            comment: 'Good quality, but could be better.'
        };

        const response = await request(app)
            .put(`/api/reviews/${review._id}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.rating).toBe(updatedData.rating);
        expect(response.body.comment).toBe(updatedData.comment);
    });

    it('should delete a review', async () => {
        const review = await ReviewModel.create({
            cropId: '60d5ec49f1a2c8b1f8c8b1a1',
            userId: '60d5ec49f1a2c8b1f8c8b1a2',
            rating: 5,
            comment: 'Excellent crop quality!'
        });

        await request(app)
            .delete(`/api/reviews/${review._id}`)
            .expect(204);

        const deletedReview = await ReviewModel.findById(review._id);
        expect(deletedReview).toBeNull();
    });
});