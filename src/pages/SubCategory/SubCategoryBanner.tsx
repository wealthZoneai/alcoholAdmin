import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award } from "lucide-react";

interface CategoryBannerProps {
    title: string;
    description: string;
    image?: string;
}

const SubCategoryBanner: React.FC<CategoryBannerProps> = ({
    title,
    description,
    image,
}) => {
    const defaultImage =
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80";

    return (
        <div className="relative w-full mb-8">
            {/* Banner Container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative h-[280px] sm:h-[350px] w-full rounded-b-[40px] overflow-hidden shadow-2xl mx-auto"
            >
                {/* Background Image */}
                <motion.img
                    src={image || defaultImage}
                    alt={title}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                />

                {/* Multi-layer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Animated Glow Effect */}
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/20 blur-3xl rounded-full"
                />

                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                    {/* Top Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow-lg">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-white text-sm font-semibold">Featured</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 px-3 py-2 rounded-full">
                            <TrendingUp size={14} className="text-emerald-300" />
                            <span className="text-emerald-100 text-xs font-medium">Popular</span>
                        </div>
                    </motion.div>

                    {/* Bottom Content */}
                    <div>
                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-2xl leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Gradient Line */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "160px" }}
                            transition={{ delay: 0.6, duration: 0.7 }}
                            className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 rounded-full mb-4"
                        />

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="text-gray-200 text-base sm:text-lg max-w-2xl leading-relaxed"
                        >
                            {description}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="flex items-center gap-6 mt-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-sm text-gray-300">Fresh Stock</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award size={14} className="text-yellow-400" />
                                <span className="text-sm text-gray-300">Premium Quality</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Shimmer Effect */}
                <motion.div
                    animate={{
                        x: ["-100%", "200%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />

                {/* Border Glow */}
                <div className="absolute inset-0 border-2 border-white/10 rounded-b-[40px] pointer-events-none" />
            </motion.div>
        </div>
    );
};

export default SubCategoryBanner;
