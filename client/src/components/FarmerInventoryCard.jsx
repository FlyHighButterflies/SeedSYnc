import { Package, Edit3, Trash2, DollarSign, Clock } from "lucide-react";
import Button from "./Button";

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

export default FarmerInventoryCard;
