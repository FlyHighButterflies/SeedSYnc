import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cropsService } from "@/services";

// Main crops hook (similar to useAuth pattern)
export const useCrops = () => {
    const queryClient = useQueryClient();

    // Fetch all crops
    const cropsQuery = useQuery({
        queryKey: ["crops"],
        queryFn: cropsService.getCrops,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: false,
    });

    // Create crop mutation
    const createCrop = useMutation({
        mutationFn: cropsService.createCrop,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crops"] });
        },
    });

    // Update crop mutation
    const updateCrop = useMutation({
        mutationFn: cropsService.updateCrop,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crops"] });
        },
    });

    // Delete crop mutation
    const deleteCrop = useMutation({
        mutationFn: cropsService.deleteCrop,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crops"] });
        },
    });

    return {
        ...cropsQuery,
        createCrop,
        updateCrop,
        deleteCrop,
    };
};
