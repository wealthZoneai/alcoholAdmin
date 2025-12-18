import React, { useState } from "react";
import {
    X,
    User,
    ShoppingBag,
    CreditCard,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    ArrowUpRight,
    TrendingUp,
    RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminCustomer } from "./CustomerRow";

interface CustomerDetailsModalProps {
    customer: AdminCustomer;
    onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, onClose }) => {
    const [activeTab, setActiveTab] = useState<"overview" | "orders" | "payments">("overview");

    // Mock data for the detailed view
    const mockOrders = [
        { id: "ORD-9281", date: "15 Dec 2025", items: "Whiskey, Orange Juice", amount: 2450, status: "DELIVERED" },
        { id: "ORD-8812", date: "12 Dec 2025", items: "Vodka, Tonic Water", amount: 1800, status: "DELIVERED" },
        { id: "ORD-7654", date: "05 Dec 2025", items: "Grocery Bundle", amount: 3200, status: "CANCELLED" },
        { id: "ORD-6543", date: "28 Nov 2025", items: "Red Wine, Cheese", amount: 1550, status: "DELIVERED" },
    ];

    const mockPayments = [
        { id: "TXN-101", date: "15 Dec 2025", method: "UPI", amount: 2450, status: "SUCCESS" },
        { id: "TXN-098", date: "12 Dec 2025", method: "Credit Card", amount: 1800, status: "SUCCESS" },
        { id: "TXN-087", date: "05 Dec 2025", method: "UPI", amount: 3200, status: "REFUNDED" },
        { id: "TXN-076", date: "28 Nov 2025", method: "Debit Card", amount: 1550, status: "SUCCESS" },
    ];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-end">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-24 h-24 rounded-3xl ${customer.avatarColor} flex items-center justify-center font-black text-3xl shadow-2xl border-4 border-white/10`}>
                            {getInitials(customer.name)}
                        </div>
                        <div className="text-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black tracking-tight">{customer.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${customer.status === 'ACTIVE' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'}`}>
                                    {customer.status}
                                </span>
                            </div>
                            <p className="text-gray-400 font-medium mt-1 flex items-center gap-2">
                                Customer since 12 Jan 2024 • {customer.totalOrders} Orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 pb-0 pt-4">
                    {[
                        { id: "overview", label: "Overview", icon: User },
                        { id: "orders", label: "Orders", icon: ShoppingBag },
                        { id: "payments", label: "Payments", icon: CreditCard },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-2 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === tab.id
                                    ? "border-gray-900 text-gray-900"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="p-2 bg-white rounded-xl shadow-sm"><Mail size={20} className="text-gray-500" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                                                <p className="font-bold text-gray-900">{customer.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="p-2 bg-white rounded-xl shadow-sm"><Phone size={20} className="text-gray-500" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                                                <p className="font-bold text-gray-900">{customer.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="p-2 bg-white rounded-xl shadow-sm"><MapPin size={20} className="text-gray-500" /></div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase">Default Address</p>
                                                <p className="font-bold text-gray-900">123 Green Valley, Downtown City, 400010</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Activity Statistics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <ShoppingBag size={20} className="text-blue-600" />
                                                <ArrowUpRight size={14} className="text-blue-400" />
                                            </div>
                                            <p className="text-[10px] text-blue-400 font-black uppercase">Total Spent</p>
                                            <p className="text-2xl font-black text-blue-900 mt-1">₹12,450</p>
                                        </div>
                                        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <TrendingUp size={20} className="text-emerald-600" />
                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                            </div>
                                            <p className="text-[10px] text-emerald-400 font-black uppercase">Orders Success</p>
                                            <p className="text-2xl font-black text-emerald-900 mt-1">94%</p>
                                        </div>
                                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <Clock size={20} className="text-amber-600" />
                                            </div>
                                            <p className="text-[10px] text-amber-400 font-black uppercase">Avg. Ticket</p>
                                            <p className="text-2xl font-black text-amber-900 mt-1">₹1,850</p>
                                        </div>
                                        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <RotateCcw size={20} className="text-rose-600" />
                                                <XCircle size={14} className="text-rose-400" />
                                            </div>
                                            <p className="text-[10px] text-rose-400 font-black uppercase">Refund Request</p>
                                            <p className="text-2xl font-black text-rose-900 mt-1">2 Total</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "orders" && (
                            <motion.div
                                key="orders"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Items</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {mockOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-4 font-bold text-gray-900">#{order.id}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-600">{order.date}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-500 truncate max-w-[200px]">{order.items}</td>
                                                    <td className="px-4 py-4 font-bold text-gray-900">₹{order.amount.toLocaleString()}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "payments" && (
                            <motion.div
                                key="payments"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Txn ID</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Method</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                                <th className="px-4 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {mockPayments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-4 font-bold text-gray-900">{payment.id}</td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-600">{payment.date}</td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <CreditCard size={14} className="text-gray-500" />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-700">{payment.method}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-bold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                                                    <td className="px-4 py-4 text-right">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                            }`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${payment.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                            <Calendar size={16} />
                            Export History
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Close Profile
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerDetailsModal;
