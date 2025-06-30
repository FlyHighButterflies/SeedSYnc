import api from "./api";

const cropsService = {
    async createCrop(cropData) {
        const response = await api.post("/crops", cropData);
        return response.data;
    },

    async getCrops() {
        const response = await api.get("/crops");
        return response.data;
    },

    async updateCrop({ id, cropData }) {
        const response = await api.put(`/crops/${id}`, cropData);
        return response.data;
    },

    async deleteCrop(id) {
        const response = await api.delete(`/crops/${id}`);
        return response.data;
    },
};

export default cropsService;
