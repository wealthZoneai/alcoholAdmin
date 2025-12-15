import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import { createMainCategory, updateMainCategory } from "../../../services/apiHelpers";
import { toast } from "react-hot-toast";

interface Category {
  name: string;
  description: string;
  imageUrl?: string;
  status: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: (Category & { id?: string }) | null;
  onSuccess: () => void;
}

const defaultData: Category & { file: File | null } = {
  name: "",
  description: "",
  status: false,
  imageUrl: "",
  file: null,
};

const CreateCategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSuccess,
}) => {
  const [form, setForm] = useState(defaultData);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Populate form if editing
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setForm({
          name: category.name,
          description: category.description,
          status: category.status,
          imageUrl: category.imageUrl || "",
          file: null,
        });
      } else {
        setForm(defaultData);
      }
    }
  }, [isOpen, category]);

  // Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file upload + preview
  const handleFileUpload = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({
        ...p,
        file,
        imageUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }


    try {
      setIsSubmitting(true);

      if (category?.id) {
        // Update existing category
        await updateMainCategory(category.id, form);
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        await createMainCategory(form);
        toast.success("Category created successfully!");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error?.response?.data?.error|| "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-xl p-6 w-full max-w-lg md:max-w-xl shadow-2xl border border-zinc-200 max-h-[85vh] overflow-y-auto no-scrollbar"
          >
            {/* HEADER */}
            <div className="relative flex justify-between items-start mb-6 border-b pb-4 border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-lg shadow-md shadow-green-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900">
                    {category ? "Update Category" : "Create New Category"}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-0.5">
                    {category ? "Modify category details" : "Add a new category to your collection"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors absolute top-0 right-0"
              >
                <X size={22} className="text-zinc-600" />
              </motion.button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="relative space-y-6">
              {/* IMAGE UPLOAD */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                  <ImageIcon size={14} />
                  Category Image
                </label>
                <motion.div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all overflow-hidden ${isDragging
                    ? "border-green-500 bg-green-50"
                    : "border-zinc-300 hover:border-green-400 bg-zinc-50"
                    }`}
                  onClick={() => fileRef.current?.click()}
                >
                  {form.imageUrl ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-lg group">
                      <img
                        src={form.imageUrl}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt="Uploaded"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, file: null, imageUrl: "" });
                        }}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <UploadCloud size={44} className="mx-auto text-green-500" />
                      </motion.div>
                      <p className="text-sm font-semibold text-zinc-700 mt-3">
                        Drop your image here, or click to browse
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Supports: JPG, PNG, WEBP (Max 5MB)
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  />
                </motion.div>
              </div>

              {/* NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700">
                  Category Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Groceries, Electronics, Fashion"
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-white font-medium text-zinc-800 placeholder:text-zinc-400"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all resize-none bg-white font-medium text-zinc-800 placeholder:text-zinc-400"
                  placeholder="Brief description of this category..."
                  disabled={isSubmitting}
                />
              </div>

              {/* STATUS TOGGLE */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                <div>
                  <span className="font-semibold text-zinc-800 text-sm">Category Status</span>
                  <p className="text-xs text-zinc-500">
                    {form.status === true ? "Visible to customers" : "Hidden from customers"}
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      status: form.status === true ? false : true,
                    })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${form.status === true
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-zinc-300"
                    }`}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md ${form.status === true ? "right-0.5" : "left-0.5"
                      }`}
                  />
                </motion.button>
              </div>

              {/* SUBMIT BUTTON */}
              <motion.button
                type="submit"
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold text-base shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all flex items-center justify-center gap-3 relative disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <span className="relative flex items-center gap-3">
                  {isSubmitting ? "Saving..." : category ? "Update Category" : "Create Category"}
                  {!isSubmitting && <Sparkles size={18} />}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCategoryModal;