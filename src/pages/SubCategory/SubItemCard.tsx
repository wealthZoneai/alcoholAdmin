import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface GroceryProductCardProps {
  id: any;
  name: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  category: string;
  minValue?: number;
  maxValue?: number;
  // stepValue?: number;
  unitType?: string;

  onViewDetails?: () => void;
}

const SubItemCard = ({
  name,
  image,
  price,
  discount = 5,
  rating = 4,
  onViewDetails,
}: GroceryProductCardProps) => {


  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1">
          <Sparkles size={12} />
          {discount}% OFF
        </div>
      )}



      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Product Name */}
        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({rating}0)</span>
        </div>

        {/* Dynamic Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-emerald-600">
            ₹{price.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{(price * (1 + (discount / 100))).toFixed(2)}
            </span>
          )}
        </div>

        {/* DYNAMIC QUANTITY SELECTOR */}


        {/* Add to Cart */}
        {/* <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-2.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
            </>
          )}
        </button> */}

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 underline transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SubItemCard;
