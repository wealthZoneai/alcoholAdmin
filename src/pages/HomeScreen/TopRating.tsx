import React, { useState, useEffect } from "react";
import { Star, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { getHomeTopRated } from "../../services/apiHelpers";

interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  category: "top" | "best";
}

const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80";

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Rose Wine",
    image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 124,
    category: "top",
  },
  {
    id: 2,
    name: "Honey Beer",
    image: "https://images.unsplash.com/photo-1542959863-3f384b6b1624?auto=format&fit=crop&w=800&q=60",
    rating: 4.5,
    reviews: 89,
    category: "best",
  },
  {
    id: 3,
    name: "Barley Vodka",
    image:
      "https://images.unsplash.com/photo-1590080875832-8405c0b4c44e?auto=format&fit=crop&w=800&q=60",
    rating: 5,
    reviews: 156,
    category: "top",
  },
  {
    id: 4,
    name: "Brazilian Rum",
    image:
      "https://images.unsplash.com/photo-1610911254767-40f1e01ac8d0?auto=format&fit=crop&w=800&q=60",
    rating: 4.8,
    reviews: 203,
    category: "best",
  },
  {
    id: 5,
    name: "Dessert Tequila",
    image:
      "https://images.unsplash.com/photo-1610641818989-77cf0b4574d6?auto=format&fit=crop&w=800&q=60",
    rating: 4.9,
    reviews: 178,
    category: "top",
  },
  {
    id: 6,
    name: "Premium Vodka",
    image:
      "https://parisdrinksguide.com/cont/blog/imagePot/08312021084700000000-612e32d4e5217.jpg",
    rating: 4.7,
    reviews: 142,
    category: "best",
  },
];

const TopRating: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [filter, setFilter] = useState<"top" | "best">("top");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getHomeTopRated();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching top rated:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) => product.category === filter
  );

  return (
    <section className="w-full bg-white py-1 px-4 md:px-2 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-100/30 to-orange-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                Popular Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Products
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              {[
                { type: "top", label: "Top Rating", icon: Star },
                { type: "best", label: "Best Selling", icon: Award }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setFilter(type as "top" | "best")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${filter === type
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Products */}
        <div className="relative">
          <div className="flex gap-8 justify-center overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {filteredProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
              >
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                  {/* Image */}
                  <div className="relative h-[280px] overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{item.rating}</span>
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(item.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({item.reviews} reviews)
                      </span>
                    </div>

                    <button className="w-full py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="w-full text-center py-10 text-gray-500">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopRating;
