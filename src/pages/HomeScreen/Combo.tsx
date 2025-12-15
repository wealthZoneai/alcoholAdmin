import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Tag, Sparkles } from "lucide-react";
import { getHomeCombos } from "../../services/apiHelpers";

interface ComboItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  className: string;
}

const defaultCombos: ComboItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdpbmVzfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
    title: "The Taste of Europe",
    subtitle: "Curated wines from Italy, France & Spain",
    className: "md:col-span-2 md:row-span-2 h-[500px]",
  },
  {
    id: 2,
    image: "https://plus.unsplash.com/premium_photo-1682097091093-dd18b37764a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2luZXxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000",
    title: "Mixed Wine Packs",
    subtitle: "Perfect for tasting parties",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=1000",
    title: "Paris Best Reds",
    subtitle: "Bold & Elegant",
    className: "md:col-span-1 md:row-span-1 h-[240px]",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&q=80&w=1000",
    title: "Classic Collection",
    subtitle: "Timeless favorites",
    className: "md:col-span-2 md:row-span-1 h-[240px]",
  },
];

const Combo: React.FC = () => {
  const [combos, setCombos] = useState<ComboItem[]>(defaultCombos);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await getHomeCombos();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setCombos(response.data);
      }
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  return (
    <section className="w-full bg-white py-6 px-4 md:px-5 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-red-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={20} className="text-orange-600" />
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                Special Deals
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Combo Collections
            </h2>
            <p className="text-gray-600">
              Handpicked sets for every occasion
            </p>
          </div>
        </div>

        {/* Horizontal Scrolling Combos */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x no-scrollbar snap-mandatory">
            {combos.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] sm:w-[380px] snap-start"
              >
                <div className="relative h-[420px] rounded-3xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span className="text-sm font-bold">Special Offer</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-200 text-sm mb-4">
                        {item.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-orange-400 font-semibold">
                        <span className="text-sm">Shop Now</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}

            {/* Scroll Hint */}
            {combos.length > 3 && (
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Combo;
