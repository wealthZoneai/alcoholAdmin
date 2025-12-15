import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Quote, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { getHomeReviews, createHomeReview, updateHomeReview, deleteHomeReview } from "../../../services/apiHelpers";

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

const AdminReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Review | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await getHomeReviews();
            if (response.data && Array.isArray(response.data)) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteHomeReview(id.toString());
            setReviews(reviews.filter(r => r.id !== id));
            toast.success("Review deleted");
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Quote className="text-blue-600" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
                    </div>
                    <p className="text-gray-500 ml-12">Manage testimonials and customer feedback.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-200"
                >
                    <Plus size={20} />
                    Add Review
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <motion.div
                            key={review.id}
                            layout
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{review.name}</h3>
                                        <p className="text-xs text-gray-500">{review.location} • {review.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => { setEditingItem(review); setIsModalOpen(true); }}
                                        className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-1.5 hover:bg-gray-100 rounded text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mb-3 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm italic line-clamp-3">"{review.text}"</p>
                        </motion.div>
                    ))}
                </div>
            )}

            <ReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingItem}
                onSuccess={(newItem: Review) => {
                    if (editingItem) {
                        setReviews(reviews.map(r => r.id === newItem.id ? newItem : r));
                        toast.success("Review updated");
                    } else {
                        setReviews([...reviews, newItem]);
                        toast.success("Review added");
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Review | null;
    onSuccess: (item: Review) => void;
}

const ReviewModal: React.FC<ModalProps> = ({ isOpen, onClose, initialData, onSuccess }) => {
    // ... Simplified form for brevity, assuming standard CRUD ...
    const [form, setForm] = useState({
        name: "",
        location: "",
        text: "",
        rating: 5,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    name: initialData.name,
                    location: initialData.location,
                    text: initialData.text,
                    rating: initialData.rating,
                });
            } else {
                setForm({
                    name: "",
                    location: "",
                    text: "",
                    rating: 5,
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mocking API call for creating form data since there's no image upload in this simple version
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("location", form.location);
            formData.append("text", form.text);
            formData.append("rating", form.rating.toString());
            // Add other fields as necessary or mocking

            let response;
            if (initialData) {
                response = await updateHomeReview(initialData.id.toString(), formData);
            } else {
                response = await createHomeReview(formData);
            }
            if (response.data) onSuccess(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Review" : "Add Review"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Customer Name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <input
                                placeholder="Location"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            />
                            <textarea
                                placeholder="Review Text"
                                value={form.text}
                                onChange={e => setForm({ ...form, text: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg h-24"
                                required
                            />
                            <div className="flex items-center gap-2">
                                <label>Rating:</label>
                                <input
                                    type="number"
                                    max="5" min="1"
                                    value={form.rating}
                                    onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })}
                                    className="border rounded px-2 py-1 w-16"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default AdminReviews;
