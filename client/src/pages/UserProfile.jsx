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
} from "lucide-react";
import Button from "@/components/Button";

// StarRating component
const StarRating = ({ rating, totalRatings = 0 }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${
                            star <= rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                    />
                ))}
            </div>
            <span className="text-lg font-semibold">{rating}</span>
            <span className="text-sm text-gray-600">
                ({totalRatings} ratings)
            </span>
        </div>
    );
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
            <span className="text-sm text-gray-900 flex-1">{value}</span>
        </div>
    );
}

function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock user data - replace with API call
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // TODO: Replace with actual API call
                // const response = await api.get(`/users/${userId}`);
                // setUserData(response.data);

                // Mock data for now
                const mockUser = {
                    id: userId,
                    firstName: "John",
                    lastName: "Santos",
                    email: "john.santos@example.com",
                    contactNumber: "+63 912 345 6789",
                    userType: "farmer",
                    city: "Cabanatuan City",
                    province: "Nueva Ecija",
                    address: "123 Rice Field Road, Barangay Magsaysay",
                    landmarks: "Near Cabanatuan Public Market",
                    transportation: "truck",
                    rating: 4.8,
                    totalTrades: 45,
                    joinDate: "2024-01-15",
                    specialties: ["Rice", "Corn", "Vegetables"],
                    certifications: ["Organic", "Non-GMO"],
                    farmingPractices: ["Sustainable", "Water Efficient"],
                    totalCrops: 12,
                    activeCrops: 8,
                    // For buyers:
                    productsNeeded: ["Rice", "Vegetables", "Fruits"],
                    quantityRange: "500-1000 kg",
                    frequency: "weekly",
                    qualityStandards: ["Organic", "Non-GMO"],
                };

                setUserData(mockUser);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleStartChat = () => {
        // TODO: Implement chat functionality
        console.log("Starting chat with user:", userId);
    };

    const handleGoBack = () => {
        navigate(-1);
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
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            User Profile
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="md"
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
                                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                                    {userData.firstName?.charAt(0)}
                                    {userData.lastName?.charAt(0)}
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
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                                    <StarRating
                                        rating={userData.rating}
                                        totalRatings={userData.totalTrades}
                                    />
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
                                    : userData.activeRequirements || 5
                            }
                            subtitle={`${
                                userData.userType === "farmer"
                                    ? userData.totalCrops
                                    : userData.totalRequirements || 12
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
                        {/* Left Column */}
                        <div className="space-y-6">
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
                                        label="City"
                                        value={`${userData.city}, ${userData.province}`}
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
                                        label="Transport"
                                        value={userData.transportation}
                                    />
                                </div>
                            </InfoSection>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {userData.userType === "farmer" ? (
                                <InfoSection title="Farming Information">
                                    <div className="space-y-3">
                                        <InfoRow
                                            icon={
                                                <Package className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Specialties"
                                            value={
                                                userData.specialties?.join(
                                                    ", "
                                                ) || "Not specified"
                                            }
                                        />
                                        <InfoRow
                                            icon={
                                                <Award className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Certifications"
                                            value={
                                                userData.certifications?.join(
                                                    ", "
                                                ) || "None"
                                            }
                                        />
                                        <InfoRow
                                            icon={
                                                <Settings className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Practices"
                                            value={
                                                userData.farmingPractices?.join(
                                                    ", "
                                                ) || "Not specified"
                                            }
                                        />
                                    </div>
                                </InfoSection>
                            ) : (
                                <InfoSection title="Purchase Preferences">
                                    <div className="space-y-3">
                                        <InfoRow
                                            icon={
                                                <Package className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Products Needed"
                                            value={
                                                userData.productsNeeded?.join(
                                                    ", "
                                                ) || "Not specified"
                                            }
                                        />
                                        <InfoRow
                                            icon={
                                                <Settings className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Quantity Range"
                                            value={
                                                userData.quantityRange ||
                                                "Not specified"
                                            }
                                        />
                                        <InfoRow
                                            icon={
                                                <Clock className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Frequency"
                                            value={
                                                userData.frequency ||
                                                "Not specified"
                                            }
                                        />
                                        <InfoRow
                                            icon={
                                                <Award className="w-4 h-4 text-gray-500" />
                                            }
                                            label="Quality Standards"
                                            value={
                                                userData.qualityStandards?.join(
                                                    ", "
                                                ) || "Not specified"
                                            }
                                        />
                                    </div>
                                </InfoSection>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
