import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Grid3x3, List, Search, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";

import { getSubcategoryItems, createItem, updateItem, deleteItem, uploadBulkItems, fetchCaregotiesFilters } from "../../../services/apiHelpers";
import { toast } from "react-hot-toast";
import type { RootState } from "../../../Redux/store"; // Adjust path if needed
import SubItemCard from "../../SubCategory/SubItemCard"; // Adjust path
// role removed
// SubItemHeader removed
import CreateItemModal from "../../../components/CreateItemModal";

// Updated product interface
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
    unitType: string;
}

const dummyProducts: GroceryProduct[] = [
    // ... (You can keep this empty or add dummy data if needed)
    {name: '', id:0, subCategoryId:0, price:0, discount:0, rating:0, description:'', isFavorite:false, imageUrl:'', category:'', minValue:0, maxValue:0, unitType:''    },
    { id: 1, subCategoryId: 101, name: "Apple", price: 1.2, discount: 0, rating: 4.5, description: "Fresh red apples", isFavorite: false, imageUrl: "/images/apple.jpg", category: "Fruits", minValue: 1, maxValue: 10, unitType: "kg" },
    { id: 2, subCategoryId: 101, name: "Banana", price: 0.8, discount: 0, rating: 4.2, description: "Ripe bananas", isFavorite: true, imageUrl: "/images/banana.jpg", category: "Fruits", minValue: 1, maxValue: 10, unitType: "kg" },
    { id: 3, subCategoryId: 102, name: "Carrot", price: 0.5, discount: 0, rating: 4.0, description: "Organic carrots", isFavorite: false, imageUrl: "/images/carrot.jpg", category: "Vegetables", minValue: 1, maxValue: 10, unitType: "kg"}];

const AdminInventory: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const subCatIdParam = searchParams.get("subCatId");

    // Fallback if accessed without param
    const { } = useSelector((state: RootState) => state.user);

    const [items, setItems] = useState<GroceryProduct[]>([]);
    const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("SELECT_FILTER");

    // Pagination
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
        setItems(dummyProducts);
        setCurrentPage(0);
        setHasMore(true);
    }, [subCatIdParam]);

    // Fetch items when page changes
    useEffect(() => {
        if (!subCatIdParam) {
            setLoading(false);
            return;
        }

        const load = async () => {
            if (currentPage === 0) {
                await fetchItems(0);
            } else {
                await fetchItems(currentPage);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, subCatIdParam]);

    const fetchItems = async (pageVal: number = 0) => {
        if (!subCatIdParam) return;
        try {
            setLoading(true);
            const response = await getSubcategoryItems(subCatIdParam, pageVal, pageSize);
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
            // toast.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const getFilterItems = async (filterType: string) => {
        if (!subCatIdParam) return;
        if (filterType === "SELECT_FILTER") {
            fetchItems(0);
            setSortBy(filterType);
            return;
        }
        try {
            setLoading(true);
            const response = await fetchCaregotiesFilters(filterType, subCatIdParam);
            if (response.data) {
                const data = Array.isArray(response.data) ? response.data : (response.data.content || []);
                setItems(data);
            }
            setSortBy(filterType);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteItem(id.toString());
            toast.success("Item deleted successfully!");
            // Refresh
            fetchItems(0);
            setCurrentPage(0);
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    const handleSubmitItem = async (data: any) => {
        if (!subCatIdParam) return;
        try {
            if (editingItem) {
                await updateItem(editingItem.id.toString(), data);
                toast.success("Product updated successfully!");
            } else {
                await createItem(subCatIdParam, data);
                toast.success("Product added successfully!");
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

    const handleSubmitBulkItem = async ({ excelFile, zipFile }: { excelFile: File; zipFile: File; }) => {
        if (!subCatIdParam) return;
        try {
            await uploadBulkItems(subCatIdParam, excelFile, zipFile);
            toast.success("Items uploaded successfully!");
            fetchItems(0);
            setCurrentPage(0);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error uploading items:", error);
            toast.error(error?.response?.data?.error || "Failed to upload");
        }
    };

    if (!subCatIdParam) {
        return (
            <div className="min-h-screen bg-[#f8f9fc] pt-24 px-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-gray-800">No Sub-Category Selected</h2>
                <p className="text-gray-500 mb-6">Please select a sub-category from the previous screen to view items.</p>
                <button onClick={() => navigate('/admin/sub-categories')} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">
                    Go to Sub Categories
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 px-4 sm:px-8">

            {/* Nav Header */}
            <div className="max-w-[1600px] mx-auto mb-6 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* SubItem Header equivalent */}
            <div className="max-w-[1600px] mx-auto mb-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Inventory Management</h1>
                        <p className="text-gray-500 max-w-2xl">Manage your products, prices, and stock levels for this category.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 sticky top-20 z-30 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={sortBy}
                                onChange={(e) => getFilterItems(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm font-medium text-gray-700"
                            >
                                <option value="SELECT_FILTER">Sort By</option>
                                <option value="PRICE_LOW_TO_HIGH">Price: Low to High</option>
                                <option value="PRICE_HIGH_TO_LOW">Price: High to Low</option>
                                <option value="TOP_RATED">Top Rated</option>
                            </select>

                            <div className="flex bg-gray-100 rounded-xl p-1 shrink-0">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    <Grid3x3 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    <List size={20} />
                                </button>
                            </div>

                            <button
                                onClick={() => { setEditingItem(null); setItemModalOpen(true); }}
                                className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>

                {loading && items.length === 0 ? (
                    <div className="flex justify-center p-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                        />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No products found in this category.</p>
                        <button onClick={() => { setEditingItem(null); setItemModalOpen(true); }} className="text-emerald-600 font-bold mt-2 hover:underline">Add one now</button>
                    </div>
                ) : (
                    <div className={viewMode === "grid" ? "grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "flex flex-col gap-4"}>
                        <AnimatePresence>
                            {items
                                .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative group"
                                    >
                                        <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingItem(product); setItemModalOpen(true); }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-blue-600 hover:bg-blue-50 shadow-md transform hover:scale-105 transition"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteItem(product.id); }}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-50 shadow-md transform hover:scale-105 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Using SubItemCard for consistent rendering */}
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
                                            unitType={product?.unitType}
                                            onViewDetails={() => { }} // No detail view needed for admin list
                                        />
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Infinite Scroll Sentinel */}
                <div ref={lastElementRef} className="h-4" />
            </div>

            <CreateItemModal
                isOpen={isItemModalOpen}
                onClose={() => { setItemModalOpen(false); setEditingItem(null); }}
                initialData={editingItem}
                onSubmit={handleSubmitItem}
                onBulkSubmit={handleSubmitBulkItem}
            />
        </div>
    );
};

export default AdminInventory;
