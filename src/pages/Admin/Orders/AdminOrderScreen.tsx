import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package, Clock, CheckCircle, Truck, ChefHat, ShoppingBag,
    DollarSign, Users, Activity, MapPin, MoreVertical, Search, ArrowRight, XCircle, Phone
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllOrderList, getOrdersByStatus, updateOrderStatus } from "../../../services/apiHelpers";

type OrderStatus = "PLACED" | "PREPARING" | "READY" | "ASSIGNED" | "PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED";

interface OrderItem { id: number; name: string; quantity: number; price: number; image?: string; }
interface Order {
    id: string; orderNumber: string; date: string; status: OrderStatus; items: OrderItem[];
    totalAmount: number; deliveryAddress: string; customerName?: string; customerPhone?: string;
}

interface TabConfig {
    id: OrderStatus;
    label: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    shadowColor: string;
}

interface AdminOrdersList {
    liveOrders: number;
    earnings: {
        week: number;
        month: number;
        year: number;
        today: number;
    };
    newCustomers: number;
    pendingDeliveries: number;
}

const TABS: TabConfig[] = [
    { id: "PLACED", label: "New", icon: <Package size={18} />, color: "text-blue-600 bg-blue-50", borderColor: "border-blue-200", shadowColor: "shadow-blue-100" },
    { id: "PREPARING", label: "Preparing", icon: <ChefHat size={18} />, color: "text-orange-600 bg-orange-50", borderColor: "border-orange-200", shadowColor: "shadow-orange-100" },
    { id: "READY", label: "Ready", icon: <CheckCircle size={18} />, color: "text-lime-600 bg-lime-50", borderColor: "border-lime-200", shadowColor: "shadow-lime-100" },
    { id: "ASSIGNED", label: "Assigned", icon: <Clock size={18} />, color: "text-indigo-600 bg-indigo-50", borderColor: "border-indigo-200", shadowColor: "shadow-indigo-100" },
    { id: "PICKUP", label: "Picked Up", icon: <ShoppingBag size={18} />, color: "text-purple-600 bg-purple-50", borderColor: "border-purple-200", shadowColor: "shadow-purple-100" },
    { id: "OUT_FOR_DELIVERY", label: "Out For Delivery", icon: <Truck size={18} />, color: "text-emerald-600 bg-emerald-50", borderColor: "border-emerald-200", shadowColor: "shadow-emerald-100" },
    { id: "DELIVERED", label: "Delivered", icon: <CheckCircle size={18} />, color: "text-green-700 bg-green-100", borderColor: "border-green-200", shadowColor: "shadow-green-100" },
];

const AdminOrderScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus>("PLACED");
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [orderCounts, setOrderCounts] = useState<Record<OrderStatus, number>>({ 'PLACED': 0, 'PREPARING': 0, 'READY': 0, 'ASSIGNED': 0, 'PICKUP': 0, 'OUT_FOR_DELIVERY': 0, 'DELIVERED': 0 });
    const [adminOrdersList, setAdminOrdersList] = useState<AdminOrdersList>({
        liveOrders: 0,
        earnings: { week: 0, month: 0, year: 0, today: 0 },
        newCustomers: 0,
        pendingDeliveries: 0
    });

    const fetchOrders = useCallback(async (status: OrderStatus) => {
        setLoading(true);
        try {
            const response = await getOrdersByStatus(status);
            setOrders((Array.isArray(response.data) ? response.data : []).map((item: any) => ({

                id: item.orderId?.toString(),
                orderNumber: `ORD-${item.orderCode.slice(-4)}`,
                date: item.createdAt || new Date().toISOString(),
                status,
                totalAmount: item.totalAmount || 0,
                deliveryAddress: item.address?.fullAddress || "Address not provided",
                customerName: item?.username || "Unknown Customer",
                customerPhone: item?.phone || "No Phone",
                items: item.orderItems?.map((oi: any) => ({
                    id: oi.item?.id, name: oi.item?.name, quantity: oi.quantity, price: oi.priceAtPurchase || oi.item?.price, image: oi.item?.imageUrl
                })) || []
            })));
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders.");
        } finally { setLoading(false); }
    }, []);

    const fetchOrderCounts = useCallback(async () => {
        try {
            const counts: Record<OrderStatus, number> = {} as any;
            for (const tab of TABS) {
                const response = await getOrdersByStatus(tab.id);
                counts[tab.id] = Array.isArray(response.data) ? response.data.length : 0;
            }
            setOrderCounts(counts);
        } catch (error) {
            console.error(error);
            // toast.error("Failed to fetch order counts.");
        }
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            toast.loading(`Updating order #${orderId}...`, { id: 'status-update' });
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Moved to ${newStatus}`, { id: 'status-update' });

            const updatedOrder = orders.find(o => o.id === orderId);
            setOrders(prev => prev.filter(o => o.id !== orderId));
            if (updatedOrder) setOrderCounts(prev => ({ ...prev, [updatedOrder.status]: (prev[updatedOrder.status] || 1) - 1, [newStatus]: (prev[newStatus] || 0) + 1 }));
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status", { id: 'status-update' });
        }
    };

    useEffect(() => { fetchOrders(activeTab); fetchOrderCounts(); }, [activeTab, fetchOrders, fetchOrderCounts]);

    useEffect(() => {
        const adminFetchOrders = async () => {
            try {
                const allOrdersRes = await getAllOrderList();
                const allData = allOrdersRes.data; 
                if (allData) setAdminOrdersList(allData);
            }
            catch (error) {
                console.error("Error fetching admin orders:", error);
            }
        };
        adminFetchOrders();
    }, [activeTab,orderCounts]);

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        const lowerQuery = searchQuery.toLowerCase();
        return orders.filter(
            (o) =>
                o.orderNumber.toLowerCase().includes(lowerQuery) ||
                o.customerName?.toLowerCase().includes(lowerQuery) ||
                o.id.toString().includes(lowerQuery)
        );
    }, [orders, searchQuery]);

    const activeTabData = TABS.find(t => t.id === activeTab);

    return (
        <div className="min-h-screen bg-[#f8f9fc] pb-12 pt-20 font-sans text-gray-800">
            {/* Stats Bar */}
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<Activity size={20} />} label="Live Orders" value={adminOrdersList.liveOrders} color="text-red-500 bg-red-50" />
                    <StatCard icon={<DollarSign size={20} />} label="Today's Revenue" value={`₹${adminOrdersList.earnings?.today || 0}`} color="text-green-600 bg-green-50" />
                    <StatCard icon={<Users size={20} />} label="New Customers" value={adminOrdersList.newCustomers} color="text-blue-600 bg-blue-50" />
                    <StatCard icon={<Truck size={20} />} label="Pending Delivery" value={adminOrdersList.pendingDeliveries} color="text-orange-500 bg-orange-50" />
                </div>
            </div>

            {/* Header & Tabs */}
<div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
  <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = orderCounts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
              border transition-all duration-300 whitespace-nowrap
              ${isActive
                ? `${tab.color} ${tab.borderColor} shadow-lg ${tab.shadowColor} scale-105`
                : "bg-white text-gray-500 border-gray-200 hover:shadow-md hover:scale-105"
              }
            `}
          >
            {/* Active bottom indicator */}
            {isActive && (
              <span
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full ${tab.color.split(" ")[1]}`}
              />
            )}

            {/* Icon */}
            {tab.icon}

            {/* Label */}
            <span className="whitespace-nowrap">{tab.label}</span>

            {/* Order Count Badge */}
            <span
              className={`
                ml-2 flex items-center justify-center min-w-[22px] h-[22px] px-2 rounded-full text-xs font-semibold
                ${isActive ? tab.color : "bg-gray-100 text-gray-600"}
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  </div>
</div>



            {/* Main Content */}
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${activeTabData?.color}`}>
                            {activeTabData?.icon}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{activeTabData?.label} Orders</h2>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" /></div>
                        <input type="text" placeholder="Search by Order ID, Name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm transition-all" />
                        {searchQuery && (
                            <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500" onClick={() => setSearchQuery("")}>
                                <XCircle size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {[...Array(6)].map((_, i) => <OrderSkeleton key={i} />)}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <EmptyState activeTab={activeTab} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map(order => <OrderCard key={order.id} order={order} onStatusUpdate={handleStatusUpdate} tabColor={activeTabData?.borderColor} />)}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Subcomponents ---
const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
            <h4 className="text-xl font-bold text-gray-900 mt-0.5">{value}</h4>
        </div>
    </div>
);

const OrderSkeleton = () => (
    <div className="h-[360px] bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse p-4">
        <div className="h-6 w-1/3 bg-gray-100 rounded mb-4" />
        <div className="space-y-3">
            <div className="h-10 w-full bg-gray-100 rounded-lg" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
            <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="mt-8 h-32 bg-gray-50 rounded-lg" />
    </div>
);

const OrderCard = ({ order, onStatusUpdate, tabColor }: { order: Order, onStatusUpdate: (id: string, status: OrderStatus) => void, tabColor?: string }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getNextStatus = (currentStatus: OrderStatus): { id: OrderStatus, label: string, color: string, bg: string } | null => {
        switch (currentStatus) {
            case "PLACED": return { id: "PREPARING", label: "Accept Order", color: "text-white", bg: "bg-red-600 hover:bg-red-700 shadow-red-200" };
            case "PREPARING": return { id: "READY", label: "Mark Ready", color: "text-white", bg: "bg-amber-500 hover:bg-amber-600 shadow-amber-200" };
            case "READY": return { id: "ASSIGNED", label: "Assign Driver", color: "text-white", bg: "bg-lime-600 hover:bg-lime-700 shadow-lime-200" };
            case "ASSIGNED": return { id: "PICKUP", label: "Confirm Pickup", color: "text-white", bg: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" };
            case "PICKUP": return { id: "OUT_FOR_DELIVERY", label: "Start Delivery", color: "text-white", bg: "bg-purple-600 hover:bg-purple-700 shadow-purple-200" };
            case "OUT_FOR_DELIVERY": return { id: "DELIVERED", label: "Mark Delivered", color: "text-white", bg: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" };
            default: return null;
        }
    };

    const nextStatus = getNextStatus(order.status);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-2xl border ${tabColor || 'border-gray-100'} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-visible`}
        >
            {/* Order Number Badge */}
            <div className="absolute -top-3 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                #{order.orderNumber.replace('ORD-', '')}
            </div>

            {/* Header Area */}
            <div className="pt-8 px-5 pb-4 border-b border-gray-50 bg-gray-50/30">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                            <Users size={16} className="text-gray-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{order.customerName}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                <Phone size={10} className="text-gray-400" />
                                {order.customerPhone}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-100">
                        <Clock size={10} />
                        {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
                    <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{order.deliveryAddress}</p>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1">
                <div className="space-y-3 mb-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group/item">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 text-xs font-bold text-gray-700">{item.quantity}x</span>
                                <span className="text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs group-hover/item:text-gray-900 transition-colors">₹{Math.floor(item.price * item.quantity)}</span>
                        </div>
                    ))}
                    {order.items.length > 3 && (
                        <p className="text-xs font-semibold text-blue-600 pl-7">+ {order.items.length - 3} more items</p>
                    )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Total Amount</span>
                    <span className="text-lg font-black text-gray-900">₹{order.totalAmount}</span>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 pt-0 mt-auto flex gap-2">
                {nextStatus ? (
                    <button
                        onClick={() => onStatusUpdate(order.id, nextStatus.id)}
                        className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 transition-all active:scale-95 ${nextStatus.bg} ${nextStatus.color}`}
                    >
                        {nextStatus.label}
                        <ArrowRight size={16} />
                    </button>
                ) : (
                    <div className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold">
                        <CheckCircle size={16} /> Completed
                    </div>
                )}

                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-11 h-11 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors border border-gray-200">
                        <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 bottom-[120%] w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                >
                                    <div className="p-1">
                                        {TABS.map(tab => tab.id !== order.status && (
                                            <button key={tab.id} onClick={() => { onStatusUpdate(order.id, tab.id); setIsMenuOpen(false); }}
                                                className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg flex items-center gap-2 transition-colors">
                                                <span className={`w-2 h-2 rounded-full ${tab.color.split(' ')[1]}`} /> {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const EmptyState = ({ activeTab }: { activeTab: string }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center col-span-full">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Package size={40} className="text-gray-300" />
            </div>
            <div className="absolute -right-2 top-0 bg-red-50 p-2 rounded-full">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-ping" />
            </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No orders in {activeTab.toLowerCase()}</h3>
        <p className="text-gray-500 max-w-xs mx-auto text-sm">Waiting for new updates. New orders will appear here automatically.</p>
    </div>
);

export default AdminOrderScreen;
