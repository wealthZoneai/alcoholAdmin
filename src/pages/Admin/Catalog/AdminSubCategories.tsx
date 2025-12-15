import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Loader2, RefreshCcw, Filter, Image as ImageIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getMainCategories, getCategorySubcategories, deleteSubcategory } from "../../../services/apiHelpers";
import DeleteModal from "../../../components/DeleteModal";
import CreateSubCategoryModal from "./components/CreateSubCategoryModal";

interface MainCategory {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    name: string;
    displayName?: string;
    description: string;
    image?: string;
    imageUrl?: string;
    status: boolean;
    itemCount?: number;
}

const AdminSubCategories = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const urlMainCatId = searchParams.get("mainCatId");

    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [selectedMainCat, setSelectedMainCat] = useState<string>("");
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCat, setEditingSubCat] = useState<SubCategory | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id?: string | null }>({ isOpen: false, id: null });

    useEffect(() => {
        fetchMainCategories();
    }, []);

    useEffect(() => {
        if (urlMainCatId) {
            setSelectedMainCat(urlMainCatId);
        }
    }, [urlMainCatId]);

    useEffect(() => {
        if (selectedMainCat) {
            fetchSubCategories(selectedMainCat);
        } else {
            setSubCategories([]);
        }
    }, [selectedMainCat]);

    const fetchMainCategories = async () => {
        try {
            const response = await getMainCategories();
            const data = Array.isArray(response.data) ? response.data : [];
            setMainCategories(data);
            if (data.length > 0 && !urlMainCatId) {
                setSelectedMainCat(data[0].id);
            }
        } catch (error) {
            console.error("Failed to load main categories", error);
        }
    };

    const fetchSubCategories = async (catId: string) => {
        try {
            setLoading(true);
            const response = await getCategorySubcategories(catId);
            const data = Array.isArray(response.data) ? response.data : (response?.data?.subCategories || []);
            setSubCategories(data);
        } catch (error) {
            console.error("Failed to load subcategories", error);
            toast.error("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        if (!selectedMainCat) {
            toast.error("Please select a main category first");
            return;
        }
        setEditingSubCat(null);
        setIsModalOpen(true);
    };

    const handleEdit = (subCat: SubCategory) => {
        setEditingSubCat(subCat);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        try {
            await deleteSubcategory(deleteModal.id);
            toast.success("Sub-category deleted!");
            setSubCategories(subCategories.filter(c => c.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error("Error deleting subcategory:", error);
            toast.error("Failed to delete sub-category");
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
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sub Categories</h1>
                        <p className="text-gray-500 mt-1">Manage secondary categories.</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => selectedMainCat && fetchSubCategories(selectedMainCat)}
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
                            Add Sub Category
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                        <Filter size={18} />
                        <span>Filter by Parent:</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {mainCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedMainCat(cat.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedMainCat === cat.id
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                ) : subCategories.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No sub-categories found.</p>
                        <button onClick={handleCreateNew} className="text-emerald-600 font-bold mt-2 hover:underline">Create one now</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {subCategories.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => navigate(`/admin/inventory?subCatId=${sub.id}`)}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer"
                            >
                                {/* Image Area */}
                                <div className="h-40 relative overflow-hidden bg-gray-100">
                                    {sub.imageUrl || sub.image ? (
                                        <img
                                            src={sub.imageUrl || sub.image}
                                            alt={sub.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-300">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(sub); }}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 hover:text-blue-600 transition-colors shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(sub.id, e)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-700 hover:text-red-600 transition-colors shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{sub.displayName || sub.name}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {sub.status ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium line-clamp-2 min-h-[40px]">
                                        {sub.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {/* Add New Placeholder */}
                        <button
                            onClick={handleCreateNew}
                            className="h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold">Add Sub Category</span>
                        </button>
                    </div>
                )}

                {/* Create/Edit Modal would be here - passing selectedMainCat */}
                <CreateSubCategoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    subCategory={editingSubCat}
                    mainCategoryId={selectedMainCat}
                    onSuccess={() => fetchSubCategories(selectedMainCat)}
                />

                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, id: null })}
                    onConfirm={confirmDelete}
                    title="Delete Sub-Category?"
                    message="Are you sure? Items inside this sub-category might be affected."
                />
            </div>
        </div>
    );
};

export default AdminSubCategories;
