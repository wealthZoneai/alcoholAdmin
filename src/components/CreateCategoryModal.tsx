import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: any) => Promise<void>;
    initialData?: any;
    isLoading?: boolean;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading = false,
}) => {
    const defaultData = {
        name: "",
        description: "",
        gradient: "text-white",
        iconColor: "text-green-600",
        status: true,
        image: "", // preview URL
    };

    const [formData, setFormData] = useState(defaultData);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // ------------------------------------------------
    // Load initial data for Edit
    // ------------------------------------------------
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    ...initialData,
                    name:  initialData.name || "",
                    image: initialData.imageUrl || "",
                });
                setImageFile(null);
            } else {
                setFormData(defaultData);
                setImageFile(null);
            }
        }
    }, [isOpen, initialData]);

    // ------------------------------------------------
    // Handle input change
    // ------------------------------------------------
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            return newData;
        });
    };

    // ------------------------------------------------
    // Submit form
    // ------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            imageFile, // actual image blob
        };

        if (initialData?.id) {
            await onSubmit({ type: "update", id: initialData.id, data: finalData });
        } else {
            await onSubmit({ type: "create", data: finalData });
        }

        onClose();
        setFormData(defaultData);
        setImageFile(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {initialData ? "Edit Category" : "Create New Category"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Category Name (Display)
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Upload Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (file) {
                                                setImageFile(file);
                                                const previewUrl = URL.createObjectURL(file);

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    image: previewUrl,
                                                }));
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                                    />

                                    {formData.image && (
                                        <div className="mt-3 h-32 w-full rounded-xl overflow-hidden border">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                                    />
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between mt-4">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Status
                                    </label>

                                    <div
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                status: prev.status === true ? false : true,
                                            }))
                                        }
                                        className={`relative w-16 h-8 flex items-center cursor-pointer rounded-full transition-all ${
                                            formData.status === true
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                        }`}
                                    >
                                        <div
                                            className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all ${
                                                formData.status === true
                                                    ? "translate-x-8"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </div>

                                    <span
                                        className={`ml-2 text-sm font-semibold ${
                                            formData.status === true
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {formData.status === true ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white font-bold py-3 rounded-xl"
                                >
                                    {initialData ? "Save Changes" : "Create Category"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateCategoryModal;
