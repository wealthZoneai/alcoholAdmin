import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import ReviewStats from "./components/ReviewStats";
import ReviewToolbar from "./components/ReviewToolbar";
import ReviewTable from "./components/ReviewTable";
import type { Review } from "./components/ReviewRow";
import { getReviewStats, getReviewsList, deleteHomeReview } from "../../../services/apiHelpers";

const DUMMY_REVIEWS: Review[] = [
    {
        id: 1,
        name: "Aman Gupta",
        location: "Mumbai, India",
        date: "18 Dec 2025",
        text: "The alcohol delivery was super fast! Perfectly chilled and well packaged. Best service in town.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
        rating: 5,
        verified: true
    },
    {
        id: 2,
        name: "Sarah Williams",
        location: "London, UK",
        date: "17 Dec 2025",
        text: "Great selection of premium groceries. The organic section is particularly impressive. Highly recommend!",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 5,
        verified: true
    },
    {
        id: 3,
        name: "Vikram Rathore",
        location: "Delhi, India",
        date: "16 Dec 2025",
        text: "Slight delay in delivery today, but the quality of items was top-notch as usual.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        rating: 4,
        verified: true
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        location: "Madrid, Spain",
        date: "15 Dec 2025",
        text: "Everything was fresh, but I wish they had more international wine options.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        rating: 3,
        verified: false
    },
    {
        id: 5,
        name: "Rajesh Kumar",
        location: "Bangalore, India",
        date: "14 Dec 2025",
        text: "Fantastic app experience! Very smooth checkout and great offers.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        rating: 5,
        verified: true
    }
];

const AdminReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [serverStats, setServerStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeRating, setActiveRating] = useState<number | "ALL">("ALL");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const [statsRes, listRes] = await Promise.all([
                getReviewStats().catch(() => null),
                getReviewsList().catch(() => null)
            ]);

            if (statsRes?.data) {
                setServerStats(statsRes.data);
            }

            if (listRes?.data && Array.isArray(listRes.data)) {
                setReviews(listRes.data);
            } else if (listRes?.data?.content && Array.isArray(listRes.data.content)) {
                setReviews(listRes.data.content);
            } else {
                setReviews(DUMMY_REVIEWS);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews. Using local data.");
            setReviews(DUMMY_REVIEWS);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to remove this review? This action cannot be undone.")) return;

        const originalReviews = [...reviews];
        setReviews(reviews.filter(r => r.id !== id));

        try {
            await deleteHomeReview(id.toString());
            toast.success("Review permanently removed");
        } catch (error) {
            console.error(error);
            setReviews(originalReviews);
            toast.error("Cloud removal failed. Restored review.");
        }
    };

    const stats = useMemo(() => {
        if (serverStats) {
            return {
                total: serverStats.totalReviews || 0,
                averageRating: serverStats.averageRating || 0,
                verified: serverStats.verifiedReviews || 0,
                negative: serverStats.negativeFeedback || 0
            };
        }

        const total = reviews.length;
        const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;
        const verified = reviews.filter(r => r.verified).length;
        const negative = reviews.filter(r => r.rating <= 2).length;

        return {
            total,
            averageRating: parseFloat(avg.toString()),
            verified,
            negative
        };
    }, [reviews, serverStats]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.text.toLowerCase().includes(search.toLowerCase());
            const matchesRating = activeRating === "ALL" || r.rating === activeRating;
            return matchesSearch && matchesRating;
        });
    }, [reviews, search, activeRating]);

    const clearFilters = () => {
        setSearch("");
        setActiveRating("ALL");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p className="text-gray-500 font-bold animate-pulse">Syncing Testimonials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Social Proof</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reviews & Feedback</h1>
                        <p className="text-gray-500 font-medium mt-1">Audit customer testimonials and maintain brand reputation.</p>
                    </div>
                </div>

                <ReviewStats stats={stats} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
                >
                    <ReviewToolbar
                        search={search}
                        setSearch={setSearch}
                        activeRating={activeRating}
                        setActiveRating={setActiveRating}
                    />

                    <ReviewTable
                        reviews={filteredReviews}
                        totalFiltered={filteredReviews.length}
                        totalItems={reviews.length}
                        clearFilters={clearFilters}
                        onDelete={handleDelete}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default AdminReviews;

