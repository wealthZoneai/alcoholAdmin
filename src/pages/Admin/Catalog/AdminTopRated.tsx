import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Star, UploadCloud, TrendingUp, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeTopRated, createHomeTopRated, updateHomeTopRated, deleteHomeTopRated } from "../../../services/apiHelpers";

interface Product {
    id: number;
    name: string;
    image: string;
    rating: number;
    reviews: number;
    category: "top" | "best";
}

const AdminTopRated = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getHomeTopRated();
            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await deleteHomeTopRated(id.toString());
            setProducts(products.filter(p => p.id !== id));
            toast.success("Item deleted");
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <TrendingUp className="text-yellow-600" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Top Rated & Best Sellers</h1>
                    </div>
                    <p className="text-gray-500 ml-12">Manage featured products showcase.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-700 transition-all hover:shadow-yellow-200"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-yellow-600" size={32} />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 relative"
                        >
                            {/* Badge */}
                            <div className="absolute top-3 left-3 z-10">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.category === 'top' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {item.category === 'top' ? 'Top Rated' : 'Best Seller'}
                                </span>
                            </div>

                            <div className="relative h-48 overflow-hidden bg-gray-50">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingItem(item);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                                    >
                                        <Edit2 size={16} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                                <div className="flex items-center gap-1 mb-2">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-semibold">{item.rating}</span>
                                    <span className="text-xs text-gray-400">({item.reviews})</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            No products found.
                        </div>
                    )}
                </div>
            )}

            <TopRatedModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingItem}
                onSuccess={(newItem: Product) => {
                    if (editingItem) {
                        setProducts(products.map(p => p.id === newItem.id ? newItem : p));
                        toast.success("Updated successfully");
                    } else {
                        setProducts([...products, newItem]);
                        toast.success("Created successfully");
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
    initialData: Product | null;
    onSuccess: (item: Product) => void;
}

const TopRatedModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    const [form, setForm] = useState({
        name: "",
        rating: 5,
        reviews: 0,
        category: "top" as "top" | "best",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    name: initialData.name,
                    rating: initialData.rating,
                    reviews: initialData.reviews,
                    category: initialData.category,
                });
                setPreview(initialData.image);
            } else {
                setForm({
                    name: "",
                    rating: 5,
                    reviews: 0,
                    category: "top",
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
            formData.append("name", form.name);
            formData.append("rating", form.rating.toString());
            formData.append("reviews", form.reviews.toString());
            formData.append("category", form.category);
            if (imageFile) formData.append("image", imageFile);

            let response;
            if (initialData) {
                response = await updateHomeTopRated(initialData.id.toString(), formData);
            } else {
                response = await createHomeTopRated(formData);
            }

            if (response.data) {
                onSuccess(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save");
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
                        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                    >
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{initialData ? "Edit Item" : "New Item"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Product Image</label>
                                <div className="relative h-40 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-yellow-500 transition-colors group">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <UploadCloud size={32} className="mb-2" />
                                            <span className="text-xs">Click to upload</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value as "top" | "best" })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 outline-none"
                                    >
                                        <option value="top">Top Rating</option>
                                        <option value="best">Best Selling</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={form.rating}
                                        onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Reviews Count</label>
                                <input
                                    type="number"
                                    value={form.reviews}
                                    onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-yellow-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium flex items-center gap-2"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AdminTopRated;
