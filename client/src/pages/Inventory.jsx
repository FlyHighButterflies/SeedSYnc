import { useState } from "react";
import { Plus, Package, Edit3, Trash2, DollarSign, Clock } from "lucide-react";
import Button from "@/components";

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

function FarmerInventoryCard({ item, onEdit, onDelete }) {
    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "text-green-600 bg-green-100";
            case "Low Stock":
                return "text-yellow-600 bg-yellow-100";
            case "Out of Stock":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="flex flex-col w-72 h-80 bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:cursor-pointer transition-shadow">
            {/* Header with status */}
            <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.name.charAt(0)}
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
                {item.name}
            </h3>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>
                        {item.quantity} {item.unit}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                        ₱{item.price}/{item.unit}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                        Exp: {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="flex-1"
                >
                    <Edit3 className="w-4 h-4" />
                    Edit
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="flex-1"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>
        </div>
    );
}

function BuyerInventoryCard({ item, onEdit, onDelete }) {
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case "High":
                return "text-red-600 bg-red-100";
            case "Medium":
                return "text-yellow-600 bg-yellow-100";
            case "Low":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="flex flex-col w-72 h-80 bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:cursor-pointer transition-shadow">
            {/* Header with urgency */}
            <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.productName.charAt(0)}
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                        item.urgency
                    )}`}
                >
                    {item.urgency}
                </span>
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {item.productName}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Need: {item.quantityNeeded} {item.unit}
            </p>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                        Budget: ₱{item.budgetPerUnit}/{item.unit}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                        Due: {new Date(item.neededBy).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="flex-1"
                >
                    <Edit3 className="w-4 h-4" />
                    Edit
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(item)}
                    className="flex-1"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
            </div>
        </div>
    );
}

function Inventory() {
    const [userType, setUserType] = useState("farmer"); // This would come from auth context

    const inventoryData =
        userType === "farmer" ? sampleFarmerItems : sampleBuyerItems;

    const handleAdd = () => {
        console.log("Add new item");
    };

    const handleEdit = (item) => {
        console.log("Edit item:", item);
    };

    const handleDelete = (item) => {
        console.log("Delete item:", item);
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                        {userType === "farmer" ? "My Crops" : "My Stock"}
                    </h2>

                    {inventoryData.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
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
        </div>
    );
}

export default Inventory;
