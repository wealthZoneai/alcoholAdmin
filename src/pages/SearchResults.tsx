import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Heart } from "lucide-react";
import {  useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { searchItems, AddToCart, setFavoriteItem } from "../services/apiHelpers";
import type { RootState } from "../Redux/store";

interface Product {
    id: number;
    name: string;
    price: number;
    discount?: number;
    rating?: number;
    imageUrl?: string;
    description?: string;
    isFavorite?: boolean;
    category?: string; // Optional if API doesn't return it
}

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.user.userId);
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query.trim()) {
                setProducts([]);
                return;
            }
            setLoading(true);
            try {
                const response = await searchItems(query);
                if (response.data) {
                    // Normalize data if necessary (e.g. image vs imageUrl)
                    const mappedProducts = response.data.map((item: any) => ({
                        ...item,
                        // Ensure we use the correct image field. API mock shows 'imageUrl' or 'images' in previous contexts.
                        // The screenshot shows "imageUrl" in the response body.
                        imageUrl: item.imageUrl || item.image || "https://via.placeholder.com/400",
                        // Ensure category exists or default
                        category: item.category || "General"
                    }));
                    setProducts(mappedProducts);
                } else {
                    setProducts([]);
                }
            } catch (error) {
            toast.error("Failed to fetch search results.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

  

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Search className="w-6 h-6 text-green-600" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Search Results
                        </h1>
                    </div>
                    {query && (
                        <p className="text-gray-600">
                            Showing results for <span className="font-semibold text-gray-900">"{query}"</span>
                        </p>
                    )}
                    {!loading && (
                        <p className="text-sm text-gray-500 mt-1">
                            {products.length} product{products.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                )}

                {/* Results */}
                {!loading && (products.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer transition-shadow hover:shadow-xl"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {/* Product Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Category Badge - Optional, shown if available */}
                                    {product.category && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                            {product.category}
                                        </div>
                                    )}
                                    {/* Quick Actions */}
                                 
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-green-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                       
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20"
                    >
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No products found
                        </h2>
                        <p className="text-gray-600 mb-6 text-center max-w-md">
                            We couldn't find any products matching "{query}". Try searching with different keywords.
                        </p>
                        <button
                            onClick={() => navigate("/home")}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
