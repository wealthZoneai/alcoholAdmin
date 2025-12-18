import React from "react";
import {
    TrendingUp,
    CheckCircle2,
    RotateCcw,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

interface TransactionStatsProps {
    stats: {
        totalCollection: number;
        successRate: number;
        refunded: number;
        pending: number;
    };
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ stats }) => {
    const statsConfig = [
        {
            label: "Total Collection",
            value: `₹${stats.totalCollection.toLocaleString()}`,
            icon: TrendingUp,
            color: "bg-blue-500",
            trend: "up",
            trendValue: "12.5%",
            sub: "Total revenue generated"
        },
        {
            label: "Success Rate",
            value: `${stats.successRate}%`,
            icon: CheckCircle2,
            color: "bg-emerald-500",
            trend: "up",
            trendValue: "3.2%",
            sub: "Completed transactions"
        },
        {
            label: "Refunded",
            value: `₹${stats.refunded.toLocaleString()}`,
            icon: RotateCcw,
            color: "bg-rose-500",
            trend: "down",
            trendValue: "1.1%",
            sub: "Returned to customers"
        },
        {
            label: "Pending",
            value: `₹${stats.pending.toLocaleString()}`,
            icon: Clock,
            color: "bg-amber-500",
            trend: "neutral",
            trendValue: "0%",
            sub: "Processing/Ondoing"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsConfig.map((stat, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100/50 hover:shadow-md transition-all hover:-translate-y-1 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-opacity-20 transform group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                                stat.trend === 'down' ? 'bg-rose-50 text-rose-600' :
                                    'bg-gray-50 text-gray-500'
                            }`}>
                            {stat.trend === 'up' ? <ArrowUpRight size={14} /> :
                                stat.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                            {stat.trendValue}
                        </div>
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

export default TransactionStats;
