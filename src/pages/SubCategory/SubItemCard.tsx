import React from "react";
import { Heart, ShoppingCart, Plus, Minus, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../Redux/wishlistSlice";
import type { RootState } from "../../Redux/store";
import toast from "react-hot-toast";
import { AddToCart, setFavoriteItem } from "../../services/apiHelpers";

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

const SubItemCard: React.FC<GroceryProductCardProps> = ({
  id,
  name,
  image,
  category,
  price,  
  discount = 5,
  rating = 4,
  minValue = 1,
  maxValue = 10,
  // stepValue = 1,
  unitType = "PIECE",
  onViewDetails,
}) => {
  // Quantity starts at minValue
const min = minValue ?? 1;
const max = maxValue ?? 50;
const step = minValue ?? 1;
const unit = unitType || "";  // empty unit when not provided

const [quantity, setQuantity] = React.useState(min);
  const [isAdding, setIsAdding] = React.useState(false);
  const dispatch = useDispatch();

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const userId = useSelector((state: RootState) => state.user.userId);
  const isWishlisted = wishlist.some((item) => item.id === id);



  const toggleWishlist = async () => {
    if (!userId) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const newFavoriteStatus = !isWishlisted;

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist({ id, name, price, image, category }));
    }

    try {
      const response = await setFavoriteItem(id, newFavoriteStatus,userId);

      if (!response || !response.data) {
        if (isWishlisted) dispatch(addToWishlist({ id, name, price, image, category }));
        else dispatch(removeFromWishlist(id));

        toast.error("Failed to update wishlist");
        return;
      }

      newFavoriteStatus
        ? toast.success("Added to wishlist ❤️")
        : toast("Removed from wishlist 💔");
    } catch (error) {
      console.error("Wishlist API Error:", error);

      if (isWishlisted) {
        dispatch(addToWishlist({ id, name, price, image, category }));
      } else {
        dispatch(removeFromWishlist(id));
      }

      toast.error("Something went wrong while updating wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login before adding items to cart");
      return;
    }

    if (quantity < minValue) {
      toast.error(`Minimum quantity is ${minValue} ${unit}`);
      return;
    }

    setIsAdding(true);

    try {
      const response = await AddToCart(userId, id, quantity);

      if (!response || !response.data) {
        toast.error("Failed to add item to cart");
        return;
      }
      // ✅ Find the cart item for this product
    const cartItem = response.data.cartItems.find(
      (ci: any) => ci.item.id === id
    );

    if (!cartItem) {
      toast.error("Cart item not found");
      return;
    }


      dispatch(addToCart({ cartItemId: cartItem.id, id, name, image, price, quantity, discount,minValue,maxValue,unitType }));
      toast.success(`${name} added to cart 🛒`);
      setQuantity(minValue);
    } catch (error) {
      console.error("Cart API Error:", error);
      toast.error("Something went wrong while adding item");
    } finally {
      setIsAdding(false);
    }
  };

  const originalPrice = (price / (1 - discount / 100)).toFixed(0);

  const unitLabel = unit 
    .replace("LITRE", "L")
    .replace("MILLILITER", "ml")
    .replace("KILOGRAM", "kg")
    .replace("GRAM", "g")
    .replace("PIECE", "pc")
    .replace("PACKET", "pkt");

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
            ₹{(price * quantity).toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{(Number(originalPrice) * quantity).toFixed(2)}
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
