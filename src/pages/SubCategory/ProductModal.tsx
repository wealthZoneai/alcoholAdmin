import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ===================== TYPES ===================== */

export interface Product {
  id: any;
  subCategoryId: number;
  name: string;
  price: number;
  discount: number;
  rating: number;
  description: string;
  isFavorite: boolean;
  imageUrl: string;
  category: string;
  minValue: number;
  maxValue: number;
  // stepValue: number;
  unitType: string;
}

interface Review {
  id: any;
  userName: string;
  rating: number;
  comment: string;
}

interface ProductModalProps {
  selectedProduct: Product | null;
  onClose: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  reviews?: Review[];
}


const ProductModal: React.FC<ProductModalProps> = ({
  selectedProduct,
  onClose,
  allProducts,
  onSelectProduct,
  reviews = [],
}) => {
  // ✅ Hooks ALWAYS run
  useEffect(() => {
    // No-op or quantity logic if needed, but quantity is unused now
  }, [selectedProduct]);

  // ✅ Safe early return AFTER hooks
  if (!selectedProduct) return null;



  const unitLabel = (selectedProduct.unitType ?? "")
    .replace("LITRE", "L")
    .replace("MILLILITER", "ml")
    .replace("KILOGRAM", "kg")
    .replace("GRAM", "g")
    .replace("PIECE", "pc")
    .replace("PACKET", "pkt");

  /* ===================== RELATED PRODUCTS ===================== */

  const relatedProducts = allProducts.filter(
    (p) =>
      p.subCategoryId === selectedProduct.subCategoryId &&
      p.id !== selectedProduct.id
  );

  /* ===================== ADD TO CART ===================== */



  return (
    <AnimatePresence>
      <motion.div
        className="fixed no-scrollbar inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-3xl w-full no-scrollbar shadow-2xl relative flex flex-col max-h-[90vh]"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <X size={20} />
          </button>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {/* PRODUCT INFO */}
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full md:w-64 h-64 object-cover rounded-2xl"
              />

              <div className="flex-1">
                <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {selectedProduct.category}
                </span>

                <h2 className="text-2xl font-bold mt-3">
                  {selectedProduct.name}
                </h2>

                {/* RATING */}
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < (selectedProduct.rating ?? 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-600 mt-4 text-sm">
                  {selectedProduct.description ||
                    "No description available."}
                </p>

                {/* EXTRA INFO */}
                <div className="mt-4 text-sm space-y-1">
                  <p>
                    <b>Unit:</b> {unitLabel}
                  </p>
                  <p>
                    <b>Min Qty:</b> {selectedProduct.minValue}
                  </p>
                  <p>
                    <b>Max Qty:</b> {selectedProduct.maxValue}
                  </p>
                </div>

                {/* PRICE */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-3xl font-bold text-emerald-600">
                    ₹{selectedProduct.price}
                  </span>

                  {(selectedProduct.discount ?? 0) > 0 && (
                    <>
                      <span className="text-gray-400 line-through">
                        ₹
                        {(
                          selectedProduct.price *
                          (1 + (selectedProduct.discount ?? 0) / 100)
                        ).toFixed(0)}
                      </span>
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        {selectedProduct.discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* ADD TO CART */}
              </div>
            </div>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Related Products
                </h3>
                <div className="flex gap-4 overflow-x-auto">
                  {relatedProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      className="min-w-[160px] cursor-pointer bg-gray-50 hover:bg-gray-100 p-3 rounded-xl"
                    >
                      <img
                        src={item.imageUrl}
                        className="h-28 w-full object-cover rounded-lg"
                        alt={item.name}
                      />
                      <p className="text-sm mt-2 font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Customer Reviews
              </h3>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-sm text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
