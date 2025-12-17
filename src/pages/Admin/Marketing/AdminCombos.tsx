import React, { useEffect, useState } from "react";
import { Plus, Loader2, Tag } from "lucide-react";
import { toast } from "react-hot-toast";

import { getHomeBanner, deleteHomeCombo } from "../../../services/apiHelpers";
import ComboCard from "./ComboCard";
import ComboModal from "../../../components/ComboModal";

/* ================= TYPES ================= */

export interface BannerData {
  id: any;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

const AdminCombos = () => {
  /* ================= STATE ================= */

  const [banners, setBanners] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerData | null>(null);

  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchBanner();
  }, []);

  /* ================= FETCH ================= */

  const fetchBanner = async () => {
    try {
      setLoading(true);

      const response = await getHomeBanner("SHOP_COLLECTION");

      if (response?.data?.length > 0) {
        const formatted: BannerData[] = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.description,
          image: item.imageUrl,
          description: item.description,
        }));

        setBanners(formatted);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load combos");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this combo?")) return;

    try {
      await deleteHomeCombo(id.toString());
      setBanners((prev) => prev.filter((item) => item.id !== id));
      toast.success("Combo deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Tag className="text-orange-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Bundles & Packs
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Create curated bundles like party packs.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          <Plus size={20} /> Add Combo
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center mt-32">
          <Loader2 className="animate-spin text-orange-600" size={32} />
        </div>
      ) : banners.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((item) => (
            <ComboCard
              key={item.id}
              item={item}
              onEdit={() => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto text-center py-24 text-gray-400">
          No combos found
        </div>
      )}

      {/* MODAL */}
      <ComboModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSuccess={(newItem: BannerData) => {
          if (editingItem) {
            setBanners((prev) =>
              prev.map((b) => (b.id === newItem.id ? newItem : b))
            );
          } else {
            setBanners((prev) => [...prev, newItem]);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminCombos;
