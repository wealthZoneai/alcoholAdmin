import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMainCategories, deleteMainCategory } from "../../../services/apiHelpers";
import CreateCategoryModal from "../../HomeScreen/HomeCategories/CreateMainCategoryModal";
import DeleteModal from "../../../components/DeleteModal";

interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    status: boolean;
    itemCount?: number;
}

const AdminCategories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: string | null }>({ isOpen: false, id: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getMainCategories();
            // Ensure we map the API response to our interface correctly
            // API might return different structure, adjusting based on typical response
            const data = Array.isArray(response.data) ? response.data : [];
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        try {
            await deleteMainCategory(deleteModal.id);
            toast.success("Category deleted successfully!");
            setCategories(categories.filter(c => c.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error(error?.response?.data?.message || "Failed to delete category");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Main Categories</h1>
                        <p className="text-gray-500 mt-1">Organize your menu structure.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={fetchCategories}
                            className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            title="Refresh"
                        >
                            <RefreshCcw size={20} className={`${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleCreateNew}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Plus size={20} />
                            Add Category
                        </button>
                    </div>
                </div>

                {loading && categories.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => navigate(`/admin/sub-categories?mainCatId=${category.id}`)}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer"
                            >
                                {/* Image Area */}
                                <div className="h-48 relative overflow-hidden bg-gray-100">
                                    <img
                                        src={category.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80"}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(category.id, e)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 hover:text-red-600 transition-colors shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{category.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {category.status ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium line-clamp-2 min-h-[40px]">
                                        {category.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Add New Placeholder */}
                        <button
                            onClick={handleCreateNew}
                            className="h-full min-h-[250px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                <Plus size={32} />
                            </div>
                            <span className="font-semibold">Create New Category</span>
                        </button>
                    </div>
                )}

                <CreateCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    category={editingCategory}
                    onSuccess={fetchCategories}
                />

                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, id: null })}
                    onConfirm={confirmDelete}
                    title="Delete Category?"
                    message="Are you sure you want to delete this category? All sub-categories and items within it may be affected."
                />
            </div>
        </div>
    );
};

export default AdminCategories;
