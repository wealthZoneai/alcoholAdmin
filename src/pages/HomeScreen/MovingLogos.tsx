import React from "react";

const logos = [
  // 🛒 Grocery Brands
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",


  // 🍾 Alcohol Brands
 "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",

];

const MovingLogos: React.FC = () => {
  return (
    <div className="py-2 overflow-hidden bg-gray-50">
      <div className="flex animate-scroll gap-6">
        {/* duplicate list to create infinite loop effect */}
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt="brand logo"
            className="h-12 w-auto  hover:grayscale-0 transition duration-300"
          />
        ))}
      </div>
    </div>
  );
};

export default MovingLogos;
