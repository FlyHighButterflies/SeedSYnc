import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import inventoryService from "@/services/inventoryService";

// Main inventory hook
export const useInventory = () => {
    const queryClient = useQueryClient();

    // Fetch inventory for authenticated user
    const inventoryQuery = useQuery({
        queryKey: ["inventory"],
        queryFn: inventoryService.getInventory,
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Create inventory mutation
    const createInventory = useMutation({
        mutationFn: inventoryService.createInventory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    // Update inventory mutation - Fixed to match controller expectations
    const updateInventory = useMutation({
        mutationFn: ({ userId, crops }) =>
            inventoryService.updateInventory(userId, crops),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    // Delete inventory mutation
    const deleteInventory = useMutation({
        mutationFn: inventoryService.deleteInventory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    // Helper function to add crop to inventory
    const addCropToInventory = useMutation({
        mutationFn: async (cropId) => {
            const currentInventory = inventoryQuery.data;
            if (!currentInventory) {
                throw new Error("No inventory found");
            }

            // Extract current crop IDs from crops array
            const currentCropIds = currentInventory.crops.map((crop) => crop.cropId);

            // Add new crop ID if not already present
            if (!currentCropIds.includes(cropId)) {
                const updatedCropIds = [...currentCropIds, cropId];
                return inventoryService.updateInventory(currentInventory.userId, updatedCropIds);
            }

            return currentInventory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    // Helper function to remove crop from inventory
    const removeCropFromInventory = useMutation({
        mutationFn: async (cropId) => {
            const currentInventory = inventoryQuery.data;
            if (!currentInventory) {
                throw new Error("No inventory found");
            }

            // Extract current crop IDs and filter out the specified one
            const currentCropIds = currentInventory.crops.map((crop) => crop.cropId);
            const updatedCropIds = currentCropIds.filter((id) => id !== cropId);

            return inventoryService.updateInventory(currentInventory.userId, updatedCropIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    // Helper function to update entire crop list
    const updateCropList = useMutation({
        mutationFn: async (cropIds) => {
            const currentInventory = inventoryQuery.data;
            if (!currentInventory) {
                throw new Error("No inventory found");
            }

            return inventoryService.updateInventory(currentInventory.userId, cropIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });

    return {
        // Main inventory data and states
        ...inventoryQuery,
        inventory: inventoryQuery.data,
        crops: inventoryQuery.data?.crops || [],

        // Main inventory mutations
        createInventory,
        updateInventory,
        deleteInventory,

        // Crop management helpers
        addCropToInventory,
        removeCropFromInventory,
        updateCropList,
    };
};

// Helper hook to get filtered crops based on user role
export const useInventoryCrops = (userType) => {
    const { crops, ...rest } = useInventory();

    const filteredCrops = crops.filter((crop) => {
        if (userType === "farmer") {
            // Based on InventoryModel cropDetailsSchema - farmer fields
            return crop.pricePerUnit !== undefined && crop.harvestDate !== undefined;
        } else if (userType === "buyer") {
            // Based on InventoryModel cropDetailsSchema - buyer fields
            return crop.weightNedeed !== undefined && crop.BudgetPerUnit !== undefined;
        }
        return false;
    });

    return {
        ...rest,
        crops: filteredCrops,
    };
};