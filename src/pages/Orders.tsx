import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    Phone,
    ChevronRight,
    Calendar,
    ShoppingBag,
    Star,
    UserCheck,
    Store
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import toast from "react-hot-toast";
import ReviewModal, { type ReviewData } from "../components/ReviewModal";
import { getCurrentOrder, getAllOrders, submitReview, getAllOrderList } from "../services/apiHelpers";

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "PLACED" | "PREPARING" | "READY" | "ASSIGNED" | "PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED"
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    estimatedDelivery?: string;

}

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing");
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedItemForReview, setSelectedItemForReview] = useState<OrderItem | null>(null);
    const [adminOrdersList, setAdminOrdersList] = useState<[]>([]);

    const userId = useSelector((state: RootState) => state.user.userId);


    // API Data Integration
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const [currentOrderRes, allOrdersRes] = await Promise.all([
                    getCurrentOrder(userId).catch((err: any) => {
                        console.error("Error fetching current order:", err);
                        return { data: [] };
                    }),
                    getAllOrders(userId).catch((err: any) => {
                        console.error("Error fetching all orders:", err);
                        return { data: [] };
                    }),
                ]);

                const mapApiItemToUiItem = (apiItem: any) => ({
                    id: apiItem.item?.id || crypto.randomUUID(),
                    name: apiItem.item?.name || "Unknown Item",
                    quantity: apiItem.quantity || 1,
                    price: apiItem.item?.price || 0,
                    image: apiItem.item?.imageUrl || "https://via.placeholder.com/100",
                });

                const mapToOrder = (
                    data: any,
                    statusOverride?: Order["status"]
                ): Order => {
                    const items = data.orderItems
                        ? data.orderItems.map(mapApiItemToUiItem)
                        : [mapApiItemToUiItem(data)];

                    const totalByItems = items.reduce(
                        (acc: number, item: any) => acc + item.price * item.quantity,
                        0
                    );

                    return {
                        id: data.id?.toString() || crypto.randomUUID(),
                        orderNumber: `ORD-${data.id ?? crypto.randomUUID().slice(0, 6)}`,
                        date: data.orderDate || new Date().toISOString(),
                        status: statusOverride || data.status || "PLACED",
                        totalAmount: data.totalAmount || totalByItems,
                        deliveryAddress: data.deliveryAddress || "Default Address",
                        items,
                    };
                };

                let formattedOrders: Order[] = [];

                const currentData = currentOrderRes.data;
                if (Array.isArray(currentData)) {
                    formattedOrders.push(
                        ...currentData.map((o: any) =>
                            mapToOrder(o)
                        )
                    );
                } else if (currentData) {
                    formattedOrders.push(mapToOrder(currentData));
                }

                const allData = allOrdersRes.data;
                if (Array.isArray(allData)) {
                    formattedOrders.push(
                        ...allData.map((o: any) =>
                            mapToOrder(o)
                        )
                    );
                } else if (allData) {
                    formattedOrders.push(mapToOrder(allData));
                }

                setOrders(formattedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);


    useEffect(() => {
        const adminFetchOrders = async () => {
            setLoading(true);
            try {
                const allOrdersRes = await getAllOrderList();
                const allData = allOrdersRes.data;
                setAdminOrdersList(allData);
            }
            catch (error) {
                console.error("Error fetching admin orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        adminFetchOrders();
    }, [userId]);


    const handleReviewSubmit = async (reviewData: ReviewData) => {
        // TODO: Call API to submit review
        const reviewRes = await submitReview(reviewData.itemId, reviewData);
        if (reviewRes.status === 200) {
            toast.success("Review submitted successfully");
            setReviewModalOpen(false);
            setSelectedItemForReview(null);
        }
        // await submitReview(reviewData);
    };

    const openReviewModal = (item: OrderItem) => {
        setSelectedItemForReview(item);
        setReviewModalOpen(true);
    };

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "PLACED":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";

            case "PREPARING":
            case "READY":
                return "bg-blue-100 text-blue-700 border-blue-200";

            case "ASSIGNED":
            case "PICKUP":
                return "bg-purple-100 text-purple-700 border-purple-200";

            case "OUT_FOR_DELIVERY":
                return "bg-indigo-100 text-indigo-700 border-indigo-200";

            case "DELIVERED":
                return "bg-green-100 text-green-700 border-green-200";

            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };


    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "PLACED":
                return <Clock size={16} />;

            case "PREPARING":
            case "READY":
                return <Package size={16} />;

            case "ASSIGNED":
                return <UserCheck size={16} />;

            case "PICKUP":
                return <Store size={16} />;

            case "OUT_FOR_DELIVERY":
                return <Truck size={16} />;

            case "DELIVERED":
                return <CheckCircle size={16} />;

            default:
                return <Package size={16} />;
        }
    };


    const getStatusText = (status: Order["status"]) => {
        return status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    };

    const ongoingOrders = orders.filter(
        (order) => order.status !== "DELIVERED"
    );

    const pastOrders = orders.filter(
        (order) => order.status === "DELIVERED"
    );


    const ORDER_TRACKING_FLOW: {
        status: Order["status"];
        label: string;
    }[] = [
            { status: "PLACED", label: "Order Placed" },
            { status: "PREPARING", label: "Preparing Order" },
            { status: "READY", label: "Order Ready" },
            { status: "ASSIGNED", label: "Delivery Partner Assigned" },
            { status: "PICKUP", label: "Picked Up" },
            { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
            { status: "DELIVERED", label: "Delivered" },
        ];

    const getTrackingSteps = (status: Order["status"]) => {
        const currentIndex = ORDER_TRACKING_FLOW.findIndex(
            (step) => step.status === status
        );

        return ORDER_TRACKING_FLOW.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            time: index <= currentIndex ? "Completed" : null, // optional
        }));
    };


    const trackingSteps = selectedOrder
        ? getTrackingSteps(selectedOrder.status)
        : [];



    const displayOrders = activeTab === "ongoing" ? ongoingOrders : pastOrders;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 bg-white p-2 rounded-xl shadow-sm w-fit">
                    <button
                        onClick={() => setActiveTab("ongoing")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "ongoing"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        Ongoing ({ongoingOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "history"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        History ({pastOrders.length})
                    </button>
                </div>

                {/* Orders List */}
                {displayOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No {activeTab === "ongoing" ? "Ongoing" : "Past"} Orders
                        </h3>
                        <p className="text-gray-500">
                            {activeTab === "ongoing"
                                ? "You don't have any active orders right now"
                                : "Your order history is empty"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayOrders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {order.orderNumber}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                {new Date(order.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </div>
                                        </div>
                                        <div
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>

                                    {/* Estimated Delivery for Ongoing Orders */}
                                    {order.estimatedDelivery && order.status === "OUT_FOR_DELIVERY" && (
                                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2 text-emerald-700">
                                                <Truck size={18} className="animate-pulse" />
                                                <span className="font-medium">
                                                    Arriving in {order.estimatedDelivery}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {order.items.map((item: OrderItem) => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-700">
                                                        ₹{item.quantity * item.price}
                                                    </p>
                                                    {/* Rate Item Button for Delivered Orders */}
                                                    {order.status === "DELIVERED" && (
                                                        <button
                                                            onClick={() => openReviewModal(item)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-700 text-xs font-medium transition-colors"
                                                        >
                                                            <Star size={14} />
                                                            Rate
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-gray-600 font-medium">Total Amount</span>
                                        <span className="text-lg font-bold text-emerald-600">
                                            ₹{order.totalAmount}
                                        </span>
                                    </div>
                                </div>

                                {/* Track Order Button */}
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-emerald-700 font-medium"
                                >
                                    Track Order
                                    <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Tracking Modal */}

            <AnimatePresence>
                {selectedOrder && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-1">Order Tracking</h2>
                                        <p className="text-emerald-100 text-sm">
                                            {selectedOrder.orderNumber}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-white hover:bg-white/20 rounded-full p-2 transition"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                {selectedOrder.estimatedDelivery && (
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                        <p className="text-sm text-emerald-100 mb-1">Estimated Delivery</p>
                                        <p className="text-lg font-semibold">
                                            {selectedOrder.estimatedDelivery}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 max-h-[55vh] overflow-y-auto">
                                {/* Tracking Steps */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>

                                    <div className="space-y-4">
                                        {trackingSteps.map((step, index) => (
                                            <div key={step.status} className="flex gap-4">
                                                {/* Timeline */}
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed
                                                                ? "bg-emerald-600 text-white"
                                                                : "bg-gray-200 text-gray-400"
                                                            }`}
                                                    >
                                                        {step.completed ? (
                                                            <CheckCircle size={20} />
                                                        ) : (
                                                            <Clock size={20} />
                                                        )}
                                                    </div>

                                                    {index < trackingSteps.length - 1 && (
                                                        <div
                                                            className={`w-0.5 h-12 ${step.completed ? "bg-emerald-600" : "bg-gray-200"
                                                                }`}
                                                        />
                                                    )}
                                                </div>

                                                {/* Step Info */}
                                                <div className="flex-1 pb-4">
                                                    <p
                                                        className={`font-medium ${step.completed ? "text-gray-800" : "text-gray-400"
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {step.completed && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Completed
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={20} className="text-emerald-600 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-800 mb-1">
                                                Delivery Address
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {selectedOrder?.deliveryAddress}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Phone size={20} className="text-emerald-600" />
                                        <div>
                                            <p className="font-medium text-gray-800 mb-1">
                                                Need Help?
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Contact support:{" "}
                                                <span className="font-semibold">1800-123-4567</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>


            {/* Review Modal */}
            {selectedItemForReview && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedItemForReview(null);
                    }}
                    orderItem={selectedItemForReview}
                    onSubmit={handleReviewSubmit}
                />
            )}
        </div>
    );
};

export default Orders;
