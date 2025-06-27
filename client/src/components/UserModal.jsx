import {
    X,
    MapPin,
    Package,
    Phone,
    Mail,
    MessageCircle,
    Star,
    Award,
    Truck,
    Clock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

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
    const navigate = useNavigate();
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmitRating = (e) => {
        e.preventDefault();
        if (rating === 0) return;

        const ratingData = {
            userId: user.id,
            rating,
            timestamp: new Date(),
        };

        console.log("Rating submitted:", ratingData);
        // TODO: Add API call to submit rating

        // Reset form and close
        setRating(0);
        setShowRatingForm(false);
        onClose();
    };

    const handleViewProfile = () => {
        onClose();
        window.open(`/profile/${user.id}`, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 ${
                    isOpen ? "block" : "hidden"
                }`}
                onClick={handleBackdropClick}
            ></div>

            <div className="fixed inset-0 flex items-center justify-center z-40 p-2 sm:p-4">
                <div className="bg-white rounded-xl w-full max-w-sm sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto m-2">
                    <div className="p-6">
                        {!showRatingForm ? (
                            <>
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                        Trader Profile
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

                                {/* Profile Section */}
                                <div className="text-center mb-4 sm:mb-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-3 sm:mb-4">
                                        {user.firstName?.charAt(0) ||
                                            user.name?.charAt(0) ||
                                            "U"}
                                        {user.lastName?.charAt(0) || ""}
                                    </div>
                                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                        {user.firstName && user.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : user.name || "Unknown User"}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 capitalize">
                                        {user.userType || user.type || "Trader"}
                                    </p>
                                    <StarRating rating={user.rating || 0} />
                                </div>

                                {/* Location & Contact */}
                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-gray-700 break-words">
                                            {user.city && user.province
                                                ? `${user.city}, ${user.province}`
                                                : user.location ||
                                                  "Location not specified"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-gray-700">
                                            {user.totalTrades || 0} successful
                                            trades
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-gray-700 break-all">
                                            {user.contactNumber ||
                                                "Contact not available"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-gray-700 break-all">
                                            {user.email ||
                                                "Email not available"}
                                        </span>
                                    </div>
                                    {user.transportation && (
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <span className="text-xs sm:text-sm text-gray-700 capitalize">
                                                Transportation:{" "}
                                                {user.transportation}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Specialties/Products */}
                                <div className="mb-4 sm:mb-6">
                                    {user.userType === "farmer" ||
                                    user.type === "farmer" ? (
                                        <>
                                            {user.specialties &&
                                                user.specialties.length > 0 && (
                                                    <div className="mb-4">
                                                        <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                            Specialties
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.specialties.map(
                                                                (
                                                                    specialty,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                                    >
                                                                        {
                                                                            specialty
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            {user.certifications &&
                                                user.certifications.length >
                                                    0 && (
                                                    <div className="mb-4">
                                                        <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                            Certifications
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.certifications.map(
                                                                (
                                                                    cert,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                                                                    >
                                                                        <Award className="w-3 h-3" />
                                                                        {cert}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </>
                                    ) : (
                                        <>
                                            {user.productsNeeded &&
                                                user.productsNeeded.length >
                                                    0 && (
                                                    <div className="mb-4">
                                                        <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                            Products Needed
                                                        </h5>
                                                        <div className="flex flex-wrap gap-2">
                                                            {user.productsNeeded.map(
                                                                (
                                                                    product,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                                                                    >
                                                                        {
                                                                            product
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            {user.quantityRange && (
                                                <div className="mb-4">
                                                    <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                                                        Quantity Range
                                                    </h5>
                                                    <p className="text-xs sm:text-sm text-gray-700">
                                                        {user.quantityRange}
                                                    </p>
                                                </div>
                                            )}
                                            {user.frequency && (
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <span className="text-xs sm:text-sm text-gray-700 capitalize">
                                                            Purchase Frequency:{" "}
                                                            {user.frequency}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="flex-1"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Start Chat
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="md"
                                            className="flex-1"
                                            onClick={handleViewProfile}
                                        >
                                            View Full Profile
                                        </Button>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="md"
                                        className="w-full"
                                        onClick={() => setShowRatingForm(true)}
                                    >
                                        <Star className="w-4 h-4" />
                                        Rate User
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Rating Form - Same as before */}
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Rate {user.firstName || user.name}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowRatingForm(false)}
                                        className="p-1 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                                        {user.firstName?.charAt(0) ||
                                            user.name?.charAt(0) ||
                                            "U"}
                                        {user.lastName?.charAt(0) || ""}
                                    </div>
                                    <h4 className="font-semibold text-gray-900">
                                        {user.firstName && user.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : user.name || "Unknown User"}
                                    </h4>
                                </div>

                                <form
                                    onSubmit={handleSubmitRating}
                                    className="space-y-6"
                                >
                                    {/* Star Rating */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-4">
                                            How would you rate this trader?
                                        </p>
                                        <div className="flex justify-center gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setRating(star)
                                                    }
                                                    onMouseEnter={() =>
                                                        setHoveredRating(star)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredRating(0)
                                                    }
                                                    className="p-1 transition-all duration-200 hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-10 h-10 ${
                                                            star <=
                                                            (hoveredRating ||
                                                                rating)
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="md"
                                            onClick={() =>
                                                setShowRatingForm(false)
                                            }
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            disabled={rating === 0}
                                            className="flex-1"
                                        >
                                            Submit Rating
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserModal;
