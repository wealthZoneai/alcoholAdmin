import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status?: boolean;
}

interface Props {
  item: Category;
  isAdmin?: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const UniqueCategoryCard: React.FC<Props> = ({
  item,
  isAdmin = false,
  onClick,
  onEdit,
  onDelete,
}) => {
  const fallback =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&w=900&q=80";

  const [img, setImg] = useState(item.imageUrl || fallback);

  const isActive = item.status === true;

  const pill = isActive
    ? { text: "Active", bg: "bg-emerald-500/90", icon: Eye }
    : { text: "Inactive", bg: "bg-red-500/90", icon: EyeOff };

  useEffect(() => {
    setImg(item.imageUrl || fallback);
  }, [item.imageUrl]);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group relative overflow-hidden cursor-pointer rounded-3xl shadow-lg bg-white"
    >
      {/* Image Layer */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={img}
          onError={() => setImg(fallback)}
          alt={item.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>

        {/* Title on Image */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold drop-shadow-md">{item.name}</h3>
          <p className="text-sm opacity-80 drop-shadow-sm line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      {isAdmin && (
        <div
          className={`absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold text-white rounded-full flex items-center gap-1 backdrop-blur-md ${pill.bg}`}
        >
          <pill.icon size={12} />
          {pill.text}
        </div>
      )}

      {/* Admin Buttons */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl bg-white/90 backdrop-blur shadow hover:bg-white"
          >
            <Pencil size={16} className="text-blue-600" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl bg-white/90 backdrop-blur shadow hover:bg-white"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default UniqueCategoryCard;
