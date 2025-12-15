import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    color: string;
    delay?: number;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
    title,
    value,
    icon,
    trend = "neutral",
    trendValue,
    color,
    delay = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl shadow-lg ${color}`}>
                    {icon}
                </div>

                {trend !== "neutral" && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${trend === "up"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-gray-500 text-sm font-bold mb-1 tracking-wide uppercase opacity-80">{title}</h3>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
            </div>

            {/* Decorative gradient blob */}
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30 ${color}`}></div>
        </motion.div>
    );
};

export default AdminStatCard;
