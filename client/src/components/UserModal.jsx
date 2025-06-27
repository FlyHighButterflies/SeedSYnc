import {
    X,
    MapPin,
    Package,
    Phone,
    Mail,
    MessageCircle,
    Star,
} from "lucide-react";

// StarRating component
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${
                        star <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                    }`}
                />
            ))}
            <span className="text-sm text-gray-600 ml-1">({rating})</span>
        </div>
    );
};

function UserModal({ user, isOpen, onClose }) {
    if (!isOpen) return null;

    // Handle click outside modal to close
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 ${
                    isOpen ? "block" : "hidden"
                }`}
                onClick={handleBackdropClick}
            ></div>

            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center z-40 p-2 sm:p-4">
                <div className="bg-white rounded-xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto m-2">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                Trader Profile
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="text-center mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-3 sm:mb-4">
                                {user.avatar}
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                {user.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                {user.type}
                            </p>
                            <StarRating rating={user.rating} />
                        </div>

                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700 break-words">
                                    {user.location}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700">
                                    {user.totalTrades || 25} successful trades
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700 break-all">
                                    {user.phone || "+1 (555) 123-4567"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-700 break-all">
                                    {user.email || "jane.doe@example.com"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                Specialty
                            </h5>
                            <p className="text-xs sm:text-sm text-gray-700 mb-3">
                                {user.specialty ||
                                    "Organic farming and sustainable agriculture"}
                            </p>
                            <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                Current Offer
                            </h5>
                            <p className="text-xs sm:text-sm text-gray-700 mb-3">
                                "{user.trade}"
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button className="w-full bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                                <MessageCircle className="w-4 h-4" />
                                Start Chat
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base">
                                View Full Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserModal;
