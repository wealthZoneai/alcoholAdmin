import React from "react";
import { Search, Star } from "lucide-react";

interface ReviewToolbarProps {
    search: string;
    setSearch: (val: string) => void;
    activeRating: number | "ALL";
    setActiveRating: (val: number | "ALL") => void;
}

const ReviewToolbar: React.FC<ReviewToolbarProps> = ({
    search,
    setSearch,
    activeRating,
    setActiveRating
}) => {
    return (
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-gray-900/5 focus-within:border-gray-900 transition-all w-full max-w-md">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by customer or review text..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full ml-3 text-gray-700 font-bold placeholder:font-medium text-sm"
                />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveRating("ALL")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeRating === "ALL"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        ALL REVIEWS
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setActiveRating(rating)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1 ${activeRating === rating
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {rating} <Star size={12} className={activeRating === rating ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewToolbar;
