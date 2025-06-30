import { Edit3, Trash2, DollarSign, Clock } from "lucide-react";
import Button from "./Button";

function BuyerInventoryCard({ item, onEdit, onDelete }) {
    return (
        <div className="flex flex-col w-72 h-80 bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:cursor-pointer transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.name.charAt(0)}
                </div>
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {item.name}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Need: {item.weightNedeed} kg
            </p>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Budget: ₱{item.BudgetPerUnit}/kg</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                        Due: {new Date(item.dateNeeded).toLocaleDateString()}
                    </span>
                </div>
                {item.expiryDate && (
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                            Expires:{" "}
                            {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
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

export default BuyerInventoryCard;
