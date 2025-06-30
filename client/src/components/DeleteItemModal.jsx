import { Trash2, AlertTriangle } from "lucide-react";
import Button from "./Button";

function DeleteItemModal({ isOpen, onClose, userType, item, onConfirm }) {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDelete = () => {
        console.log("Delete item:", item);
        // TODO: Handle actual deletion when backend is ready
        onConfirm?.(item);
        onClose();
    };

    // Use correct name field for both types
    const itemName = item?.name;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 z-40"
                onClick={handleBackdropClick}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl w-full max-w-md">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Delete{" "}
                                    {userType === "farmer"
                                        ? "Crop"
                                        : "Requirement"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                    "{itemName}"
                                </span>
                                ?
                            </p>
                            {userType === "farmer" ? (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">
                                                Current/Initial Weight:
                                            </span>{" "}
                                            {item?.currentWeight} /{" "}
                                            {item?.initialWeight} kg
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Price:
                                            </span>{" "}
                                            ₱{item?.pricePerUnit}/kg
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Status:
                                            </span>{" "}
                                            {item?.status}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">
                                                Weight Needed:
                                            </span>{" "}
                                            {item?.weightNedeed} kg
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Budget:
                                            </span>{" "}
                                            ₱{item?.BudgetPerUnit}/kg
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Date Needed:
                                            </span>{" "}
                                            {item?.dateNeeded
                                                ? new Date(
                                                      item.dateNeeded
                                                  ).toLocaleDateString()
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
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
                                type="button"
                                variant="danger"
                                size="md"
                                onClick={handleDelete}
                                className="flex-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteItemModal;
