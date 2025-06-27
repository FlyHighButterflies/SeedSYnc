import { Star } from "lucide-react";

function ListingCard({ person, onClick }) {
    return (
        <div
            key={person.id}
            onClick={() => onClick && onClick(person)}
            className="flex flex-col w-72 h-64 items-center text-center bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-2xl hover:cursor-pointer transition-shadow"
        >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mb-4">
                {person.avatar}
            </div>

            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{person.rating}</span>
            </div>

            <h3 className="font-medium text-gray-900 mt-2 mb-6">
                {person.name}
            </h3>
            <p className="text-xs text-gray-500">{person.location}</p>
            <p className="text-sm text-gray-700 mb-4">"{person.trade}"</p>
        </div>
    );
}

export default ListingCard;
