import { ListingCard, UserModal } from "@/components";
import { useUserModal } from "@/hooks";

function Listings() {
    const { selectedUser, isModalOpen, openModal, closeModal } = useUserModal();

    return (
        <div className="flex flex-col w-full">
            {/* Listings Section */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                <p className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-8 font-bold text-center">
                    All Listings
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 justify-items-center w-full max-w-7xl">
                    {Array.from({ length: 15 }, (_, index) => (
                        <ListingCard
                            key={index + 1}
                            person={{
                                id: index + 1,
                                avatar: "A",
                                name: "Jane Doe",
                                type: "Farmer",
                                trade: "Vegetables",
                                location: "California",
                                rating: 4.5,
                            }}
                            onClick={openModal}
                        />
                    ))}
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

export default Listings;
