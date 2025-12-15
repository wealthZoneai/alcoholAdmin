import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeatureItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

interface AdminFeatureSectionProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    items: FeatureItem[];
    delay?: number;
}

const AdminFeatureSection: React.FC<AdminFeatureSectionProps> = ({
    title,
    description,
    icon,
    color,
    items,
    delay = 0,
}) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
                </div>
            </div>

            <div className="space-y-2 mt-auto">
                {items.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-emerald-600 transition-colors group text-left"
                    >
                        <div className="flex items-center gap-3">
                            {item.icon && <span className="text-gray-400 group-hover:text-emerald-500 transition">{item.icon}</span>}
                            <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminFeatureSection;
