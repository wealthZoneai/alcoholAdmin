import React from "react";
import { Users, UserCheck, UserMinus, ShoppingBag, ArrowUpRight } from "lucide-react";

interface CustomerStatsProps {
    stats: {
        total: number;
        active: number;
        blocked: number;
    };
}

const CustomerStats: React.FC<CustomerStatsProps> = ({ stats }) => {
    const statItems = [
        { label: "Total Customers", value: stats.total, icon: Users, color: "bg-blue-500" },
        { label: "Active Customers", value: stats.active, icon: UserCheck, color: "bg-emerald-500" },
        { label: "Blocked Accounts", value: stats.blocked, icon: UserMinus, color: "bg-rose-500" },
        { label: "Avg. Orders/User", value: "14.5", icon: ShoppingBag, color: "bg-amber-500" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statItems.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${stat.color} text-white shadow-lg shadow-opacity-20`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-full">
                            <ArrowUpRight size={14} />
                            12%
                        </div>
                    </div>
                    <h3 className="text-gray-500 font-semibold text-sm">{stat.label}</h3>
                    <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                </div>
            ))}
        </div>
    );
};

export default CustomerStats;
