import api from "./api";

const inventoryService = {
    async createInventory(inventoryData) {
        const response = await api.post("/inventory", inventoryData);
        return response.data;
    },

    async getInventory() {
        const response = await api.get("/inventory");
        return response.data;
    },

    async updateInventory(userId, inventoryData) {
        const response = await api.put(`/inventory/${userId}`, inventoryData);
        return response.data;
    },

    async deleteInventory(userId) {
        const response = await api.delete(`/inventory/${userId}`);
        return response.data;
    },
};

export default inventoryService;