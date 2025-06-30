import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { useCrops } from "@/hooks";

function AddItemModal({ isOpen, onClose, userType }) {
    const [formData, setFormData] = useState({
        // Farmer fields
        name: "",
        initialWeight: "",
        currentWeight: "",
        pricePerUnit: "",
        harvestDate: "",
        expiryDate: "",
        // Buyer fields
        weightNedeed: "",
        BudgetPerUnit: "",
        dateNeeded: "",
    });

    const { createCrop } = useCrops();

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            initialWeight: "",
            currentWeight: "",
            pricePerUnit: "",
            harvestDate: "",
            expiryDate: "",
            weightNedeed: "",
            BudgetPerUnit: "",
            dateNeeded: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data for backend - exactly matching CropModel
        let payload;
        if (userType === "farmer") {
            payload = {
                name: formData.name,
                initialWeight: Number(formData.initialWeight),
                currentWeight: Number(formData.currentWeight),
                pricePerUnit: Number(formData.pricePerUnit),
                harvestDate: formData.harvestDate,
                expiryDate: formData.expiryDate,
            };
        } else {
            payload = {
                name: formData.name,
                weightNedeed: Number(formData.weightNedeed),
                BudgetPerUnit: Number(formData.BudgetPerUnit),
                dateNeeded: formData.dateNeeded,
                expiryDate: formData.expiryDate,
            };
        }

        try {
            await createCrop.mutateAsync(payload);
            resetForm();
            onClose();
        } catch (error) {
            // Error handling is done in the hook
            console.error("Failed to create crop:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleClose = () => {
        if (!createCrop.isPending) {
            resetForm();
            onClose();
        }
    };

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
                                {userType === "farmer"
                                    ? "Add New Crop"
                                    : "Add New Requirement"}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="p-1 rounded-full"
                                disabled={createCrop.isPending}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {userType === "farmer" ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Product Name
                                        </label>
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
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Initial Weight (kg)
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Initial Weight in kg"
                                            value={formData.initialWeight}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "initialWeight",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Current Weight (kg)
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Current Weight in kg"
                                            value={formData.currentWeight}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "currentWeight",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Price per Unit (₱/kg)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price per kg"
                                            value={formData.pricePerUnit}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "pricePerUnit",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Harvest Date
                                        </label>
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
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Expiry Date
                                        </label>
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
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Product Name
                                        </label>
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
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Weight Needed (kg)
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Weight Needed in kg"
                                            value={formData.weightNedeed}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "weightNedeed",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Budget per Unit (₱/kg)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Budget per kg"
                                            value={formData.BudgetPerUnit}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "BudgetPerUnit",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Date Needed
                                        </label>
                                        <Input
                                            type="date"
                                            placeholder="Date Needed"
                                            value={formData.dateNeeded}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "dateNeeded",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Expiry Date
                                        </label>
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
                                            disabled={createCrop.isPending}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={handleClose}
                                    className="flex-1"
                                    disabled={createCrop.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    className="flex-1"
                                    disabled={createCrop.isPending}
                                >
                                    {createCrop.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    {createCrop.isPending
                                        ? "Adding..."
                                        : `Add ${
                                              userType === "farmer"
                                                  ? "Crop"
                                                  : "Requirement"
                                          }`}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddItemModal;
