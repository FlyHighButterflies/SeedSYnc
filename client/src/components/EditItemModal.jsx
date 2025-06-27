import { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Dropdown from "./Dropdown";

function EditItemModal({ isOpen, onClose, userType, item }) {
    const [formData, setFormData] = useState({
        // Farmer fields
        name: "",
        quantity: "",
        unit: "kg",
        price: "",
        status: "Available",
        harvestDate: "",
        expiryDate: "",
        // Buyer fields
        productName: "",
        quantityNeeded: "",
        budgetPerUnit: "",
        neededBy: "",
        urgency: "Medium",
    });

    useEffect(() => {
        if (item && isOpen) {
            if (userType === "farmer") {
                setFormData({
                    name: item.name || "",
                    quantity: item.quantity || "",
                    unit: item.unit || "kg",
                    price: item.price || "",
                    status: item.status || "Available",
                    harvestDate: item.harvestDate || "",
                    expiryDate: item.expiryDate || "",
                });
            } else {
                setFormData({
                    productName: item.productName || "",
                    quantityNeeded: item.quantityNeeded || "",
                    unit: item.unit || "kg",
                    budgetPerUnit: item.budgetPerUnit || "",
                    neededBy: item.neededBy || "",
                    urgency: item.urgency || "Medium",
                });
            }
        }
    }, [item, isOpen, userType]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Edit item:", { ...item, ...formData });
        // TODO: Handle actual submission when backend is ready
        onClose();
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const unitOptions = [
        { label: "kg", value: "kg" },
        { label: "lbs", value: "lbs" },
        { label: "tons", value: "tons" },
        { label: "pieces", value: "pieces" },
    ];

    const statusOptions = [
        { label: "Available", value: "Available" },
        { label: "Low Stock", value: "Low Stock" },
        { label: "Out of Stock", value: "Out of Stock" },
    ];

    const urgencyOptions = [
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" },
    ];

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 z-40"
                onClick={handleBackdropClick}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                Edit{" "}
                                {userType === "farmer" ? "Crop" : "Requirement"}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="p-1 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {userType === "farmer" ? (
                                <>
                                    <Input
                                        type="text"
                                        placeholder="Product Name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Quantity"
                                            value={formData.quantity}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="flex-1"
                                            required
                                        />
                                        <Dropdown
                                            value={formData.unit}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "unit",
                                                    e.target.value
                                                )
                                            }
                                            options={unitOptions}
                                            className="w-24"
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Price per unit"
                                        value={formData.price}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Dropdown
                                        value={formData.status}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        options={statusOptions}
                                        placeholder="Status"
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Harvest Date"
                                        value={formData.harvestDate}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "harvestDate",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Expiry Date"
                                        value={formData.expiryDate}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "expiryDate",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </>
                            ) : (
                                <>
                                    <Input
                                        type="text"
                                        placeholder="Product Name"
                                        value={formData.productName}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "productName",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Quantity Needed"
                                            value={formData.quantityNeeded}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "quantityNeeded",
                                                    e.target.value
                                                )
                                            }
                                            className="flex-1"
                                            required
                                        />
                                        <Dropdown
                                            value={formData.unit}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "unit",
                                                    e.target.value
                                                )
                                            }
                                            options={unitOptions}
                                            className="w-24"
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Budget per unit"
                                        value={formData.budgetPerUnit}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "budgetPerUnit",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Needed By"
                                        value={formData.neededBy}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "neededBy",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <Dropdown
                                        value={formData.urgency}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "urgency",
                                                e.target.value
                                            )
                                        }
                                        options={urgencyOptions}
                                        placeholder="Urgency"
                                    />
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    className="flex-1"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditItemModal;
