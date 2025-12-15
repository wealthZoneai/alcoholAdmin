import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Plus, Pencil, Trash2, Package, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import CreateCategoryModal from "../../components/CreateCategoryModal";
import DeleteModal from "../../components/DeleteModal";
import { getCategoryById, getCategorySubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from "../../services/apiHelpers";
import { toast } from "react-hot-toast";
import SubCategoryBanner from "./SubCategoryBanner";

const SubCategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string }>();
    const { role } = useSelector((state: RootState) => state.user);

    const [category, setCategory] = useState<any>(null);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: any }>({ isOpen: false });
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            setFetchingData(true);

            // Fetch category details
            const categoryResponse = await getCategoryById(categoryId!);
            if (categoryResponse.data) {
                setCategory(categoryResponse.data);
            }

            // Fetch subcategories
            const subcategoriesResponse = await getCategorySubcategories(categoryId!);
            if (subcategoriesResponse.data && Array.isArray(subcategoriesResponse.data)) {
                setSubcategories(subcategoriesResponse.data);
            }
        } catch (err: any) {
            console.error("Error fetching category data:", err);
            setSubcategories([]);
            toast.error("Failed to load category data");
        } finally {
            setFetchingData(false);
        }
    };

    const handleCreateSubcategory = async (subcategoryData: any) => {
        try {
            setLoading(true);
            if (editingSubcategory) {
                const response = await updateSubcategory(editingSubcategory.id, subcategoryData?.data);
                if (response.data) {
                    setSubcategories(subcategories.map((sub: any) =>
                        sub.id === editingSubcategory.id ? response.data : sub
                    ));
                    toast.success("Subcategory updated successfully!");
                }
                setEditingSubcategory(null);
            } else {
                const response = await createSubcategory(categoryId!, subcategoryData?.data);
                if (response.data) {
                    toast.success("Subcategory created successfully!");
                    fetchCategoryData();
                }
            }
            setIsCreateModalOpen(false);
        } catch (err: any) {
            console.error("Error saving subcategory:", err);
            toast.error(err.response?.data?.message || "Failed to save subcategory");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (subcategory: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSubcategory(subcategory);
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (subcategory: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, id: subcategory.id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        try {
            const response = await deleteSubcategory(deleteModal.id);
            if (response.data) {
                toast.success("Subcategory deleted successfully!");
                fetchCategoryData();
                setDeleteModal({ isOpen: false, id: null });
            }
        } catch (err: any) {
            console.error("Error deleting subcategory:", err);
            toast.error("Failed to delete subcategory");
        }
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingSubcategory(null);
    };

    if (fetchingData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600 font-medium">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
            <SubCategoryBanner
                title={category?.name || "Category"}
                description={category?.description || "Explore our selection"}
                image={category?.imageUrl}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Browse Subcategories
                        </h2>
                        <p className="text-gray-600">
                            {subcategories.length} {subcategories.length === 1 ? "category" : "categories"} available
                        </p>
                    </div>

                    {/* Admin Create Button */}
                    {role === "ADMIN" && (
                        <button
                            onClick={() => {
                                setEditingSubcategory(null);
                                setIsCreateModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Add Subcategory
                        </button>
                    )}
                </div>

                {/* Subcategories Grid */}
                {subcategories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-sm p-16 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            No Subcategories Yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Start by creating your first subcategory
                        </p>
                        {role === "ADMIN" && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={20} />
                                Create Subcategory
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {subcategories.map((subcategory: any, index: number) => {
                                const isDisabled = subcategory.status === false;

                                return (
                                    <motion.div
                                        key={subcategory.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        whileHover={!isDisabled ? { y: -8 } : {}}
                                        className={`group relative rounded-2xl shadow-sm cursor-pointer overflow-hidden border 
                                            transition-all duration-300 border border-gray-100
                                            ${isDisabled
                                                ? "bg-gray-200 opacity-80 grayscale "
                                                : "bg-white hover:shadow-2xl"
                                            }
                                        `}
                                        onClick={() =>

                                            !isDisabled && navigate(`/category/${categoryId}/items/${subcategory.id}`)
                                        }
                                    >
                                        {/* Gradient Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                                        {/* Image Container */}
                                        <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gray-100">
                                            <img
                                                src={
                                                    subcategory.imageUrl ||
                                                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                                                }
                                                alt={subcategory.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                            {/* Admin Buttons */}
                                            {role === "ADMIN" && (
                                                <div className="absolute top-3 right-3 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {/* Edit */}
                                                    <button
                                                        onClick={(e) => handleEditClick(subcategory, e)}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md transition-transform hover:scale-110"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={(e) => handleDeleteClick(subcategory, e)}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 shadow-md transition-transform hover:scale-110"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize line-clamp-1">
                                                {subcategory.name}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                                                {subcategory.description || "Explore this category"}
                                            </p>

                                            {/* Explore Button */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                                                    Explore
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </span>
                                                <ChevronRight
                                                    size={20}
                                                    className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateSubcategory}
                initialData={editingSubcategory}
                isLoading={loading}
            />
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Subcategory"
                message="Are you sure you want to permanently delete this subcategory?"
            />
        </div>
    );
};

export default SubCategoryPage;
