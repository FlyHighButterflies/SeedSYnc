const request = require('supertest');
const app = require('../src/app');
const TradeModel = require('../src/models/TradeModel');

describe('TradeController', () => {
    beforeEach(async () => {
        await TradeModel.deleteMany({});
    });

    it('should create a new trade', async () => {
        const tradeData = {
            buyerId: 'buyer123',
            sellerId: 'seller123',
            cropId: 'crop123',
            tradeDate: new Date(),
        };

        const response = await request(app)
            .post('/api/trades')
            .send(tradeData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.buyerId).toBe(tradeData.buyerId);
        expect(response.body.sellerId).toBe(tradeData.sellerId);
    });

    it('should get all trades', async () => {
        await TradeModel.create({
            buyerId: 'buyer123',
            sellerId: 'seller123',
            cropId: 'crop123',
            tradeDate: new Date(),
        });

        const response = await request(app)
            .get('/api/trades')
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('_id');
    });

    it('should update a trade', async () => {
        const trade = await TradeModel.create({
            buyerId: 'buyer123',
            sellerId: 'seller123',
            cropId: 'crop123',
            tradeDate: new Date(),
        });

        const updatedData = {
            buyerId: 'buyer456',
        };

        const response = await request(app)
            .put(`/api/trades/${trade._id}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.buyerId).toBe(updatedData.buyerId);
    });

    it('should delete a trade', async () => {
        const trade = await TradeModel.create({
            buyerId: 'buyer123',
            sellerId: 'seller123',
            cropId: 'crop123',
            tradeDate: new Date(),
        });

        await request(app)
            .delete(`/api/trades/${trade._id}`)
            .expect(204);

        const deletedTrade = await TradeModel.findById(trade._id);
        expect(deletedTrade).toBeNull();
    });
});