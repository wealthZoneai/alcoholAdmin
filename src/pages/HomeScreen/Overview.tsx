import React, { useState, useEffect } from "react";
import { Star, Pencil, X, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { RootState } from "../../Redux/store";
import { getHomeOverview, updateHomeOverview } from "../../services/apiHelpers";

interface OverviewData {
  rating: number;
  reviews: number;
}

const defaultData: OverviewData = {
  rating: 3.4,
  reviews: 1360,
};

const ReviewCard: React.FC<OverviewData> = ({ rating, reviews }) => {
  const totalStars = 5;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl shadow-md w-[180px] h-[200px] border border-gray-100 hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Rating Number */}
      <h2 className="text-6xl font-semibold text-black mb-3">
        {rating.toFixed(1)}
      </h2>

      {/* Star Rating */}
      <div className="flex items-center justify-center mb-2">
        {Array.from({ length: totalStars }, (_, i) => {
          const isFilled = i < Math.round(rating);
          return (
            <Star
              key={i}
              size={22}
              className={`${isFilled ? "text-red-500 fill-red-500" : "text-gray-300"
                }`}
            />
          );
        })}
      </div>

      {/* Review Count */}
      <p className="text-sm text-gray-600">{reviews.toLocaleString()} reviews</p>
    </div>
  );
};

const Overview: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);
  const [data, setData] = useState<OverviewData>(defaultData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await getHomeOverview();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  return (
    <section className="relative group/section">
      {/* Admin Edit Button */}
      {role === "ADMIN" && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors opacity-0 group-hover/section:opacity-100"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-center flex-wrap py-2 bg-gray">
        <ReviewCard rating={data.rating} reviews={data.reviews} />
      </div>

      <EditOverviewModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={data}
        onSuccess={(newData) => {
          setData(newData);
          setIsEditModalOpen(false);
        }}
      />
    </section>
  );
};

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: OverviewData;
  onSuccess: (data: OverviewData) => void;
}

const EditOverviewModal: React.FC<EditModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(initialData);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateHomeOverview(form);
      if (response.data) {
        onSuccess(response.data);
        toast.success("Overview updated successfully!");
      }
    } catch (error) {
      console.error("Error updating overview:", error);
      toast.error("Failed to update overview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Edit Overview</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Reviews</label>
                <input
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => setForm({ ...form, reviews: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
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

export default Overview;
