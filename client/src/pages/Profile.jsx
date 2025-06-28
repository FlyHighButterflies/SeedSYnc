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
    Settings,
} from "lucide-react";
import Button from "@/components/Button";

// Updated sample data to match SignUp fields
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

    // Business Information (Step 4) - Farmer
    userType: "farmer",
    certifications: "organic", // Single value now
    farmingPractices: "sustainable", // Single value now

    // System-generated fields
    joinDate: "2024-01-15",
    rating: 4.8,
    totalTrades: 45,
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

    // Business Information (Step 4) - Buyer
    userType: "buyer",
    qualityStandards: "organic", // Single value now
    frequency: "weekly",

    // System-generated fields
    joinDate: "2024-02-20",
    rating: 4.6,
    totalTrades: 32,
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
            <span className="text-sm text-gray-900 flex-1 capitalize">
                {value}
            </span>
        </div>
    );
}

function Profile() {
    const [userType, setUserType] = useState("farmer");
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setUserType(
                                    userType === "farmer" ? "buyer" : "farmer"
                                )
                            }
                        >
                            Switch to{" "}
                            {userType === "farmer" ? "Buyer" : "Farmer"} View
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleEdit}
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
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
                                    {profileData.firstName.charAt(0)}
                                    {profileData.lastName.charAt(0)}
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleImageUpload}
                                    className="absolute bottom-2 right-2 p-2 rounded-full"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
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

                    {/* Stats Cards */}
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
                                    label="Country"
                                    value={profileData.country}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Province"
                                    value={profileData.province}
                                />
                                <InfoRow
                                    icon={
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                    }
                                    label="City"
                                    value={profileData.city}
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
                                    label="Highway Access"
                                    value={profileData.highway}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Port Access"
                                    value={profileData.port}
                                />
                                <InfoRow
                                    icon={
                                        <Truck className="w-4 h-4 text-gray-500" />
                                    }
                                    label="Transportation"
                                    value={profileData.transportation}
                                />
                            </div>
                        </InfoSection>

                        {/* Business Information */}
                        {userType === "farmer" ? (
                            <InfoSection title="Business Information">
                                <div className="space-y-3">
                                    <InfoRow
                                        icon={
                                            <Award className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Certification"
                                        value={
                                            profileData.certifications || "None"
                                        }
                                    />
                                    <InfoRow
                                        icon={
                                            <Settings className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Farming Practice"
                                        value={
                                            profileData.farmingPractices ||
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
                                            profileData.qualityStandards ||
                                            "Any"
                                        }
                                    />
                                    <InfoRow
                                        icon={
                                            <Clock className="w-4 h-4 text-gray-500" />
                                        }
                                        label="Purchase Frequency"
                                        value={
                                            profileData.frequency || "As needed"
                                        }
                                    />
                                </div>
                            </InfoSection>
                        )}

                        {/* Products/Inventory Section */}
                        {/* <InfoSection
                            title={
                                userType === "farmer"
                                    ? "Crop Management"
                                    : "Requirements Management"
                            }
                        >
                            <div className="space-y-3">
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">
                                        {userType === "farmer"
                                            ? "Manage your crops and inventory"
                                            : "Manage your product requirements"}
                                    </p>
                                    <Button variant="primary" size="sm">
                                        Go to Inventory
                                    </Button>
                                </div>
                            </div>
                        </InfoSection> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
