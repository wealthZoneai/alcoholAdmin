import React, { useEffect, useState } from "react";
import { Star, Quote, CheckCircle, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { getHomeReviews } from "../../services/apiHelpers";

interface Review {
  id: number;
  name: string;
  location: string;
  date: string;
  text: string;
  image: string;
  rating: number;
  verified: boolean;
  helpful: number;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Mumbai, India",
    date: "2 days ago",
    text: "Rich, bold, and full-bodied with deep notes of dark berries, plum, and subtle spice. Smooth tannins create a warm, lasting finish — perfect for savoring slowly with hearty meals.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi, India",
    date: "1 week ago",
    text: "Delicate sweetness with strawberry and floral aromas. Refreshing, slightly fruity taste that is easy to drink — ideal for gatherings and relaxed moments.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
    verified: true,
    helpful: 18,
  },
  {
    id: 3,
    name: "Anjali Patel",
    location: "Bangalore, India",
    date: "3 days ago",
    text: "Light, crisp, and refreshing with citrus and tropical fruit hints. A clean acidity that feels bright on the palate, making it excellent for warm weather and lighter foods.",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
    rating: 4,
    verified: true,
    helpful: 32,
  },
];

const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getHomeReviews();
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Quote size={20} className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from our valued customers
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Quote size={20} className="text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < review.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {review.rating}.0
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-4">
                "{review.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <CheckCircle size={14} className="text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">{review.date}</span>
                <div className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  <ThumbsUp size={14} />
                  <span className="text-xs font-medium">{review.helpful}</span>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transition-all">
            View All Reviews
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;
