import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Tag, UploadCloud, ArrowRight, Sparkles, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeCombos, createHomeCombo, updateHomeCombo, deleteHomeCombo } from "../../../services/apiHelpers";

interface ComboItem {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    className: string;
}

const AdminCombos = () => {
    const [combos, setCombos] = useState<ComboItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ComboItem | null>(null);

    useEffect(() => {
        fetchCombos();
    }, []);

    const fetchCombos = async () => {
        try {
            const response = await getHomeCombos();
            if (response.data && Array.isArray(response.data)) {
                setCombos(response.data);
            }
        } catch (error) {
            console.error("Error fetching combos:", error);
            toast.error("Failed to load combos");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this combo?")) return;
        try {
            await deleteHomeCombo(id.toString());
            setCombos(combos.filter(c => c.id !== id));
            toast.success("Combo deleted successfully");
        } catch (error) {
            toast.error("Failed to delete combo");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Tag className="text-orange-600" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Product Bundles & Packs</h1>
                    </div>
                    <p className="text-gray-500 ml-12">Create curated bundles like "Monthly Grocery Kit" or "Party Starter Pack".</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition-all hover:shadow-orange-200"
                >
                    <Plus size={20} />
                    Add New Combo
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-orange-600" size={32} />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {combos.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Sparkles size={10} /> Special
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-blue-600 transition-colors shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-red-600 transition-colors shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.subtitle}</p>
                                <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold">
                                    View Details <ArrowRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {combos.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <Tag size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">No combos found</p>
                            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-orange-600 font-semibold hover:underline">
                                Create your first combo
                            </button>
                        </div>
                    )}
                </div>
            )}

            <ComboModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingItem}
                onSuccess={(newItem: ComboItem) => {
                    if (editingItem) {
                        setCombos(combos.map(c => c.id === newItem.id ? newItem : c));
                        toast.success("Combo updated");
                    } else {
                        setCombos([...combos, newItem]);
                        toast.success("Combo created");
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: ComboItem | null;
    onSuccess: (item: ComboItem) => void;
}

const ComboModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        className: "md:col-span-1 md:row-span-1 h-[240px]",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    title: initialData.title,
                    subtitle: initialData.subtitle,
                    className: initialData.className,
                });
                setPreview(initialData.image);
            } else {
                setForm({
                    title: "",
                    subtitle: "",
                    className: "md:col-span-1 md:row-span-1 h-[240px]",
                });
                setPreview("");
            }
            setImageFile(null);
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("subtitle", form.subtitle);
            formData.append("className", form.className);
            if (imageFile) formData.append("image", imageFile);

            let response;
            if (initialData) {
                response = await updateHomeCombo(initialData.id.toString(), formData);
            } else {
                response = await createHomeCombo(formData);
            }

            if (response.data) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save combo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{initialData ? "Edit Combo" : "New Combo"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Cover Image</label>
                                <div className="relative h-48 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-orange-500 transition-colors group">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <UploadCloud size={32} className="mb-2" />
                                            <span className="text-xs">Click to upload</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    placeholder="e.g. Weekend Party Pack"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                <input
                                    type="text"
                                    required
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    placeholder="e.g. Chips, Dips & Drinks"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-200"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    Save Combo
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminCombos;
