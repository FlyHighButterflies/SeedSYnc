import {
    MapPin,
    Star,
    Package,
    Phone,
    Mail,
    Truck,
    Clock,
    X,
    MessageCircle,
    Award,
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
    const [reviewDescription, setReviewDescription] = useState("");

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmitRating = (e) => {
        e.preventDefault();
        if (rating === 0) return;

        const reviewData = {
            userId: user.id,
            rating,
            description: reviewDescription.trim(),
            timestamp: new Date(),
        };

        console.log("Review submitted:", reviewData);
        // TODO: Add API call to submit review

        // Reset form and close
        setRating(0);
        setReviewDescription("");
        setShowRatingForm(false);
        onClose();
    };

    const handleViewProfile = () => {
        onClose();
        window.open(`/profile/${user.id}`, "_blank", "noopener,noreferrer");
    };

    const handleRateUser = () => {
        setShowRatingForm(true);
    };

    const handleCancelRating = () => {
        setRating(0);
        setReviewDescription("");
        setShowRatingForm(false);
    };

    // Extract region and country from address (assumes "street, city, region, country")
    const getRegionCountry = (address) => {
        if (!address) return "Location not specified";
        const parts = address.split(",").map((s) => s.trim());
        if (parts.length >= 2) {
            return parts.slice(-2).join(", ");
        }
        return address;
    };

    return (
        <>
            {/* Fixed backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
                onClick={handleBackdropClick}
            >
                {/* Fixed modal positioning */}
                <div
                    className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close X button - top right */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="p-6">
                        {/* Avatar and basic info */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-normalGreen to-darkGreen rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {user.fullName
                                    ? user.fullName
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                    : user.firstName?.charAt(0) ||
                                      user.name?.charAt(0) ||
                                      user.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-xl text-darkGreen break-words">
                                    {user.fullName ||
                                        (user.firstName && user.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : user.name || "Unknown User")}
                                </h3>
                                <p className="text-sm text-gray-600 capitalize">
                                    {user.role ||
                                        user.userType ||
                                        user.type ||
                                        "Trader"}
                                </p>
                                <StarRating
                                    rating={
                                        typeof user.rating === "number"
                                            ? user.rating
                                            : 0
                                    }
                                />
                            </div>
                        </div>

                        {/* Location & Contact */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 break-words">
                                    {getRegionCountry(user.address)}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">
                                    {typeof user.trades === "number"
                                        ? user.trades
                                        : 0}{" "}
                                    successful trades
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 break-all">
                                    {user.contactNumber ||
                                        "Contact not available"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 break-all">
                                    {user.email || "Email not available"}
                                </span>
                            </div>
                            {user.transportation && (
                                <div className="flex items-center gap-3">
                                    <Truck className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 capitalize">
                                        Transportation: {user.transportation}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Products Section */}
                        <div className="mb-6">
                            {user.userType === "farmer" ||
                            user.type === "farmer" ? (
                                <>
                                    {/* Current Products */}
                                    {user.products &&
                                        user.products.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="font-medium text-gray-900 mb-2">
                                                    Current Products
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.products.map(
                                                        (product, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-lightGreen text-darkGreen text-xs rounded-full"
                                                            >
                                                                {product}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Single Certification */}
                                    {user.certifications && (
                                        <div className="mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">
                                                Certification
                                            </h5>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1 w-fit">
                                                <Award className="w-3 h-3" />
                                                {user.certifications}
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Products Needed */}
                                    {user.productsNeeded &&
                                        user.productsNeeded.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="font-medium text-gray-900 mb-2">
                                                    Products Needed
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.productsNeeded.map(
                                                        (product, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                                                            >
                                                                {product}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {user.quantityRange && (
                                        <div className="mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">
                                                Quantity Range
                                            </h5>
                                            <p className="text-sm text-gray-700">
                                                {user.quantityRange}
                                            </p>
                                        </div>
                                    )}

                                    {user.frequency && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm text-gray-700 capitalize">
                                                    Purchase Frequency:{" "}
                                                    {user.frequency}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Enhanced Rating Form with Description */}
                        {showRatingForm ? (
                            <form
                                onSubmit={handleSubmitRating}
                                className="mb-6 p-4 bg-gray-50 rounded-lg"
                            >
                                <h5 className="font-medium text-gray-900 mb-3">
                                    Write a Review
                                </h5>

                                {/* Star Rating */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rating *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() =>
                                                    setHoveredRating(star)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredRating(0)
                                                }
                                                className="transition-colors"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${
                                                        star <=
                                                        (hoveredRating ||
                                                            rating)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {rating > 0 &&
                                                `${rating} star${
                                                    rating > 1 ? "s" : ""
                                                }`}
                                        </span>
                                    </div>
                                </div>

                                {/* Review Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Review (Optional)
                                    </label>
                                    <textarea
                                        value={reviewDescription}
                                        onChange={(e) =>
                                            setReviewDescription(e.target.value)
                                        }
                                        placeholder="Share your experience working with this user..."
                                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-normalGreen focus:border-transparent"
                                        rows="4"
                                        maxLength="500"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        {reviewDescription.length}/500
                                        characters
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="sm"
                                        disabled={rating === 0}
                                    >
                                        Submit Review
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleCancelRating}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            /* Action Buttons */
                            <div className="space-y-3">
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
                                        View Profile
                                    </Button>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="md"
                                    className="w-full"
                                    onClick={handleRateUser}
                                >
                                    <Star className="w-4 h-4" />
                                    Write Review
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserModal;
