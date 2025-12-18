import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Ticket, Copy, Check, Clock, Trash2, Edit2, X, Calendar, Percent, CreditCard, ShoppingBag, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getCoupens, createCoupens, updateCoupens, deleteCoupens } from "../../../services/apiHelpers";

interface Coupon {
    id: any;
    code: string;
    title: string;
    description: string;
    discountValue: number;
    discountType: 'PERCENTAGE' | 'FLAT' | 'CASH_BACK';
    maxDiscount: number;
    minOrderAmount: number;
    usageLimit: number;
    usedCount?: number;
    startDate: string;
    endDate: string;
    color?: string; // Optional color for UI
}

const Coupons = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Coupon>>({
        code: "",
        title: "",
        description: "",
        discountValue: 0,
        discountType: "PERCENTAGE",
        maxDiscount: 0,
        minOrderAmount: 0,
        usageLimit: 0,
        startDate: "",
        endDate: ""
    });

    const colors = [
        "from-purple-500 to-indigo-500",
        "from-orange-400 to-red-500",
        "from-emerald-400 to-teal-500",
        "from-blue-400 to-cyan-500",
        "from-pink-500 to-rose-500",
        "from-amber-400 to-orange-500"
    ];

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await getCoupens();
            if (response.data) {
                const fetchedCoupons = response.data.map((c: any, index: number) => ({
                    ...c,
                    color: colors[index % colors.length]
                }));
                setCoupons(fetchedCoupons);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleOpenModal = (coupon: Coupon | null = null) => {
        if (coupon) {
            setSelectedCoupon(coupon);
            setFormData(coupon);
        } else {
            setSelectedCoupon(null);
            setFormData({
                code: "",
                title: "",
                description: "",
                discountValue: 0,
                discountType: "PERCENTAGE",
                maxDiscount: 0,
                minOrderAmount: 0,
                usageLimit: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedCoupon) {
                await updateCoupens(selectedCoupon.id, formData);
                toast.success("Coupon updated successfully!");
            } else {
                await createCoupens(formData);
                toast.success("Coupon created successfully!");
            }
            setIsModalOpen(false);
            fetchCoupons();
        } catch (error) {
            console.error("Error saving coupon:", error);
            toast.error("Failed to save coupon");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await deleteCoupens(id);
                toast.success("Coupon deleted successfully!");
                fetchCoupons();
            } catch (error) {
                console.error("Error deleting coupon:", error);
                toast.error("Failed to delete coupon");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Coupons & Offers</h1>
                        <p className="text-gray-500 mt-1">Manage discounts and promotional campaigns.</p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Create New Coupon
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-dashed border-gray-300">
                        <Ticket size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No coupons found. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {coupons.map((coupon) => (
                            <div key={coupon.id} className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                {/* Colorful Header */}
                                <div className={`h-32 bg-gradient-to-br ${coupon.color || 'from-gray-500 to-gray-700'} p-6 relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                                        <Ticket size={100} className="text-white" />
                                    </div>
                                    <div className="relative z-10 text-white">
                                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
                                            {coupon.discountType}
                                        </span>
                                        <h3 className="text-3xl font-black tracking-tight">
                                            {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                        </h3>
                                        <p className="text-white/90 text-sm font-medium mt-1">Min Order: ₹{coupon.minOrderAmount}</p>
                                    </div>
                                </div>

                                {/* Sawtooth / Perforation effect */}
                                <div className="relative h-4 bg-white -mt-2">
                                    <div className="absolute top-[-8px] left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat-x bg-[length:20px_10px]"></div>
                                </div>

                                {/* Body */}
                                <div className="p-6 pt-2 flex-grow flex flex-col">
                                    <h4 className="font-bold text-gray-900 mb-1">{coupon.title}</h4>
                                    <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 group-hover:border-gray-400 transition-colors">
                                        <span className="font-mono font-bold text-lg text-gray-800 tracking-wider select-all">{coupon.code}</span>
                                        <button
                                            onClick={() => copyToClipboard(coupon.code, coupon.id)}
                                            className="text-gray-400 hover:text-gray-900 transition-colors"
                                            title="Copy Code"
                                        >
                                            {copiedId === coupon.id ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                        </button>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{coupon.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-500 border-t border-gray-100 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Ticket size={14} className="text-gray-400" />
                                            <span>{coupon.usedCount || 0}/{coupon.usageLimit} Used</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>Exp: {coupon.endDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions overlay */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button
                                        onClick={() => handleOpenModal(coupon)}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all shadow-lg"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 drop-shadow-2xl">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-8 pb-0 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {selectedCoupon ? "Edit Coupon" : "New Coupon"}
                                </h2>
                                <p className="text-gray-500 mt-1">Fill in the details for your new campaign.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 hover:text-gray-900 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-8 flex-grow overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Coupon Code */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Hash size={16} className="text-gray-400" /> Coupon Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-bold tracking-wider placeholder:font-normal"
                                        placeholder="e.g. SUMMER50"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                {/* Discount Type */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Percent size={16} className="text-gray-400" /> Discount Type
                                    </label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.discountType}
                                        onChange={(e: any) => setFormData({ ...formData, discountType: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FLAT">Flat Discount (₹)</option>
                                        <option value="CASH_BACK">Cash Back (₹)</option>
                                    </select>
                                </div>

                                {/* Title */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        placeholder="e.g. Summer Special Sale"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all"
                                        placeholder="Briefly describe the offer..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Discount Value */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <CreditCard size={16} className="text-gray-400" /> Discount Value
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Max Discount */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Discount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Min Order Amount */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <ShoppingBag size={16} className="text-gray-400" /> Min Order Amount
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Usage Limit */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Usage Limit</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Dates */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-900/5 focus:border-gray-900 transition-all font-semibold"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-10 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                                >
                                    {selectedCoupon ? "Update Coupon" : "Create Coupon"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};

export default Coupons;
