import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { searchItems } from "../services/apiHelpers";
import SubItemCard from "./SubCategory/SubItemCard";

interface Product {
    id: number;
    name: string;
    price: number;
    discount?: number;
    rating?: number;
    imageUrl?: string;
    description?: string;
    isFavorite?: boolean;
    category?: string;
    stock?: number;
    minValue?: number;
    maxValue?: number;
    unitType?: string;
}

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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
                    // Normalize data
                    const mappedProducts = response.data.map((item: any) => ({
                        ...item,
                        // Ensure we use the correct image field.
                        imageUrl: item.imageUrl || item.image || "https://via.placeholder.com/400",
                        // Ensure category exists or default
                        category: item.category || "General",
                        stock: item.stock !== undefined ? item.stock : 0, // Default to 0 if undefined to show out of stock? Or maybe 10? assuming 0 for safety.
                        minValue: item.minValue,
                        maxValue: item.maxValue,
                        unitType: item.unitType
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
                            // layoutId={`product-${product.id}`} // Optional: for smooth weak layout transitions
                            >
                                <SubItemCard
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.imageUrl || ""}
                                    discount={product.discount}
                                    rating={product.rating}
                                    category={product.category || "General"}
                                    minValue={product.minValue}
                                    maxValue={product.maxValue}
                                    // stock={product.stock}
                                    unitType={product.unitType}
                                    onViewDetails={() => navigate(`/product/${product.id}`)}
                                />
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
