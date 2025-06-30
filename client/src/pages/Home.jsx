import { Button, ListingCard, UserModal } from "@/components";
import { useUserModal } from "@/hooks";
import { ChevronRight, Star, MessageCircle, Package } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
    const { selectedUser, isModalOpen, openModal, closeModal } = useUserModal();

    const bestMatch = {
        id: "1",
        name: "John Smith",
        type: "Farmer",
        location: "Texas",
        rating: 4.8,
        match: 95,
        trades: 120,
        firstName: "John",
        lastName: "Smith",
        userType: "farmer",
        city: "Austin",
        province: "Texas",
        email: "john.smith@example.com",
        contactNumber: "+1 (555) 123-4567",
        products: [
            "Organic Tomatoes",
            "Fresh Lettuce",
            "Bell Peppers",
            "Baby Carrots",
            "Sweet Corn",
            "Green Beans",
        ],
        certifications: "Organic", // Single value
        totalTrades: 120,
    };

    const handleViewBestMatchProfile = () => {
        window.open(
            `/profile/${bestMatch.id}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <div
                className="flex items-center justify-center w-full h-[400px] sm:h-[500px] lg:h-[610px] px-4"
                style={{
                    backgroundImage: 'url("/images/dashboard-image.webp")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex flex-col gap-6 sm:gap-10 lg:gap-14 items-center justify-center w-full max-w-[900px] h-auto sm:h-[350px] lg:h-[400px] bg-white p-6 sm:p-8 lg:p-12 mx-4 rounded-lg sm:rounded-none">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                        Find the best farmer for you
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl text-center">
                        Source fresh products for your needs!
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Find Now!
                    </Button>
                </div>
            </div>

            {/* Suggestions Section */}
            <div className="flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 min-h-[600px] lg:h-[780px]">
                <p className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8 font-bold text-center">
                    Suggestions for you
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 justify-items-center w-full max-w-7xl">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <ListingCard
                            key={item}
                            person={{
                                id: index + 1,
                                avatar: "A",
                                firstName: "Jane",
                                lastName: "Doe",
                                userType: "farmer",
                                trade: "Vegetables",
                                city: "Los Angeles",
                                province: "California",
                                rating: 4.5,
                                products: [
                                    "Fresh Tomatoes",
                                    "Organic Lettuce",
                                    "Sweet Corn",
                                ],
                                certifications: "Organic",
                                totalTrades: 45,
                            }}
                            onClick={openModal}
                        />
                    ))}
                </div>
                <Link
                    to="/listings"
                    className="flex h-12 items-center gap-2 mt-6 sm:mt-8 cursor-pointer text-darkGreen hover:text-normalGreen transition-colors duration-400 font-bold"
                >
                    <p>View more</p>
                    <ChevronRight />
                </Link>
            </div>

            {/* Enhanced Best Match Section - Show ALL Products */}
            <div className="flex flex-col items-center justify-center w-full min-h-[500px] sm:min-h-[550px] lg:h-[610px] bg-lighterGreen p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-darkGreen mb-4 sm:mb-6 text-center">
                    Best Match for You!
                </h2>

                <div className="flex flex-col items-center max-w-lg mx-auto">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-gradient-to-br from-normalGreen to-darkGreen rounded-full flex items-center justify-center text-white font-semibold mb-3 sm:mb-4 text-xl sm:text-2xl">
                        {bestMatch.firstName?.charAt(0) || "J"}
                        {bestMatch.lastName?.charAt(0) || "S"}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-darkGreen text-center">
                        {bestMatch.name}
                    </h3>

                    <p className="text-gray-600 mb-3 text-center text-sm sm:text-base">
                        {bestMatch.type} • {bestMatch.location}
                    </p>

                    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 text-gray-600 text-sm sm:text-base">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                        {bestMatch.rating}
                        <span className="text-xs sm:text-sm text-gray-500">
                            •
                        </span>
                        <span className="text-xs sm:text-sm">
                            {bestMatch.trades} successful trades
                        </span>
                    </div>

                    {/* Products Section - Show ALL Products */}
                    <div className="mb-4 sm:mb-6 text-center">
                        <p className="text-xs text-normalGreen mb-3 uppercase tracking-wide font-bold">
                            Currently Selling
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                            {bestMatch.products.map((product, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-lightGreen text-darkGreen text-sm font-medium rounded-full"
                                >
                                    {product}
                                </span>
                            ))}
                        </div>

                        {/* Product count */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Package className="w-4 h-4" />
                            <span>
                                {bestMatch.products.length} products available
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            className="flex-1 sm:flex-none"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Start Trading
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 sm:flex-none"
                            onClick={handleViewBestMatchProfile}
                        >
                            View Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Modal */}
            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default Home;
