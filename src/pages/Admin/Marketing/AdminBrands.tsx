import React, { useEffect, useState } from "react";
import {
  UploadCloud,
  Save,
  Loader2,
  Award,
  Star,
  Wine
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  createOrUpdateHomeBanner,
  getHomeBanner
} from "../../../services/apiHelpers";

/* ================= TYPES ================= */

interface BrandData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

/* ================= DEFAULT ================= */

const defaultData: BrandData = {
  title: "Popular Brands",
  subtitle: "Premium & Elegant",
  description:
    "Discover the world of wine — from bold reds to refreshing whites.",
  image:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940"
};

/* ================= COMPONENT ================= */

const AdminBrands = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [bannerId, setBannerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BrandData>(defaultData);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");


  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getHomeBanner("TOP_BRAND");

      if (response?.data?.length > 0) {
        const b = response.data[0];

        setBannerId(b.id);

        setFormData({
          title: b.title || "",
          subtitle: b.subtitle || "",
          description: b.description || "",
          image: b.imageUrl || ""
        });

        // 🔥 keep preview in sync
        setPreview(b.imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to load banner");
    } finally {
      setInitialLoading(false);
    }
  };

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // 🔥 instant preview
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
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
      fd.append("section", "TOP_BRAND");
      fd.append("orderIndex", "2");
      fd.append("title", formData.title);
      fd.append("subtitle", formData.subtitle);
      fd.append("description", formData.description);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const response = await createOrUpdateHomeBanner(
        fd,
        bannerId ?? undefined
      );


      toast.success("Banner saved successfully");

      // 🔥 sync UI after save
      setBannerId(response.data.id);
      setFormData({
        title: response.data.title,
        subtitle: response.data.subtitle,
        description: response.data.description,
        image: response.data.imageUrl
      });
      setPreview(response.data.imageUrl);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fc] pt-6 px-4">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Award className="text-purple-600" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Popular Brands Section
          </h1>
        </div>
        <p className="text-gray-500 ml-12">
          Manage featured brands on the home screen.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* IMAGE */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Section Image
                </label>

                <div className="relative h-64 border-2 border-gray-200 rounded-xl overflow-hidden group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
                  />

                  {preview ? (
                    <>
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white flex items-center gap-2">
                          <UploadCloud /> Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <UploadCloud size={40} />
                      <span>Upload Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* INPUTS */}
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Main Heading"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />

              <input
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Subtitle"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />

              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />

              <button
                disabled={loading}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                )}
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="bg-white rounded-3xl shadow border border-gray-200 overflow-hidden">
          <div className="relative h-48">
            <img
              src={preview || defaultData.image}
              className="w-full h-full object-cover"
              alt="Preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60" />
          </div>

          <div className="p-6">
            <h3 className="font-bold text-xl mb-2">{formData.subtitle}</h3>
            <p className="text-gray-600 text-sm mb-4">
              {formData.description}
            </p>

            <div className="flex gap-2">
              {[Wine, Award, Star].map((Icon, i) => (
                <div key={i} className="p-2 bg-purple-50 rounded-lg">
                  <Icon size={14} className="text-purple-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;
