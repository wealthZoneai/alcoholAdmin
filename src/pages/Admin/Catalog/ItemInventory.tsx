import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Grid3x3, List, Search } from "lucide-react";
import { useSelector } from "react-redux";

import { getAllItems, createItem, updateItem, deleteItem, uploadBulkItems, updateItemStatus } from "../../../services/apiHelpers";
import { toast } from "react-hot-toast";
import type { RootState } from "../../../Redux/store";
import CreateItemModal from "../../../components/CreateItemModal";
import SubItemCard from "../../SubCategory/SubItemCard";

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
    category?: string;
    minValue: number;
    maxValue: number;
    unitType: string;
    stock: number;
    isActive?: boolean;
    itemStatus?: string;
    visibilityStatus?: string;
}

const AdminInventory: React.FC = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { } = useSelector((state: RootState) => state.user);

    const [items, setItems] = useState<GroceryProduct[]>([]);
    const [editingItem, setEditingItem] = useState<GroceryProduct | null>(null);
    const [isItemModalOpen, setItemModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Initial false to avoid double load trigger
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

    // Infinite Scroll State
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const [pageSize, setPageSize] = useState(15);

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


    const fetchItems = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllItems(page, pageSize);

            if (response.data) {
                const content = response.data.content || response.data;
                const totalPageCount = response.data.totalPages || 0;

                const newItems = Array.isArray(content) ? content : [];

                setItems(prev => page === 0 ? newItems : [...prev, ...newItems]);
                setHasMore(page < totalPageCount - 1);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchItems(0);
    }, []);

    // Load more when page increments
    useEffect(() => {
        if (currentPage > 0) {
            fetchItems(currentPage);
        }
    }, [currentPage]);

    const handleDeleteItem = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteItem(id.toString());
            toast.success("Item deleted successfully!");
            // Refresh list - easiest way is to reset to page 0
            setCurrentPage(0);
            fetchItems(0);
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    const handleToggleStatus = async (item: GroceryProduct) => {
        const isCurrentlyActive = item.itemStatus === "ACTIVE" || (item.itemStatus === undefined && item.isActive !== false);
        const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";
        const currentVisibility = (item.visibilityStatus as "VISIBLE" | "HIDDEN") || "VISIBLE";

        // Optimistic Update
        const updatedItem = {
            ...item,
            isActive: newStatus === "ACTIVE",
            itemStatus: newStatus
        };
        setItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));

        try {
            await updateItemStatus(item.id.toString(), newStatus, currentVisibility);
            toast.success(`Item marked as ${newStatus.toLowerCase()}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            // Rollback
            setItems(prev => prev.map(i => i.id === item.id ? item : i));
        }
    };

    const handleSubmitItem = async (data: any) => {
        try {
            if (editingItem) {
                await updateItem(editingItem.id.toString(), data);
                toast.success("Product updated successfully!");
            } else {
                if (!data.subCategoryId && !editingItem) {
                    toast.error("Please go to a specific Category to add items.");
                    return;
                }

                await createItem(data.subCategoryId, data);
                toast.success("Product added successfully!");
            }
            // Refresh list
            setCurrentPage(0);
            fetchItems(0);
            setEditingItem(null);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error saving item:", error);
            toast.error(error?.response?.data?.error || "Failed to save item");
        }
    };

    const handleSubmitBulkItem = async (data: { excelFile: File; zipFile: File; subCategoryId?: string }) => {
        if (!data.subCategoryId) {
            toast.error("Sub-Category ID is missing for bulk upload.");
            return;
        }

        try {
            await uploadBulkItems(data.subCategoryId, data.excelFile, data.zipFile);
            toast.success("Bulk Items uploaded successfully!");
            // Refresh list
            setCurrentPage(0);
            fetchItems(0);
            setItemModalOpen(false);
        } catch (error: any) {
            console.error("Error bulk uploading items:", error);
            toast.error(error?.response?.data?.error || "Failed to upload bulk items");
        }
    };

    const filteredItems = items.filter(i => {
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isCurrentlyActive = i.itemStatus === 'ACTIVE' || (i.itemStatus === undefined && i.isActive !== false);
        const matchesStatus = statusFilter === "ALL"
            ? true
            : statusFilter === "ACTIVE"
                ? isCurrentlyActive
                : !isCurrentlyActive;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 pt-24 font-sans text-gray-800">
            <div className="max-w-7xl mt-10 mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Inventory Logic</h1>
                        <p className="text-gray-500 mt-1">Manage global inventory, prices, and stock.</p>
                    </div>
                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setItemModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-200 dark:shadow-none font-medium"
                        >
                            <Plus size={18} />
                            <span>Add Item</span>
                        </button>
                    </div>
                </header>


                {/* Controls Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center sticky top-20 z-30">

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        <div className="relative group w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                            {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status as any)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter === status
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View & Pagination Controls */}
                    <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500 hidden sm:block">Rows:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Grid3x3 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full mb-4"
                            />
                            <p className="text-gray-400 font-medium animate-pulse">Loading inventory...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Search size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No items found</h3>
                            <p className="text-gray-500 max-w-sm mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    ) : (
                        viewMode === "list" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                            <th className="p-4 pl-6 md:pl-8">Product</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Price</th>
                                            <th className="p-4">Stock</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right pr-6 md:pr-8">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                                <td className="p-4 pl-6 md:pl-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{item.name}</div>
                                                            <div className="text-xs text-gray-500">{item.unitType}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {(() => {
                                                        const name = item.name?.toLowerCase() || "";
                                                        const cat = (item.category || "").toLowerCase();

                                                        // Derivation logic: check name if category is missing
                                                        const isAlcohol = cat.includes("alcohol") ||
                                                            name.includes("wine") ||
                                                            name.includes("beer") ||
                                                            name.includes("vodka") ||
                                                            name.includes("whisky");

                                                        const isGroceries = cat.includes("grocer") ||
                                                            name.includes("potato") ||
                                                            name.includes("cabbage") ||
                                                            name.includes("carrot") ||
                                                            name.includes("mango") ||
                                                            name.includes("beetroot");

                                                        if (isAlcohol) {
                                                            return (
                                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                                                                    Alcohol
                                                                </span>
                                                            );
                                                        } else if (isGroceries) {
                                                            return (
                                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                                                                    Groceries
                                                                </span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-100">
                                                                    {item.category || "General"}
                                                                </span>
                                                            );
                                                        }
                                                    })()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-900">${item.price.toFixed(2)}</div>
                                                    {item.discount > 0 && (
                                                        <div className="text-xs text-red-500 line-through">${(item.price + item.discount).toFixed(2)}</div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className={`font-semibold ${item.stock < 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {item.stock} {item.unitType}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${(item.itemStatus === 'ACTIVE' || (item.itemStatus === undefined && item.isActive !== false)) ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                    >
                                                        <span
                                                            className={`${(item.itemStatus === 'ACTIVE' || (item.itemStatus === undefined && item.isActive !== false)) ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                                                        />
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right pr-6 md:pr-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingItem(item); setItemModalOpen(true); }}
                                                            className="p-2 text-blue-600 bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="p-2 text-red-600 bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
                                {filteredItems.map((product) => (
                                    <div key={product.id} className="relative group">
                                        <button
                                            onClick={() => { setEditingItem(product); setItemModalOpen(true); }}
                                            className="absolute top-2 right-2 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-blue-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <SubItemCard
                                            id={product?.id}
                                            name={product?.name}
                                            category={product?.category || "General"}
                                            price={product?.price}
                                            image={product?.imageUrl}
                                            discount={product?.discount}
                                            rating={product?.rating}
                                            minValue={product?.minValue}
                                            maxValue={product?.maxValue}
                                            unitType={product?.unitType}
                                            onViewDetails={() => { }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {/* Infinite Scroll Loader & Sentinel */}
                    {loading && (
                        <div className="flex justify-center p-8 bg-gray-50/50">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                            />
                        </div>
                    )}
                    <div ref={lastElementRef} className="h-4" />
                </div>

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
