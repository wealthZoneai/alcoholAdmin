import React from "react";
import { motion } from "framer-motion";
import HomeBanner from "./HomeBanner";
import BrandSection from "./Popular Brand Section";
import ComboScreen from "./Combo";
import TopRating from "./TopRating";
import CustomerReviews from "./CustomerReviews";
import CategoriesScreen from "./HomeCategories/CategoriesScreen";

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Banner */}
      <HomeBanner />

      {/* Main Content */}
      <div className="relative">
        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CategoriesScreen />
        </motion.div>

        {/* Brands Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <BrandSection />
        </motion.div>

        {/* Combo Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ComboScreen />
        </motion.div>

        {/* Top Rated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TopRating />
        </motion.div>

        {/* Customer Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CustomerReviews />
        </motion.div>

        {/* Overview/Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* <Overview /> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
