import { useState, useEffect } from "react";
import { Clock, Warehouse, ArrowLeft, PackageCheck, PackageOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getOrdersByStatus, updateOrderStatus } from "../../../services/apiHelpers";
import toast from "react-hot-toast";

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    notes?: string;
}

interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    items: OrderItem[];
    elapsedTime?: number; // In minutes, calculated locally
}

const KitchenDisplay = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock initial data if no real data
    const fetchKitchenOrders = async () => {
        try {
            const response = await getOrdersByStatus("PREPARING");
            // const newOrders = [{id: '1', orderNumber: '101', createdAt: new Date().toISOString(), status: 'PREPARING', items: [{id: 1, name: 'Spicy Chicken Burger', quantity: 2}, {id: 2, name: 'Fries', quantity: 1}]}, 
            //                    {id: '2', orderNumber: '102', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), status: 'PREPARING', items: [{id: 3, name: 'Pasta Alfredo', quantity: 1}]}]

            const fetchedOrders = (Array.isArray(response.data) ? response.data : []).map((o: any) => ({
                id: o.id.toString(),
                orderNumber: `ORD-${o.id}`,
                createdAt: o.createdAt || new Date().toISOString(),
                status: o.status,
                items: o.orderItems?.map((oi: any) => ({
                    id: oi.item.id,
                    name: oi.item.name,
                    quantity: oi.quantity
                })) || []
            }));
            setOrders(fetchedOrders);
        } catch (error) {
            console.error("Failed to fetch kitchen orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKitchenOrders();
        const interval = setInterval(fetchKitchenOrders, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAsReady = async (orderId: string) => {
        try {
            await updateOrderStatus(orderId, "READY");
            toast.success(`Order #${orderId} marked ready!`);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error) {
            toast.error("Failed to update order");
        }
    };

    // Calculate elapsed time for color coding
    const getElapsedTime = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        return Math.floor(diff / 60000); // minutes
    };



    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-6 mt-10 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin-dashboard')} className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Warehouse className="text-blue-500" />
                            Warehouse Packing Station
                        </h1>
                        <p className="text-gray-400 text-sm">Live Packing Queue • Auto-refresh active</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <Clock className="text-gray-400" />
                    <span className="text-3xl font-mono font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-max px-2">
                    <AnimatePresence>
                        {orders.length === 0 && !loading ? (
                            <div className="w-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                <PackageOpen size={64} className="mb-4" />
                                <h2 className="text-2xl font-bold">All caught up!</h2>
                                <p>No orders in the packing queue.</p>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const elapsed = getElapsedTime(order.createdAt);
                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                        className={`w-[320px] rounded-2xl flex flex-col shadow-2xl overflow-hidden border-2 h-full max-h-[calc(100vh-140px)] ${elapsed > 20 ? 'border-red-500/50 bg-gray-800' :
                                            elapsed > 10 ? 'border-orange-500/50 bg-gray-800' : 'border-emerald-500/50 bg-gray-800'
                                            }`}
                                    >
                                        {/* Card Header */}
                                        <div className={`p-4 flex justify-between items-center ${elapsed > 20 ? 'bg-red-600' :
                                            elapsed > 10 ? 'bg-orange-600' : 'bg-emerald-600'
                                            }`}>
                                            <div>
                                                <h3 className="text-xl font-black text-white">#{order.orderNumber.replace('ORD-', '')}</h3>
                                                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Dine-in / Delivery</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 font-mono font-bold text-lg text-white">
                                                    <Clock size={16} />
                                                    {elapsed}m
                                                </div>
                                                <span className="text-xs text-white/80">Packing time</span>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div className="flex-1 p-5 overflow-y-auto space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-start border-b border-gray-700 pb-3 last:border-0">
                                                    <div className="flex gap-3">
                                                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700 text-lg font-bold text-white shrink-0">
                                                            {item.quantity}
                                                        </span>
                                                        <div>
                                                            <p className="font-bold text-lg text-gray-100 leading-tight">{item.name}</p>
                                                            {item.notes && <p className="text-sm text-yellow-500 italic mt-1">Note: {item.notes}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer Action */}
                                        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                                            <button
                                                onClick={() => markAsReady(order.id)}
                                                className="w-full py-4 rounded-xl bg-gray-700 hover:bg-blue-600 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <PackageCheck size={24} className="group-hover:scale-110 transition-transform" />
                                                Mark Packed
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default KitchenDisplay;
