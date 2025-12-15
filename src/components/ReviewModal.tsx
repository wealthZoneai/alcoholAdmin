import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Camera, Smile, Meh, Frown } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderItem: {
        id: number;
        name: string;
        image: string;
    };
    onSubmit: (review: ReviewData) => void;
}

export interface ReviewData {
    itemId: number;
    rating: number;
    comment: string;
    images?: File[];
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    orderItem,
    onSubmit,
}) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 3) {
            toast.error("You can upload maximum 3 images");
            return;
        }

        setImages([...images, ...files]);

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (comment.trim().length < 10) {
            toast.error("Please write at least 10 characters");
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                itemId: orderItem.id,
                rating,
                comment: comment.trim(),
                images,
            });

            toast.success("Review submitted successfully! 🎉");
            onClose();

            // Reset form
            setRating(0);
            setComment("");
            setImages([]);
            setImagePreviews([]);
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const getRatingEmoji = (stars: number) => {
        if (stars <= 2) return <Frown className="text-red-500" size={24} />;
        if (stars <= 3) return <Meh className="text-yellow-500" size={24} />;
        return <Smile className="text-green-500" size={24} />;
    };

    const getRatingText = (stars: number) => {
        if (stars === 1) return "Poor";
        if (stars === 2) return "Below Average";
        if (stars === 3) return "Average";
        if (stars === 4) return "Good";
        if (stars === 5) return "Excellent";
        return "Rate this item";
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Rate Your Experience</h2>
                                    <p className="text-emerald-100 text-sm">
                                        Help others make better choices
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                                <img
                                    src={orderItem.image}
                                    alt={orderItem.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{orderItem.name}</h3>
                                    <p className="text-sm text-gray-500">Share your thoughts</p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`${star <= (hoveredRating || rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    } transition-colors`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Rating Feedback */}
                                {rating > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {getRatingEmoji(rating)}
                                        <span className="font-semibold text-gray-700">
                                            {getRatingText(rating)}
                                        </span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Share your experience
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you liked or what could be improved..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                    rows={4}
                                    maxLength={500}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-500">Minimum 10 characters</p>
                                    <p className="text-xs text-gray-500">{comment.length}/500</p>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add Photos (Optional)
                                </label>

                                <div className="grid grid-cols-3 gap-3">
                                    {/* Image Previews */}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    {images.length < 3 && (
                                        <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                                            <Camera size={24} className="text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Add Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Upload up to 3 photos (JPG, PNG)
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || rating === 0 || comment.trim().length < 10}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Review"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
