import React from "react";
import { Star, Trash2, ShieldCheck, MapPin } from "lucide-react";

export interface Review {
    id: number;
    name: string;
    location: string;
    date: string;
    text: string;
    image: string;
    rating: number;
    verified: boolean;
}

interface ReviewRowProps {
    review: Review;
    onDelete: (id: number) => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ review, onDelete }) => {
    return (
        <tr className="group hover:bg-gray-50/50 transition-all font-medium border-b border-gray-50 last:border-0">
            <td className="px-6 py-6 max-w-xs">
                <div className="flex items-center gap-4">
                    <img
                        src={review.image || "https://ui-avatars.com/api/?name=" + review.name}
                        alt={review.name}
                        className="w-12 h-12 rounded-2xl object-cover shadow-sm bg-gray-100"
                    />
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-900 font-black text-sm truncate">{review.name}</span>
                            {review.verified && <ShieldCheck size={14} className="text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                            <MapPin size={10} /> {review.location}
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-6">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={14}
                                className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                            />
                        ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 italic font-medium">"{review.text}"</p>
                </div>
            </td>

            <td className="px-6 py-6">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-xs">{review.date}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase mt-0.5 tracking-tighter">Submitted</span>
                </div>
            </td>

            <td className="px-6 py-6 text-right">
                <button
                    onClick={() => onDelete(review.id)}
                    className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

export default ReviewRow;
