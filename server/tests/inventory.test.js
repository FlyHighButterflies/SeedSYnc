const request = require('supertest');
const app = require('../src/app');
const InventoryModel = require('../src/models/InventoryModel');

describe('Inventory API', () => {
    beforeEach(async () => {
        await InventoryModel.deleteMany({});
    });

    it('should create a new inventory item', async () => {
        const res = await request(app)
            .post('/api/inventory')
            .send({
                cropId: '60d5ec49f1b2c8d1f8b4567a',
                farmerId: '60d5ec49f1b2c8d1f8b4567b',
                quantity: 100
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Inventory item created successfully');
    });

    it('should get all inventory items', async () => {
        await InventoryModel.create({
            cropId: '60d5ec49f1b2c8d1f8b4567a',
            farmerId: '60d5ec49f1b2c8d1f8b4567b',
            quantity: 100
        });

        const res = await request(app).get('/api/inventory');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should update an inventory item', async () => {
        const inventoryItem = await InventoryModel.create({
            cropId: '60d5ec49f1b2c8d1f8b4567a',
            farmerId: '60d5ec49f1b2c8d1f8b4567b',
            quantity: 100
        });

        const res = await request(app)
            .put(`/api/inventory/${inventoryItem._id}`)
            .send({ quantity: 150 });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Inventory item updated successfully');
    });

    it('should delete an inventory item', async () => {
        const inventoryItem = await InventoryModel.create({
            cropId: '60d5ec49f1b2c8d1f8b4567a',
            farmerId: '60d5ec49f1b2c8d1f8b4567b',
            quantity: 100
        });

        const res = await request(app).delete(`/api/inventory/${inventoryItem._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Inventory item deleted successfully');
    });
});