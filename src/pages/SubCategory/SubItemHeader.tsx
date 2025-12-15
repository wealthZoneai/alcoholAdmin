import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  tagline?: string;
  emoji?: string;
  imageUrl?: string;
}

const SubItemHeader: React.FC<PageHeaderProps> = ({
  title,
  tagline,
  emoji,
  imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80",
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mx-4 md:mx-6 h-[240px] md:h-[300px] rounded-[32px] overflow-hidden shadow-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt="banner"
          className="w-full h-full object-cover scale-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Floating premium glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-400/20 blur-3xl rounded-full"
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-7 md:px-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
            <Sparkles size={16} className="text-emerald-300" />
            <span className="text-white text-sm font-semibold tracking-wide">
              Premium Collection
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-white text-4xl md:text-6xl font-bold leading-tight flex items-center gap-3 drop-shadow-lg"
        >
          {emoji && (
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl"
            >
              {emoji}
            </motion.span>
          )}
          {title}
        </motion.h1>

        {/* Gradient Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "140px" }}
          transition={{ duration: 0.7 }}
          className="h-1.5 mt-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 rounded-full"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-200 text-base md:text-lg mt-3 max-w-xl"
        >
          {tagline || "Explore handpicked premium-quality items curated for you."}
        </motion.p>
      </div>

      {/* Smooth corner lighting */}
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[32px]" />
    </motion.header>
  );
};

export default SubItemHeader;
