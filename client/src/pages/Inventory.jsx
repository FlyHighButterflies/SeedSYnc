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

// Sample data for demo
const sampleFarmerItems = [
    {
        id: 1,
        name: "Organic Tomatoes",
        quantity: 500,
        unit: "kg",
        price: 120.5,
        status: "Available",
        harvestDate: "2024-06-15",
        expiryDate: "2024-07-01",
    },
    {
        id: 2,
        name: "Fresh Lettuce",
        quantity: 200,
        unit: "kg",
        price: 85.0,
        status: "Low Stock",
        harvestDate: "2024-06-20",
        expiryDate: "2024-06-30",
    },
    {
        id: 3,
        name: "Sweet Corn",
        quantity: 1000,
        unit: "kg",
        price: 45.75,
        status: "Available",
        harvestDate: "2024-06-18",
        expiryDate: "2024-07-05",
    },
    {
        id: 4,
        name: "Baby Carrots",
        quantity: 300,
        unit: "kg",
        price: 65.0,
        status: "Available",
        harvestDate: "2024-06-22",
        expiryDate: "2024-07-08",
    },
    {
        id: 5,
        name: "Fresh Spinach",
        quantity: 150,
        unit: "kg",
        price: 180.0,
        status: "Available",
        harvestDate: "2024-06-25",
        expiryDate: "2024-07-02",
    },
    {
        id: 6,
        name: "Bell Peppers",
        quantity: 250,
        unit: "kg",
        price: 140.5,
        status: "Low Stock",
        harvestDate: "2024-06-20",
        expiryDate: "2024-07-05",
    },
];

const sampleBuyerItems = [
    {
        id: 1,
        productName: "Fresh Carrots",
        quantityNeeded: 300,
        unit: "kg",
        budgetPerUnit: 65.0,
        neededBy: "2024-07-10",
        urgency: "High",
    },
    {
        id: 2,
        productName: "Organic Spinach",
        quantityNeeded: 150,
        unit: "kg",
        budgetPerUnit: 180.0,
        neededBy: "2024-07-15",
        urgency: "Medium",
    },
    {
        id: 3,
        productName: "Bell Peppers",
        quantityNeeded: 200,
        unit: "kg",
        budgetPerUnit: 125.0,
        neededBy: "2024-07-12",
        urgency: "Low",
    },
    {
        id: 4,
        productName: "Fresh Tomatoes",
        quantityNeeded: 400,
        unit: "kg",
        budgetPerUnit: 100.0,
        neededBy: "2024-07-08",
        urgency: "High",
    },
    {
        id: 5,
        productName: "Sweet Corn",
        quantityNeeded: 500,
        unit: "kg",
        budgetPerUnit: 40.0,
        neededBy: "2024-07-20",
        urgency: "Medium",
    },
    {
        id: 6,
        productName: "Baby Lettuce",
        quantityNeeded: 100,
        unit: "kg",
        budgetPerUnit: 75.0,
        neededBy: "2024-07-14",
        urgency: "Low",
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
