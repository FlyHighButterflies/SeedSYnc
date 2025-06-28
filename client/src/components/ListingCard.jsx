import { MapPin, Star, Package } from "lucide-react";

function ListingCard({ person, onClick }) {
    return (
        <div
            onClick={() => onClick(person)}
            className="flex flex-col w-72 h-64 bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-normalGreen to-darkGreen rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {person.firstName?.charAt(0) ||
                        person.name?.charAt(0) ||
                        person.avatar}
                    {person.lastName?.charAt(0) || ""}
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                            {person.rating || "4.5"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-darkGreen" />
                        <span className="text-xs font-medium text-darkGreen">
                            {person.totalTrades || 0} trades
                        </span>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
                <h3 className="font-semibold text-lg text-darkGreen mb-2">
                    {person.firstName && person.lastName
                        ? `${person.firstName} ${person.lastName}`
                        : person.name || "Unknown User"}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                        {person.city && person.province
                            ? `${person.city}, ${person.province}`
                            : person.location || "Location not specified"}
                    </span>
                </div>

                {/* Products Section - Most Important */}
                <div className="mb-3 min-h-[80px] flex flex-col justify-start">
                    {person.userType === "farmer" ||
                    person.type === "farmer" ? (
                        <>
                            <p className="text-xs text-normalGreen mb-2 uppercase tracking-wide font-bold">
                                Selling
                            </p>
                            {person.products && person.products.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {person.products
                                        .slice(0, 3)
                                        .map((product, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-lightGreen text-darkGreen text-xs font-medium rounded-full"
                                            >
                                                {product}
                                            </span>
                                        ))}
                                    {person.products.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{person.products.length - 3}
                                        </span>
                                    )}
                                </div>
                            ) : person.specialties &&
                              person.specialties.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {person.specialties
                                        .slice(0, 3)
                                        .map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-lightGreen text-darkGreen text-xs font-medium rounded-full"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    {person.specialties.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{person.specialties.length - 3}
                                        </span>
                                    )}
                                </div>
                            ) : person.trade ? (
                                <p className="text-sm text-darkGreen font-medium mb-2">
                                    {person.trade}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic mb-2">
                                    No products listed
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-orange-600 mb-2 uppercase tracking-wide font-bold">
                                Looking For
                            </p>
                            {person.productsNeeded &&
                            person.productsNeeded.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {person.productsNeeded
                                        .slice(0, 3)
                                        .map((product, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                                            >
                                                {product}
                                            </span>
                                        ))}
                                    {person.productsNeeded.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                            +{person.productsNeeded.length - 3}
                                        </span>
                                    )}
                                </div>
                            ) : person.trade ? (
                                <p className="text-sm text-darkGreen font-medium mb-2">
                                    {person.trade}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 italic mb-2">
                                    No products specified
                                </p>
                            )}

                            {/* Quantity info for buyers */}
                            {person.quantityRange && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Package className="w-3 h-3" />
                                    <span>Need: {person.quantityRange}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListingCard;
