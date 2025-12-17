import React, { useEffect, useState } from "react";
import { UploadCloud, Loader2, X, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { createOrUpdateHomeBanner } from "../services/apiHelpers";

/* ================= TYPES ================= */

export interface BannerData {
  id: any;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: BannerData | null;
  onSuccess: (item: BannerData) => void;
}

/* ================= COMPONENT ================= */

const ComboModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  /* ================= PREFILL (EDIT MODE) ================= */

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubtitle(initialData.subtitle);

      // ✅ backend image url
      setPreview(initialData.image || "");
    } else {
      setTitle("");
      setSubtitle("");
      setPreview("");
    }

    setImageFile(null);
  }, [initialData, isOpen]);

  /* ================= CLEANUP OBJECT URL ================= */

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("section", "SHOP_COLLECTION");
      fd.append("orderIndex", "3");
      fd.append("title", title);
      fd.append("description", subtitle);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await createOrUpdateHomeBanner(
        fd,
        initialData?.id
      );

      toast.success("Combo saved successfully");
      onSuccess(res.data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save combo");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <h2 className="text-lg font-bold">
                {initialData ? "Edit Combo" : "Create New Combo"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <X />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Combo Image
                </label>

                <div className="relative group h-48 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer hover:border-orange-500 transition">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <ImagePlus size={18} />
                          Replace Image
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <UploadCloud size={36} />
                      <p className="mt-2 text-sm">Upload combo image</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setImageFile(file);

                      // 🔥 PREVIEW FIX
                      const url = URL.createObjectURL(file);
                      setPreview(url);
                    }}
                  />
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Party Pack"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                />
              </div>

              {/* SUBTITLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Beer, Snacks & More"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-orange-300 transition flex items-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {initialData ? "Update Combo" : "Create Combo"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComboModal;
