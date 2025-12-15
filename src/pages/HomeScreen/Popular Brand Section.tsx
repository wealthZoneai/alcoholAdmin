import React, { useEffect, useState } from "react";
import { Wine, Award, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getHomeBrands } from "../../services/apiHelpers";

interface BrandData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const defaultData: BrandData = {
  title: "Popular Brands",
  subtitle: "Premium & Elegant",
  description: "Discover the world of wine — from bold reds to refreshing whites, every bottle carries a story of taste, aroma, and celebration. Explore, sip, and find the flavor that speaks to you.",
  image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop",
};

const BrandSection: React.FC = () => {
  const [data, setData] = useState<BrandData>(defaultData);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await getHomeBrands();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching home brands:", error);
    }
  };

  const features = [
    { icon: Wine, label: "Premium Selection", color: "from-purple-500 to-pink-500" },
    { icon: Award, label: "Award Winning", color: "from-yellow-500 to-orange-500" },
    { icon: Star, label: "Top Rated", color: "from-blue-500 to-cyan-500" },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={20} className="text-purple-600" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
              Featured
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {data.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Curated selection of premium brands and products
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - Image */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <img
                src={data.image}
                alt="Brand"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">Premium Quality</span>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {data.subtitle}
                </h3>
                <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6" />

                <p className="text-gray-700 text-base leading-relaxed mb-8">
                  {data.description}
                </p>

                {/* Feature Icons */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex flex-col items-center text-center group/feature"
                    >
                      <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl mb-3 shadow-lg group-hover/feature:scale-110 transition-transform duration-300`}>
                        <feature.icon className="text-white w-6 h-6" />
                      </div>
                      <p className="text-gray-800 font-semibold text-xs">
                        {feature.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transition-all"
                >
                  Explore Collection
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default BrandSection;
