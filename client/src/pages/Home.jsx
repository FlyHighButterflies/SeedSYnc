import { Button, ListingCard, UserModal } from "@/components";
import { useUserModal } from "@/hooks";
import { ChevronRight, Star, MessageCircle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/services/api";

function Home() {
    const { selectedUser, isModalOpen, openModal, closeModal } = useUserModal();

    // State for recommendations and best match
    const [recommendations, setRecommendations] = useState([]);
    const [bestMatch, setBestMatch] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = () => {
        // Use POST to always recompute recommendations (AI agent)
        api.get("/matches/recommendations", {})
            .then((res) => {
                const recs = res.data?.recommendations || [];
                setRecommendations(recs);

                // Pick best match (highest score)
                if (recs.length > 0) {
                    const sorted = [...recs].sort(
                        (a, b) =>
                            (b.matchScore || b.score || 0) -
                            (a.matchScore || a.score || 0)
                    );
                    setBestMatch(sorted[0]);
                } else {
                    setBestMatch(null);
                }
            })
            .catch(() => {
                setRecommendations([]);
                setBestMatch(null);
            });
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleFindNow = async () => {
        setLoading(true);
        try {
            await api.post("/matches/match", {}); // POST to create match
            fetchRecommendations(); // Refresh recommendations
        } catch (err) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    // Helper to extract crop names from inventory.crops
    const getProductNamesFromInventory = (inventory) => {
        if (!inventory || !Array.isArray(inventory.crops)) return [];
        return inventory.crops.map(
            (crop) => crop.name || crop.cropId?.name || "Crop"
        );
    };

    // Map server farmer/user to ListingCard props
    const mapFarmerToCard = (match) => {
        const farmer = match.farmerId || match.farmer || {};
        const products = getProductNamesFromInventory(farmer.inventory);

        return {
            id: farmer._id,
            avatar: farmer.fullName
                ? farmer.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                : "F",
            firstName: farmer.fullName?.split(" ")[0] || "",
            lastName: farmer.fullName?.split(" ")[1] || "",
            userType: farmer.role || "farmer",
            trade: match.cropName || "Crops",
            // Extract region and country from address (assumes "street, city, region, country")
            address: farmer.address
                ? (() => {
                      const parts = farmer.address
                          .split(",")
                          .map((s) => s.trim());
                      if (parts.length >= 2) {
                          // Get last two parts as region and country
                          return parts.slice(-2).join(", ");
                      }
                      return farmer.address;
                  })()
                : "Location not specified",
            rating: typeof farmer.rating === "number" ? farmer.rating : 0,
            products,
            certifications: farmer.farmerInfo?.certification || "",
            totalTrades: typeof farmer.trades === "number" ? farmer.trades : 0,
            contact: farmer.contactNumber || "Contact not available",
            email: farmer.email || "Email not available",
        };
    };

    const handleViewBestMatchProfile = () => {
        if (!bestMatch) return;
        const farmer = bestMatch.farmerId || bestMatch.farmer || {};
        window.open(`/profile/${farmer._id}`, "_blank", "noopener,noreferrer");
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
                        onClick={handleFindNow}
                        disabled={loading}
                    >
                        {loading ? "Finding..." : "Find Now!"}
                    </Button>
                </div>
            </div>

            {/* Suggestions Section */}
            <div className="flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 min-h-[600px] lg:h-[780px]">
                <p className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8 font-bold text-center">
                    Suggestions for you
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 justify-items-center w-full max-w-7xl">
                    {recommendations.length === 0
                        ? Array.from({ length: 6 }).map((_, index) => (
                              <div
                                  key={index}
                                  className="w-full h-48 bg-gray-100 rounded-lg animate-pulse"
                              />
                          ))
                        : recommendations.slice(0, 6).map((match, index) => (
                              <ListingCard
                                  key={match._id || index}
                                  person={mapFarmerToCard(match)}
                                  onClick={() =>
                                      openModal(mapFarmerToCard(match))
                                  }
                              >
                                  <span className="text-sm text-gray-600 truncate">
                                      {mapFarmerToCard(match).address ||
                                          "Location not specified"}
                                  </span>
                              </ListingCard>
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

                {bestMatch ? (
                    (() => {
                        const farmer =
                            bestMatch.farmerId || bestMatch.farmer || {};
                        const products =
                            farmer.inventory ||
                            bestMatch.matchedCrops ||
                            bestMatch.products ||
                            [];
                        return (
                            <div className="flex flex-col items-center max-w-lg mx-auto">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-gradient-to-br from-normalGreen to-darkGreen rounded-full flex items-center justify-center text-white font-semibold mb-3 sm:mb-4 text-xl sm:text-2xl">
                                    {farmer.fullName
                                        ? farmer.fullName
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                        : "F"}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-darkGreen text-center">
                                    {farmer.fullName || "Farmer"}
                                </h3>
                                <p className="text-gray-600 mb-3 text-center text-sm sm:text-base">
                                    {farmer.role || "Farmer"} •{" "}
                                    {farmer.address || ""}
                                </p>
                                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 text-gray-600 text-sm sm:text-base">
                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                                    {farmer.rating || 0}
                                    <span className="text-xs sm:text-sm text-gray-500">
                                        •
                                    </span>
                                    <span className="text-xs sm:text-sm">
                                        {farmer.trades || 0} successful trades
                                    </span>
                                </div>
                                {/* Products Section - Show ALL Products */}
                                <div className="mb-4 sm:mb-6 text-center">
                                    <p className="text-xs text-normalGreen mb-3 uppercase tracking-wide font-bold">
                                        Currently Selling
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                                        {products.map((product, index) => (
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
                                            {products.length} products available
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
                        );
                    })()
                ) : (
                    <div className="text-gray-500 text-center">
                        No best match found.
                    </div>
                )}
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
