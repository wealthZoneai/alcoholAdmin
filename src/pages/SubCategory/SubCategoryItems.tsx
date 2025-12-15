import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Grid3x3, List, Search } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateItemModal from "../../components/CreateItemModal";
import SubItemCard from "./SubItemCard";
import SubItemHeader from "./SubItemHeader";
import { getSubcategoryItems, createItem, updateItem, deleteItem, uploadBulkItems, fetchCaregotiesFilters } from "../../services/apiHelpers";
import { toast } from "react-hot-toast";
import ProductModal from "../SubCategory/ProductModal";



// Updated product interface to match CreateItemModal fields
export interface GroceryProduct {
    id: number;
    subCategoryId: number;
    name: string;
    price: number;
    discount: number;
    rating: number;
    description: string;
    isFavorite: boolean;
    imageUrl: string;
    category: string;
    minValue: number;
    maxValue: number;
    // stepValue: number;
    unitType: string;
}

const GroceryItems: React.FC = () => {
    const { subcategoryId } = useParams<{ subcategoryId: string }>();
    const { role } = useSelector((state: RootState) => state.user);
    const location = useLocation();
    const { name: categoryName, description: categoryDescription, image: categoryImage } = location.state || {};

    const [items, setItems] = useState<GroceryProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<GroceryProduct | null>(null);
    const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("SELECT_FILTER");

    // Pagination
    // Pagination & Infinite Scroll
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(12);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


    // Reset items when subcategory changes
    useEffect(() => {
        setItems([]);
        setCurrentPage(0);
        setHasMore(true);
    }, [subcategoryId]);

    // Fetch items when page changes
    useEffect(() => {
        if (items.length === 0 && currentPage === 0) {
            fetchItems(0);
        } else if (currentPage > 0) {
            fetchItems(currentPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, subcategoryId]);





    const fetchItems = async (pageVal: number = 0) => {
        try {
            setLoading(true);
            const response = await getSubcategoryItems(subcategoryId!, pageVal, pageSize);
            if (response.data) {
                let newItems: GroceryProduct[] = [];
                let total = 0;

                if (response.data.content && Array.isArray(response.data.content)) {
                    newItems = response.data.content;
                    total = response.data.totalPages;
                } else if (Array.isArray(response.data)) {
                    newItems = response.data;
                    total = 1;
                }

                setItems(prev => pageVal === 0 ? newItems : [...prev, ...newItems]);
                setHasMore(pageVal < total - 1);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const getFilterItems = async (filterType: string) => {
        if (filterType === "SELECT_FILTER") {
            fetchItems();
            setSortBy(filterType);
            return;
        }
        try {
            setLoading(true);
            const response = await fetchCaregotiesFilters(filterType, subcategoryId);
            setItems(response.data);
            setSortBy(filterType);
        } finally {
            setLoading(false);
        }
    };


    // DELETE Item
    const handleDeleteItem = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteItem(id.toString());
            toast.success("Item deleted successfully!");
            await deleteItem(id.toString());
            toast.success("Item deleted successfully!");
            fetchItems(currentPage);
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    // When creating OR updating item
    const handleSubmitItem = async (data: any) => {
        try {
            if (editingItem) {
                // Edit existing item
                await updateItem(editingItem.id.toString(), data);
                toast.success("Item updated successfully!");
            } else {
                // Create new item
                await createItem(subcategoryId!, data);
                toast.success("Item created successfully!");
            }

            fetchItems(0);
            setCurrentPage(0);
            setEditingItem(null);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error saving item:", error);
            toast.error(error?.response?.data?.error || "Failed to save item");
        }
    };
    const handleSubmitBulkItem = async ({
        excelFile,
        zipFile
    }: {
        excelFile: File;
        zipFile: File;
    }) => {
        if (!excelFile) {
            alert("Excel file missing");
            return;
        }
        if (!zipFile) {
            alert("ZIP file missing");
            return;
        }

        try {
            await uploadBulkItems(subcategoryId!, excelFile, zipFile);
            toast.success("Items uploaded successfully!");
            toast.success("Items uploaded successfully!");
            fetchItems(currentPage);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error uploading items:", error);
            toast.error(error?.response?.data?.error || "Failed to upload");
        }
    };



    // Initial Loading state (only for first load)
    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="pt-16">
                <SubItemHeader
                    title={categoryName || "Premium Collection"}
                    tagline={categoryDescription || "Discover our exclusive range of products"}
                    emoji="✨"
                    imageUrl={categoryImage}
                />
            </div>

            {/* Filters & Controls */}
            <div className="max-w-7xl mx-auto  py-6">
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Sort & View Controls */}
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => getFilterItems(e.target.value as any)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
                            >
                                <option value="SELECT_FILTER">Select Filter</option>
                                <option value="PRICE_LOW_TO_HIGH">Price: Low to High</option>
                                <option value="PRICE_HIGH_TO_LOW">Price: High to Low</option>
                                <option value="TOP_RATED">Top Rated</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Grid3x3 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                        ? "bg-white shadow-sm text-emerald-600"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            {/* ADMIN: Create Item */}
                            {role === "ADMIN" && (
                                <button
                                    onClick={() => {
                                        setEditingItem(null);
                                        setItemModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 shadow-md hover:shadow-lg transition-all"
                                >
                                    <Plus size={20} />
                                    Add Item
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <p>
                            Showing <span className="font-semibold text-gray-800">{items.length}</span> products
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                </div>

                {/* Product Grid/List */}
                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchQuery ? "No products found" : "No products available"}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Check back later for new items"}
                        </p>
                    </motion.div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                                : "flex flex-col gap-4"
                        }
                    >
                        <AnimatePresence>
                            {items.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative group"
                                >
                                    {/* Admin Edit/Delete */}
                                    {role === "ADMIN" && (
                                        <div className="absolute top-3 right-10 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                                            {/* Edit */}
                                            <button
                                                onClick={() => {
                                                    setEditingItem(product);
                                                    setItemModalOpen(true);
                                                }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md transform hover:scale-110 transition"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDeleteItem(product.id)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md transform hover:scale-110 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Card */}
                                    <SubItemCard
                                        id={product?.id}
                                        name={product?.name}
                                        category={product?.category}
                                        price={product?.price}
                                        image={product?.imageUrl}
                                        discount={product?.discount}
                                        rating={product?.rating}
                                        minValue={product?.minValue}
                                        maxValue={product?.maxValue}
                                        // stepValue={product?.stepValue}
                                        unitType={product?.unitType}
                                        onViewDetails={() => setSelectedProduct(product)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}


                {/* Infinite Scroll Loader */}
                {loading && items.length > 0 && (
                    <div className="flex justify-center p-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                        />
                    </div>
                )}

                {/* Intersection Sentinel */}
                <div ref={lastElementRef} className="h-4" />
            </div>

            {/* PRODUCT DETAILS POPUP */}
            <ProductModal
                selectedProduct={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                allProducts={items}
                onSelectProduct={setSelectedProduct}
            />

            {/* Create / Edit Item Modal */}
            <CreateItemModal
                isOpen={isItemModalOpen}
                onClose={() => {
                    setItemModalOpen(false);
                    setEditingItem(null);
                }}
                initialData={editingItem}
                onSubmit={handleSubmitItem}
                onBulkSubmit={handleSubmitBulkItem}
            />
        </div>
    );
};

export default GroceryItems;
