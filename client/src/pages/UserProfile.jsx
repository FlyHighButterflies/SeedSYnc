import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Star,
    Package,
    Clock,
    Award,
    Truck,
    Settings,
    MessageCircle,
    X,
} from "lucide-react";
import Button from "@/components/Button";

// Updated sample data to match SignUp Step 3 structure
const sampleUserData = {
    // Personal Info (Step 1)
    email: "john.santos@example.com",
    firstName: "John",
    lastName: "Santos",
    contactNumber: "+63 912 345 6789",
    profileImage: "/images/farmer-profile.jpg",

    // Location & Logistics (Step 3) - Match SignUp structure
    country: "Philippines",
    province: "Nueva Ecija",
    city: "Cabanatuan City",
    address: "123 Rice Field Road, Barangay Magsaysay",
    landmarks: "Near Cabanatuan Public Market",
    highway: "yes",
    port: "no",
    transportation: "truck",

    // Business Information (Step 4)
    userType: "farmer",
    certifications: "organic",
    farmingPractices: "sustainable",

    // System-generated fields
    joinDate: "2024-01-15",
    rating: 4.8,
    totalTrades: 45,
    totalCrops: 12,
    activeCrops: 8,
};

function ProfileCard({ icon, title, value, subtitle }) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="font-medium text-gray-900">{title}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            {subtitle && (
                <div className="text-sm text-gray-600">{subtitle}</div>
            )}
        </div>
    );
}

function InfoSection({ title, children }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {title}
            </h3>
            {children}
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 py-2">
            {icon}
            <span className="text-sm text-gray-600 w-28">{label}:</span>
            <span className="text-sm text-gray-900 flex-1 capitalize">
                {value}
            </span>
        </div>
    );
}

function RatingModal({ isOpen, onClose, userName, onSubmit }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState("");

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return;

        onSubmit({
            rating,
            description: reviewDescription.trim(),
        });

        // Reset form
        setRating(0);
        setReviewDescription("");
        onClose();
    };

    const handleClose = () => {
        setRating(0);
        setReviewDescription("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close X button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Write a Review
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Share your experience working with {userName}
                        </p>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Rating *
                            </label>
                            <div className="flex items-center justify-center gap-2 mb-2">
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
                                            className={`w-10 h-10 ${
                                                star <=
                                                (hoveredRating || rating)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <div className="text-center text-sm text-gray-600">
                                    {rating} star{rating > 1 ? "s" : ""}
                                </div>
                            )}
                        </div>

                        {/* Review Description */}
                        <div className="mb-6">
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
                                {reviewDescription.length}/500 characters
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                disabled={rating === 0}
                                className="flex-1"
                            >
                                Submit Review
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                onClick={handleClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);

    // Mock user data - replace with API call
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // TODO: Replace with actual API call
                setUserData(sampleUserData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleStartChat = () => {
        console.log("Starting chat with user:", userId);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleOpenRatingModal = () => {
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
    };

    const handleSubmitReview = (reviewData) => {
        const fullReviewData = {
            userId: userData.id || userId,
            ...reviewData,
            timestamp: new Date(),
        };

        console.log("Review submitted:", fullReviewData);
        // TODO: Add API call to submit review
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600">Loading profile...</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-lg text-gray-600 mb-4">User not found</div>
                <Button variant="outline" onClick={handleGoBack}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            User Profile
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGoBack}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleStartChat}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Start Chat
                        </Button>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="w-full max-w-7xl space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-normalGreen to-darkGreen rounded-full flex items-center justify-center text-white font-bold text-3xl">
                                    {userData.firstName.charAt(0)}
                                    {userData.lastName.charAt(0)}
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <p className="text-lg text-gray-600 mb-2 capitalize">
                                    {userData.userType}
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-6 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">
                                            {userData.rating}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {userData.totalTrades} completed trades
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Member since{" "}
                                    {new Date(
                                        userData.joinDate
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ProfileCard
                            icon={<Package className="w-5 h-5 text-blue-600" />}
                            title={
                                userData.userType === "farmer"
                                    ? "Active Crops"
                                    : "Active Needs"
                            }
                            value={
                                userData.userType === "farmer"
                                    ? userData.activeCrops
                                    : userData.activeRequirements || 0
                            }
                            subtitle={`${
                                userData.userType === "farmer"
                                    ? userData.totalCrops
                                    : userData.totalRequirements || 0
                            } total`}
                        />
                        <ProfileCard
                            icon={<Star className="w-5 h-5 text-yellow-600" />}
                            title="Rating"
                            value={userData.rating}
                            subtitle={`${userData.totalTrades} reviews`}
                        />
                        <ProfileCard
                            icon={<Clock className="w-5 h-5 text-green-600" />}
                            title="Total Trades"
                            value={userData.totalTrades}
                            subtitle="Completed deals"
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <InfoSection title="Contact Information">
                            <div className="space-y-3">
                                <InfoRow
                                    icon={
                                        <Mail className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Email"
                                    value={userData.email}
                                />
                                <InfoRow
                                    icon={
                                        <Phone className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Phone"
                                    value={userData.contactNumber}
                                />
                            </div>
                        </InfoSection>

                        {/* Location Information */}
                        <InfoSection title="Location & Logistics">
                            <div className="space-y-3">
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Country"
                                    value={userData.country}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Province"
                                    value={userData.province}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="City"
                                    value={userData.city}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Address"
                                    value={userData.address}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Landmarks"
                                    value={userData.landmarks}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Highway Access"
                                    value={userData.highway}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Port Access"
                                    value={userData.port}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Transportation"
                                    value={userData.transportation}
                                />
                            </div>
                        </InfoSection>

                        {/* Business Information */}
                        {userData.userType === "farmer" ? (
                            <InfoSection title="Business Information">
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={
                                            <Award className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Certification"
                                        value={
                                            userData.certifications || "None"
                                        }
                                    />
                                    <InfoRow
                                        icon={
                                            <Settings className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Farming Practice"
                                        value={
                                            userData.farmingPractices ||
                                            "Not specified"
                                        }
                                    />
                                </div>
                            </InfoSection>
                        ) : (
                            <InfoSection title="Purchase Preferences">
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={
                                            <Award className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Quality Standards"
                                        value={
                                            userData.qualityStandards || "Any"
                                        }
                                    />
                                    <InfoRow
                                        icon={
                                            <Clock className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Purchase Frequency"
                                        value={
                                            userData.frequency || "As needed"
                                        }
                                    />
                                </div>
                            </InfoSection>
                        )}

                        {/* Rate User Section */}
                        <InfoSection title="Rate This User">
                            <div className="space-y-3">
                                <div className="text-center py-8">
                                    <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">
                                        Share your experience working with this user
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleOpenRatingModal}
                                    >
                                        <Star className="w-4 h-4" />
                                        Write Review
                                    </Button>
                                </div>
                            </div>
                        </InfoSection>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={handleCloseRatingModal}
                userName={`${userData.firstName} ${userData.lastName}`}
                onSubmit={handleSubmitReview}
            />
        </div>
    );
}

export default UserProfile;
