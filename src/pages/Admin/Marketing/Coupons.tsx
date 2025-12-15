import { useState } from "react";
import { ArrowLeft, Plus, Ticket, Copy, Check, Clock, Trash2, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Coupons = () => {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const coupons = [
        { id: '1', code: "WELCOME50", discount: "50% OFF", description: "First time user special discount up to ₹100", status: "Active", used: 124, expiry: "2024-12-31", color: "from-purple-500 to-indigo-500" },
        { id: '2', code: "SUMMERCOOL", discount: "20% OFF", description: "Discount on soft drinks and juices", status: "Expired", used: 450, expiry: "2024-06-30", color: "from-orange-400 to-red-500" },
        { id: '3', code: "FREEDEL", discount: "Free Delivery", description: "Free delivery on orders above ₹500", status: "Active", used: 85, expiry: "2024-11-15", color: "from-emerald-400 to-teal-500" },
        { id: '4', code: "DAIRY30", discount: "FLAT 30%", description: "Flat 30% off on all dairy products", status: "Scheduled", used: 0, expiry: "2024-10-01", color: "from-blue-400 to-cyan-500" },
    ];

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopiedId(null), 2000);
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

                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <Plus size={20} />
                        Create New Coupon
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            {/* Colorful Header */}
                            <div className={`h-32 bg-gradient-to-br ${coupon.color} p-6 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                                    <Ticket size={100} className="text-white" />
                                </div>
                                <div className="relative z-10 text-white">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
                                        {coupon.status}
                                    </span>
                                    <h3 className="text-3xl font-black tracking-tight">{coupon.discount}</h3>
                                    <p className="text-white/90 text-sm font-medium mt-1">Max discount ₹120</p>
                                </div>
                            </div>

                            {/* Sawtooth / Perforation effect visually simulated */}
                            <div className="relative h-4 bg-white -mt-2">
                                <div className="absolute top-[-8px] left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMFoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat-x bg-[length:20px_10px]"></div>
                            </div>

                            {/* Body */}
                            <div className="p-6 pt-2 flex-grow flex flex-col">
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
                                        <span>{coupon.used} Used</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Clock size={14} className="text-gray-400" />
                                        <span>Exp: {coupon.expiry}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions overlay (visible on hover) */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all shadow-lg">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Coupons;
