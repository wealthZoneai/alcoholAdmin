import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

interface Product {
  id: any;
  
  name: string;
  price: number;
  imageUrl: string;
  category: 'alcohol' | 'grocery';
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void;
}

// Framer Motion variants for the card's subtle hover lift
const cardVariants = {
  rest: { 
    y: 0, 
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  hover: { 
    y: -5, 
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  
  const isAlcohol = product.category === 'alcohol';
  
  const handleAddToCart = () => {
    onAddToCart(product.id);
    // In a full app, the 'fly to cart' animation logic (using useAnimate) would go here.
    // console.log(`Product ${product.name} added. Triggering animation.`);
  };

  return (
    <motion.div
      className={`group rounded-xl overflow-hidden shadow-md flex transition-all duration-300 cursor-pointer 
        ${isAlcohol 
          ? 'bg-gray-800 text-gray-100 border border-gray-700' 
          : 'bg-white border border-gray-100'}
        
        /* Mobile Layout: Horizontal */
        sm:flex-row sm:h-32 sm:p-0 
        
        /* Desktop Layout: Vertical */
        flex-col h-auto
      `}
      variants={cardVariants}
      initial="rest"
      whileHover="hover" // Triggers the lift animation
      whileTap={{ scale: 0.98 }} 
    >
      <div className="h-40 sm:h-full sm:w-32 overflow-hidden relative bg-gray-50 shrink-0">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Wishlist Button (Hidden on Mobile) */}
        <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-gray-500 hover:text-red-500 transition-all sm:flex hidden" title="Add to Wishlist">
          <FaHeart className="text-sm" />
        </button>
      </div>

      <div className="p-4 flex flex-col grow w-full">
        <h3 className={`text-lg font-semibold mb-1 truncate ${isAlcohol ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
        <p className={`text-sm mb-3 ${isAlcohol ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</p>
        
        <div className="mt-auto flex justify-between items-center pt-3">
          <span className={`text-2xl font-extrabold ${isAlcohol ? 'text-yellow-400' : 'text-blue-700'}`}>
            ${product.price.toFixed(2)}
          </span>
          
          <button 
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors whitespace-nowrap" 
            onClick={handleAddToCart}
            // whileHover={{ scale: 1.05 }}
            // whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart className="text-sm" />
            <span className="hidden md:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;