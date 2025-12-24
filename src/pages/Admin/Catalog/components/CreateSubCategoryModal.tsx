import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Trash2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { createSubcategory, updateSubcategory } from "../../../../services/apiHelpers";

interface SubCategory {
    id: string;
    name: string;
    displayName?: string;
    description: string;
    image?: string;
    imageUrl?: string;
    status: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    subCategory?: (SubCategory & { id?: string }) | null;
    mainCategoryId: string;
    onSuccess: () => void;
}

const defaultData = {
    name: "",
    description: "",
    status: false,
    imageUrl: "",
    imageFile: null as File | null,
};

const CreateSubCategoryModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    subCategory,
    mainCategoryId,
    onSuccess,
}) => {
    const [form, setForm] = useState(defaultData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (subCategory) {
                setForm({
                    name: subCategory.displayName || subCategory.name,
                    description: subCategory.description,
                    status: subCategory.status,
                    imageUrl: subCategory.imageUrl || subCategory.image || "",
                    imageFile: null,
                });
            } else {
                setForm(defaultData);
            }
        }
    }, [isOpen, subCategory]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (file?: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setForm((p) => ({
                ...p,
                imageFile: file,
                imageUrl: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Name is required");
            return;
        }

        if (!mainCategoryId && !subCategory) {
            toast.error("Parent category mismatch");
            return;
        }

        try {
            setIsSubmitting(true);

            if (subCategory?.id) {
                await updateSubcategory(subCategory.id, form);
                toast.success("Sub-category updated!");
            } else {
                await createSubcategory(mainCategoryId, form);
                toast.success("Sub-category created!");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error saving subcategory:", error);
            toast.error(error?.response?.data?.message || "Failed to save sub-category");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl border border-zinc-200 max-h-[85vh] overflow-y-auto no-scrollbar"
                    >
                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-zinc-900">
                                    {subCategory ? "Edit Sub-Category" : "New Sub-Category"}
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    {subCategory ? "Update details below" : "Add a sub-category under the selected parent"}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
                                <X size={22} className="text-zinc-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">Image</label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-zinc-50 transition-all"
                                >
                                    {form.imageUrl ? (
                                        <div className="relative h-40 rounded-lg overflow-hidden group">
                                            <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                            <button type="button" onClick={(e) => { e.stopPropagation(); setForm({ ...form, imageUrl: "", imageFile: null }); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-6 flex flex-col items-center text-zinc-400">
                                            <UploadCloud size={40} className="mb-2" />
                                            <span className="text-sm">Click to upload</span>
                                        </div>
                                    )}
                                    <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none"
                                    placeholder="e.g. Traditional Pizzas"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Status Toggle */}
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                                <span className="font-semibold text-zinc-700">Active Status</span>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, status: !form.status })}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${form.status ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.status ? "left-7" : "left-1"}`} />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Sparkles className="animate-spin" /> : <Sparkles />}
                                {isSubmitting ? "Saving..." : "Save Sub-Category"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateSubCategoryModal;
