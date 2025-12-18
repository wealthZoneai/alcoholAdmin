import React from "react";
import {
    MessageSquare,
    Star,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

interface ReviewStatsProps {
    stats: {
        total: number;
        averageRating: number;
        verified: number;
        negative: number;
    };
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
    const statCards = [
        {
            label: "Total Reviews",
            value: stats.total.toLocaleString(),
            icon: MessageSquare,
            color: "bg-blue-500",
            sub: "All time feedback"
        },
        {
            label: "Average Rating",
            value: `${stats.averageRating}/5`,
            icon: Star,
            color: "bg-amber-500",
            sub: "Customer satisfaction"
        },
        {
            label: "Verified Reviews",
            value: stats.verified.toLocaleString(),
            icon: CheckCircle2,
            color: "bg-emerald-500",
            sub: "Authenticated buyers"
        },
        {
            label: "Negative Feedback",
            value: stats.negative.toLocaleString(),
            icon: AlertCircle,
            color: "bg-rose-500",
            sub: "Needs attention"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-opacity-20 transform group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live</span>
                    </div>
                    <div>
                        <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">{stat.sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewStats;
