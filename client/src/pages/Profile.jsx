import { useState } from "react";
import {
    Edit3,
    Camera,
    MapPin,
    Phone,
    Mail,
    Star,
    Package,
    Clock,
    Award,
    Truck,
    User,
    Settings,
} from "lucide-react";

// Sample user data based on signup fields
const sampleFarmerProfile = {
    // Personal Info (Step 1)
    email: "farmer.john@example.com",
    firstName: "John",
    lastName: "Santos",
    contactNumber: "+63 912 345 6789",
    profileImage: "/images/farmer-profile.jpg",

    // Location & Logistics (Step 3)
    country: "Philippines",
    province: "Nueva Ecija",
    city: "Cabanatuan City",
    address: "123 Rice Field Road, Barangay Magsaysay",
    landmarks: "Near Cabanatuan Public Market",
    highway: "yes",
    port: "no",
    transportation: "truck",

    // Farmer-specific data
    userType: "farmer",
    joinDate: "2024-01-15",
    rating: 4.8,
    totalTrades: 45,
    specialties: ["Rice", "Corn", "Vegetables"],
    certifications: ["Organic", "Non-GMO"],
    farmingPractices: ["Sustainable", "Water Efficient"],
    totalCrops: 12,
    activeCrops: 8,
};

const sampleBuyerProfile = {
    // Personal Info (Step 1)
    email: "buyer.maria@example.com",
    firstName: "Maria",
    lastName: "Cruz",
    contactNumber: "+63 917 123 4567",
    profileImage: "/images/buyer-profile.jpg",

    // Location & Logistics (Step 3)
    country: "Philippines",
    province: "Metro Manila",
    city: "Quezon City",
    address: "456 Market Street, Barangay Kamuning",
    landmarks: "Near Kamuning Market",
    highway: "yes",
    port: "yes",
    transportation: "truck",

    // Buyer-specific data (Step 4)
    userType: "buyer",
    joinDate: "2024-02-20",
    rating: 4.6,
    totalTrades: 32,
    productsNeeded: ["Rice", "Vegetables", "Fruits"],
    quantityRange: "500-1000 kg",
    urgency: "soon",
    qualityStandards: ["Organic", "Non-GMO"],
    frequency: "weekly",
    inventoryStatus: "low",
    activeRequirements: 5,
    totalRequirements: 12,
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

function Profile() {
    const [userType, setUserType] = useState("farmer"); // This would come from auth context
    const [isEditing, setIsEditing] = useState(false);

    const profileData =
        userType === "farmer" ? sampleFarmerProfile : sampleBuyerProfile;

    const handleEdit = () => {
        setIsEditing(true);
        console.log("Edit profile");
    };

    const handleImageUpload = () => {
        console.log("Upload new profile image");
    };

    return (
        <div className="flex flex-col w-full">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            My Profile
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                setUserType(
                                    userType === "farmer" ? "buyer" : "farmer"
                                )
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Switch to{" "}
                            {userType === "farmer" ? "Buyer" : "Farmer"} View
                        </button>
                        <button
                            onClick={handleEdit}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 text-sm"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
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
                                    {profileData.firstName.charAt(0)}
                                    {profileData.lastName.charAt(0)}
                                </div>
                                <button
                                    onClick={handleImageUpload}
                                    className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                                >
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {profileData.firstName}{" "}
                                    {profileData.lastName}
                                </h2>
                                <p className="text-lg text-gray-600 mb-2 capitalize">
                                    {profileData.userType}
                                </p>
                                <div className="flex items-center justify-center sm:justify-start gap-6 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">
                                            {profileData.rating}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {profileData.totalTrades} completed
                                        trades
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Member since{" "}
                                    {new Date(
                                        profileData.joinDate
                                    ).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Only 3 cards now */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ProfileCard
                            icon={<Package className="w-5 h-5 text-blue-600" />}
                            title={
                                userType === "farmer"
                                    ? "Active Crops"
                                    : "Active Needs"
                            }
                            value={
                                userType === "farmer"
                                    ? profileData.activeCrops
                                    : profileData.activeRequirements
                            }
                            subtitle={`${
                                userType === "farmer"
                                    ? profileData.totalCrops
                                    : profileData.totalRequirements
                            } total`}
                        />
                        <ProfileCard
                            icon={<Star className="w-5 h-5 text-yellow-600" />}
                            title="Rating"
                            value={profileData.rating}
                            subtitle={`${profileData.totalTrades} reviews`}
                        />
                        <ProfileCard
                            icon={<Clock className="w-5 h-5 text-green-600" />}
                            title="Total Trades"
                            value={profileData.totalTrades}
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
                                    value={profileData.email}
                                />
                                <InfoRow
                                    icon={
                                        <Phone className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Phone"
                                    value={profileData.contactNumber}
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
                                    value={`${profileData.city}, ${profileData.province}`}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Address"
                                    value={profileData.address}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Landmarks"
                                    value={profileData.landmarks}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Transport"
                                    value={profileData.transportation}
                                />
                            </div>
                        </InfoSection>

                        {/* Farmer-specific or Buyer-specific Info */}
                        {userType === "farmer" ? (
                            <InfoSection title="Farming Information">
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={
                                            <Package className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Specialties"
                                        value={profileData.specialties.join(
                                            ", "
                                        )}
                                    />
                                    <InfoRow
                                        icon={
                                            <Award className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Certifications"
                                        value={profileData.certifications.join(
                                            ", "
                                        )}
                                    />
                                    <InfoRow
                                        icon={
                                            <Settings className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Practices"
                                        value={profileData.farmingPractices.join(
                                            ", "
                                        )}
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
                                        value={profileData.productsNeeded.join(
                                            ", "
                                        )}
                                    />
                                    <InfoRow
                                        icon={
                                            <Settings className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Quantity Range"
                                        value={profileData.quantityRange}
                                    />
                                    <InfoRow
                                        icon={
                                            <Clock className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Frequency"
                                        value={profileData.frequency}
                                    />
                                    <InfoRow
                                        icon={
                                            <Award className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Quality Standards"
                                        value={profileData.qualityStandards.join(
                                            ", "
                                        )}
                                    />
                                </div>
                            </InfoSection>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
