import { useState } from "react";
import { Plus, Package } from "lucide-react";
import {
    Button,
    FarmerInventoryCard,
    BuyerInventoryCard,
    AddItemModal,
    EditItemModal,
    DeleteItemModal,
} from "@/components";

// Updated sample data - removed unit field to match CropModel
const sampleFarmerItems = [
    {
        id: 1,
        name: "Organic Tomatoes",
        initialWeight: 500, // kg implied
        currentWeight: 500,
        pricePerUnit: 120.5,
        status: "available",
        harvestDate: "2024-06-15",
        expiryDate: "2024-07-01",
    },
    {
        id: 2,
        name: "Fresh Lettuce",
        initialWeight: 200,
        currentWeight: 150,
        pricePerUnit: 85.0,
        status: "available",
        harvestDate: "2024-06-20",
        expiryDate: "2024-06-30",
    },
    {
        id: 3,
        name: "Sweet Corn",
        initialWeight: 1000,
        currentWeight: 900,
        pricePerUnit: 45.75,
        status: "sold",
        harvestDate: "2024-06-18",
        expiryDate: "2024-07-05",
    },
    {
        id: 4,
        name: "Baby Carrots",
        initialWeight: 300,
        currentWeight: 200,
        pricePerUnit: 65.0,
        status: "matched",
        harvestDate: "2024-06-22",
        expiryDate: "2024-07-08",
    },
    {
        id: 5,
        name: "Fresh Spinach",
        initialWeight: 150,
        currentWeight: 150,
        pricePerUnit: 180.0,
        status: "available",
        harvestDate: "2024-06-25",
        expiryDate: "2024-07-02",
    },
    {
        id: 6,
        name: "Bell Peppers",
        initialWeight: 250,
        currentWeight: 100,
        pricePerUnit: 140.5,
        status: "expired",
        harvestDate: "2024-06-20",
        expiryDate: "2024-07-05",
    },
];

// Buyer items - removed unit field to match CropModel
const sampleBuyerItems = [
    {
        id: 1,
        name: "Fresh Carrots",
        weightNedeed: 300, // kg implied
        BudgetPerUnit: 65.0,
        dateNeeded: "2024-07-10",
        expiryDate: "2024-07-15",
    },
    {
        id: 2,
        name: "Organic Spinach",
        weightNedeed: 150,
        BudgetPerUnit: 180.0,
        dateNeeded: "2024-07-15",
        expiryDate: "2024-07-20",
    },
    {
        id: 3,
        name: "Bell Peppers",
        weightNedeed: 200,
        BudgetPerUnit: 125.0,
        dateNeeded: "2024-07-12",
        expiryDate: "2024-07-18",
    },
    {
        id: 4,
        name: "Fresh Tomatoes",
        weightNedeed: 400,
        BudgetPerUnit: 100.0,
        dateNeeded: "2024-07-08",
        expiryDate: "2024-07-14",
    },
    {
        id: 5,
        name: "Sweet Corn",
        weightNedeed: 500,
        BudgetPerUnit: 40.0,
        dateNeeded: "2024-07-20",
        expiryDate: "2024-07-25",
    },
    {
        id: 6,
        name: "Baby Lettuce",
        weightNedeed: 100,
        BudgetPerUnit: 75.0,
        dateNeeded: "2024-07-14",
        expiryDate: "2024-07-20",
    },
];

function Inventory() {
    const [userType, setUserType] = useState("farmer");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const inventoryData =
        userType === "farmer" ? sampleFarmerItems : sampleBuyerItems;

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

    const handleDeleteConfirm = (item) => {
        // TODO: Handle actual deletion when backend is ready
        console.log("Confirmed delete:", item);
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                            Inventory
                        </h1>
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
                            {userType === "farmer" ? "Buyer" : "Farmer"}
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
                        {userType === "farmer" ? "My Crops" : "My Stock"}
                    </h2>

                    {inventoryData.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                No{" "}
                                {userType === "farmer"
                                    ? "crops"
                                    : "requirements"}{" "}
                                yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {userType === "farmer"
                                    ? "Start by adding your first crop to your inventory."
                                    : "Start by adding your first purchase requirement."}
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
                                        key={item.id}
                                        item={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <BuyerInventoryCard
                                        key={item.id}
                                        item={item}
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
