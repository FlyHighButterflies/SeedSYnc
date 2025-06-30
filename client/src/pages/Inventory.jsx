import { useState } from "react";
import { Plus, Package, Loader2 } from "lucide-react";
import {
    Button,
    FarmerInventoryCard,
    BuyerInventoryCard,
    AddItemModal,
    EditItemModal,
    DeleteItemModal,
} from "@/components";
import { useInventory } from "@/hooks";

// Sample data for when backend isn't available
const sampleInventoryData = {
    userId: "sample-user-id",
    role: "farmer",
    crops: [
        // Farmer crops
        {
            cropId: "crop-1",
            name: "Rice",
            status: "available",
            pricePerUnit: 25.5,
            harvestDate: "2024-12-01",
            initialWeight: 500,
            currentWeight: 450,
            expiryDate: "2025-02-01",
            createdAt: "2024-12-01",
            farmerId: "farmer-1",
        },
        {
            cropId: "crop-2",
            name: "Corn",
            status: "available",
            pricePerUnit: 18.75,
            harvestDate: "2024-11-15",
            initialWeight: 300,
            currentWeight: 280,
            expiryDate: "2025-01-15",
            createdAt: "2024-11-15",
            farmerId: "farmer-1",
        },
        {
            cropId: "crop-3",
            name: "Tomatoes",
            status: "sold",
            pricePerUnit: 35.0,
            harvestDate: "2024-12-10",
            initialWeight: 100,
            currentWeight: 0,
            expiryDate: "2024-12-25",
            createdAt: "2024-12-10",
            farmerId: "farmer-1",
        },
        // Buyer requirements
        {
            cropId: "req-1",
            name: "Cabbage",
            status: "needed",
            weightNedeed: 200,
            BudgetPerUnit: 15.0,
            dateNeeded: "2025-01-15",
            expiryDate: "2025-01-30",
            buyerId: "buyer-1",
        },
        {
            cropId: "req-2",
            name: "Carrots",
            status: "needed",
            weightNedeed: 150,
            BudgetPerUnit: 22.5,
            dateNeeded: "2025-01-20",
            expiryDate: "2025-02-05",
            buyerId: "buyer-1",
        },
    ],
};

function Inventory() {
    const [userType, setUserType] = useState("farmer");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Use inventory hook with fallback to sample data
    const {
        inventory,
        crops,
        isLoading,
        error,
        removeCropFromInventory,
    } = useInventory();

    // Use sample data if there's an error or no data
    const actualInventory = inventory || sampleInventoryData;
    const actualCrops = crops.length > 0 ? crops : sampleInventoryData.crops;

    // Filter crops based on user type and inventory role
    const inventoryData = actualCrops.filter((crop) => {
        if (userType === "farmer") {
            // Show crops that have farmer-specific fields
            return (
                crop.pricePerUnit !== undefined &&
                crop.harvestDate !== undefined &&
                crop.initialWeight !== undefined
            );
        } else {
            // Show crops that have buyer-specific fields
            return (
                crop.weightNedeed !== undefined &&
                crop.BudgetPerUnit !== undefined &&
                crop.dateNeeded !== undefined
            );
        }
    });

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            // Remove crop from inventory using the crop ID
            if (removeCropFromInventory) {
                await removeCropFromInventory.mutateAsync(item.cropId);
            }
            console.log("Crop deleted from inventory:", item);
        } catch (error) {
            console.error("Failed to delete crop:", error);
        }
    };

    // Loading state (only show if actually loading, not for sample data)
    if (isLoading && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-normalGreen" />
                    <span>Loading inventory...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                            Inventory
                        </h1>
                        <p className="text-gray-600">
                            Role: {actualInventory.role} • Total Crops:{" "}
                            {actualCrops.length}
                            {error && (
                                <span className="text-orange-600 ml-2">
                                    (Using sample data - Backend not connected)
                                </span>
                            )}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setUserType(
                                    userType === "farmer" ? "buyer" : "farmer"
                                )
                            }
                        >
                            Switch to{" "}
                            {userType === "farmer" ? "Buyer" : "Farmer"} View
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleAdd}>
                            <Plus className="w-4 h-4" />
                            {userType === "farmer" ? "Add Crop" : "Add Need"}
                        </Button>
                    </div>
                </div>

                {/* Inventory Grid */}
                <div className="w-full max-w-7xl">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        {userType === "farmer" ? "My Crops" : "My Requirements"}
                        {inventoryData.length > 0 && (
                            <span className="text-sm font-normal text-gray-600 ml-2">
                                ({inventoryData.length} items)
                            </span>
                        )}
                    </h2>

                    {inventoryData.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                No{" "}
                                {userType === "farmer"
                                    ? "crops"
                                    : "requirements"}{" "}
                                in {userType} view
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {userType === "farmer"
                                    ? "Your inventory doesn't have any farmer crops yet."
                                    : "Your inventory doesn't have any buyer requirements yet."}
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAdd}
                            >
                                {userType === "farmer"
                                    ? "Add Your First Crop"
                                    : "Add Your First Requirement"}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 justify-items-center">
                            {inventoryData.map((item) =>
                                userType === "farmer" ? (
                                    <FarmerInventoryCard
                                        key={item.cropId}
                                        item={{
                                            // Map inventory crop to expected format
                                            _id: item.cropId,
                                            id: item.cropId,
                                            name: item.name,
                                            initialWeight: item.initialWeight,
                                            currentWeight: item.currentWeight,
                                            pricePerUnit: item.pricePerUnit,
                                            status: item.status,
                                            harvestDate: item.harvestDate,
                                            expiryDate: item.expiryDate,
                                            createdAt: item.createdAt,
                                            farmerId: item.farmerId,
                                        }}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <BuyerInventoryCard
                                        key={item.cropId}
                                        item={{
                                            // Map inventory crop to expected format
                                            _id: item.cropId,
                                            id: item.cropId,
                                            name: item.name,
                                            weightNedeed: item.weightNedeed,
                                            BudgetPerUnit: item.BudgetPerUnit,
                                            dateNeeded: item.dateNeeded,
                                            expiryDate: item.expiryDate,
                                            status: item.status,
                                            buyerId: item.buyerId,
                                        }}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                userType={userType}
            />

            <EditItemModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userType={userType}
                item={selectedItem}
            />

            <DeleteItemModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                userType={userType}
                item={selectedItem}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}

export default Inventory;
