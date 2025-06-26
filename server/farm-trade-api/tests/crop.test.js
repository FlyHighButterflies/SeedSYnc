const request = require('supertest');
const app = require('../src/app');
const CropModel = require('../src/models/CropModel');

describe('Crop API', () => {
    beforeEach(async () => {
        await CropModel.deleteMany({});
    });

    it('should create a new crop', async () => {
        const cropData = { name: 'Wheat', type: 'Cereal', quantity: 100 };
        const response = await request(app)
            .post('/api/crops')
            .send(cropData)
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(cropData.name);
    });

    it('should get all crops', async () => {
        await CropModel.create({ name: 'Corn', type: 'Cereal', quantity: 50 });
        const response = await request(app)
            .get('/api/crops')
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Corn');
    });

    it('should update a crop', async () => {
        const crop = await CropModel.create({ name: 'Rice', type: 'Cereal', quantity: 30 });
        const updatedData = { name: 'Brown Rice', quantity: 40 };

        const response = await request(app)
            .put(`/api/crops/${crop._id}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.quantity).toBe(updatedData.quantity);
    });

    it('should delete a crop', async () => {
        const crop = await CropModel.create({ name: 'Barley', type: 'Cereal', quantity: 20 });

        await request(app)
            .delete(`/api/crops/${crop._id}`)
            .expect(204);

        const crops = await CropModel.find();
        expect(crops.length).toBe(0);
    });
});