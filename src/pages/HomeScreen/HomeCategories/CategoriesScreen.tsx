import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ChevronRight, Sparkles } from "lucide-react";
import { getMainCategories } from "../../../services/apiHelpers";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  status: boolean;
}

const CategoriesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getMainCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Explore
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-600 mt-2">
              Browse through our curated collections
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        ) : (
          /* Horizontal Scrolling Categories */
          <div className="relative">
            {/* Scroll Container */}
            <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                >
                  <div
                    onClick={() => navigate(`/category/${category.id}`)}
                    className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image */}
                    <img
                      src={category.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80"}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.name}
                        </h3>
                        <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <span className="text-sm">Explore</span>
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesScreen;
