import React, { useEffect, useRef, useState } from "react";

import { Search, MapPin, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { getHomeBanner } from "../../services/apiHelpers";

import alcoholImage from "../../assets/beer.jpg";

interface BannerData {
  videoUrl?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
}

const fallbackBanner: BannerData = {
  imageUrl:
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1600",
  title: "Craving Something Delicious?",
  subtitle:
    "Order from your favorite restaurants and get it delivered fresh to your doorstep",
};

const HomeBanner: React.FC = () => {

  const [bannerData, setBannerData] = useState<BannerData>(fallbackBanner);

  const [, setIsVideoReady] = useState(false);
  const [, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await getHomeBanner('HOME_BANNER');
      if (response.data) {
        setBannerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  // Video handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoReady(true);
    const handlePlay = () => setIsVideoPlaying(true);
    const handleWaiting = () => setIsVideoPlaying(false);

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("waiting", handleWaiting);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && bannerData.videoUrl) {
      video.src = bannerData.videoUrl;
      video.load();
      video.play().catch(() => setIsVideoPlaying(false));
    }
  }, [bannerData.videoUrl]);

  return (
    <div className="relative w-full min-h-[75vh] flex items-center overflow-hidden mt-16">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/alcohol1.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />



      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-200 px-4 py-2 rounded-full mb-6 shadow-sm"
            >
              <Sparkles size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-gray-800">
                Fast Delivery • Fresh Food
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {bannerData.title || fallbackBanner.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg sm:text-xl text-white mb-8 max-w-xl leading-relaxed"
            >
              {bannerData.subtitle || fallbackBanner.subtitle}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl"
            >
              <div className="flex items-center gap-3">
                {/* Location */}
                <div className="flex items-center gap-2 px-4 py-3 border-r border-gray-200 min-w-[180px]">
                  <MapPin size={20} className="text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Deliver to</p>
                    <button className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors truncate w-full">
                      <span className="truncate">Current Location</span>
                      <ChevronDown size={14} className="flex-shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for restaurants, dishes..."
                    className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Search Button */}
                <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl">
                  Search
                </button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-8 mt-8"
            >
              <div>
                <p className="text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-white">Restaurants</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-3xl font-bold text-white">30min</p>
                <p className="text-sm text-white">Avg Delivery</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-3xl font-bold text-white">4.8★</p>
                <p className="text-sm text-white">User Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Floating Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10">

              {/* IMAGE WRAPPER (Gradient only on image) */}
              <div className="relative w-[500px] h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={alcoholImage}
                  alt="Alcohol"
                  className="w-full h-full object-cover"
                />

                {/* Black Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b 
                      from-black/20 via-black/30 to-black/60 
                      pointer-events-none"></div>
              </div>

              {/* Floating Card – Whisky */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🥃</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Premium Whisky</p>
                    <p className="text-xs text-gray-500">₹899 • 750ml</p>
                  </div>
                </div>
              </div>

              {/* Floating Card – Beer */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍺</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Craft Beer</p>
                    <p className="text-xs text-gray-500">₹149 • 330ml</p>
                  </div>
                </div>
              </div>

              {/* Glow Behind */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 blur-3xl -z-10" />
            </div>
          </motion.div>

        </div>
      </div>


    </div>
  );
};

export default HomeBanner;
