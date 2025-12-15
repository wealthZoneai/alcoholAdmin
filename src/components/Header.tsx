// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart, User, X, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setCart } from "../Redux/cartSlice";
import { setWishlist } from "../Redux/wishlistSlice";
import type { RootState } from "../Redux/store";
import { motion, AnimatePresence } from "framer-motion";
import ShowCart from "./ShowCart";
import { getAddToCart, getFavoriteItems } from "../services/apiHelpers";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const role = useSelector((state: RootState) => state.user.role);








  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length >= 2) {
      if (onSearchChange) onSearchChange(value.trim());
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      setShowSearch(false);
    } else if (value.trim().length === 0) {
      setShowSearch(true);
      navigate("/home");
    }
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearchChange) onSearchChange(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setShowSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearchChange) onSearchChange("");

    if (location.pathname === "/search") {
      navigate("/home");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        {/* Logo */}
        <div
          className="text-2xl sm:text-3xl font-extrabold cursor-pointer"
          onClick={() => navigate("/admin-dashboard")}
          role="button"
        >
          🍹 MyStore
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar (Desktop) */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-2 w-[220px] sm:w-[300px] shadow-inner focus-within:ring-2 focus-within:ring-green-400 transition-all duration-300">
            <button
              onClick={handleSearch}
              className="text-gray-500 hover:text-green-600 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search your favorite..."
              className="bg-transparent outline-none ml-2 text-sm text-gray-700 w-full"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="ml-2 text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition"
              onClick={() => setShowSearch((s) => !s)}
              aria-label="Toggle search"
            >
              {showSearch ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Search className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Admin Dashboard - Only visible to Admins */}
           
              <button
                onClick={() => navigate("/admin/orders")}
                className="p-2.5 rounded-xl hover:bg-purple-50 transition group"
                aria-label="Admin Dashboard"
              >
                <Package className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition" />
              </button>
    
        

            {/*   Profile */}
            <button
              onClick={() => navigate("/profile")}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition group"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-200 bg-gray-50"
          >
            <div className="px-4 py-3">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-emerald-500 transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for products..."
                  className="bg-transparent outline-none ml-3 text-sm text-gray-700 w-full placeholder-gray-400"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Clear mobile search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
