import { Edit2, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export interface ComboItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface BannerData {
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

interface Props {
  item: ComboItem;
  onEdit: () => void;
  onDelete: () => void;
}

const ComboCard: React.FC<Props> = ({ item, onEdit, onDelete }) => {
    const [data,setData] = useState(item);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden group"
    >
      <div className="relative h-48">
        <img src={data.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60" />

        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full flex gap-1">
          <Sparkles size={12} /> Special
        </div>

        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100">
          <button onClick={onEdit} className="p-2 bg-white rounded-lg">
            <Edit2 size={16} />
          </button>
          <button onClick={onDelete} className="p-2 bg-white rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold">{data.title}</h3>
        <p className="text-gray-500 text-sm mb-3">{data.subtitle}</p>
        <span className="text-orange-600 text-sm font-semibold flex gap-1">
          View Details <ArrowRight size={16} />
        </span>
      </div>
    </motion.div>
  );
};

export default ComboCard;
