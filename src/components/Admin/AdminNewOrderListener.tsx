import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { getOrdersByStatus, updateOrderStatus } from "../../services/apiHelpers";
import NewOrderPopup from "../NewOrderPopup";
import { toast } from "react-hot-toast";

const AdminNewOrderListener: React.FC = () => {
    const { role, userId } = useSelector((state: RootState) => state.user);
    const [newOrder, setNewOrder] = useState<any | null>(null);

    // Custom hook-like behavior for polling
    // We use a ref to keep track of processed orders to avoid re-notifying for the same order in the same session excessively
    // However, simple state is enough if we just check what's currently "PLACED" and picking the one that we haven't shown yet.

    // To handle multiple new orders, we could show them one by one.
    // For now, let's just pick the latest one or the first one in the list.

    const processedOrderIds = useRef<Set<string | number>>(new Set());

    useEffect(() => {
        if (role !== "ADMIN") return;

        let isMounted = true;
        const POLLING_INTERVAL = 10000; // 10 seconds

        const fetchNewOrders = async () => {
            try {
                const response = await getOrdersByStatus("PLACED");
                if (!isMounted) return;

                const orders = response?.data || [];
                if (orders.length > 0) {
                    // Find an order that hasn't been processed/shown yet in this session
                    // OR checks if there is any 'PLACED' order.
                    // Requirement usually is to alert for *incoming* orders.
                    // If the admin refreshes, they might get the popup again for existing PLACED orders, which is actually good (reminder).
                    // But we don't want it to pop up repeatedly *while* they are on the screen rejecting/ignoring it.

                    // Let's filter orders that are NOT in processedOrderIds
                    // But if the user dismisses the popup (Reject/Close), we should add it to processedOrderIds so it doesn't pop up immediately again.

                    const unseenOrder = orders.find((o: any) => !processedOrderIds.current.has(o.id));

                    if (unseenOrder) {
                        setNewOrder(unseenOrder);
                        // We don't add to processedOrderIds immediately, we wait for action (Accept/Reject/Close)
                    }
                }
            } catch (error) {
                console.error("Error polling for new orders:", error);
            }
        };

        // Initial fetch
        fetchNewOrders();

        // Start polling
        const intervalId = setInterval(fetchNewOrders, POLLING_INTERVAL);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [role, userId]); // Dependency on userId might not be strictly needed for getOrdersByStatus but good practice if checking perms


    const handleAccept = async (orderId: number) => {
        try {
            // Optimistically close popup
            setNewOrder(null);
            processedOrderIds.current.add(orderId);

            await updateOrderStatus(orderId.toString(), "PREPARING");
            toast.success(`Order #${orderId} Accepted!`);

            // Refresh? The polling will handle the next state sync (it won't find this order as PLACED anymore)
        } catch (error) {
            console.error("Failed to accept order", error);
            toast.error("Failed to accept order");
        }
    };

    const handleReject = (orderId: number) => {
        // Just close and mark as seen so it doesn't pop up again immediately
        setNewOrder(null);
        processedOrderIds.current.add(orderId);
    };

    const handleClose = () => {
        if (newOrder) {
            processedOrderIds.current.add(newOrder.id);
            setNewOrder(null);
        }
    };

    if (!newOrder) return null;

    return (
        <NewOrderPopup
            order={{
                id: newOrder.id,
                customerName: newOrder.user ? `${newOrder.user.firstName} ${newOrder.user.lastName}` : "Customer",
                total: newOrder.totalAmount, // Adjust based on actual API response structure
                ...newOrder
            }}
            onAccept={handleAccept}
            onReject={handleReject}
            onClose={handleClose}
            autoAcceptTime={30} // 30 seconds to auto-act (or just close)
        />
    );
};

export default AdminNewOrderListener;
