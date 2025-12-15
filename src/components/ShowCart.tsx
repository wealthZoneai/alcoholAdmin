import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ShoppingCart,
    X,
    Plus,
    Minus,
    Trash2,
    ShoppingBag,
    Tag,
    Truck,
    AlertCircle
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart
} from "../Redux/cartSlice";
import toast from "react-hot-toast";
import {
    deleteFromCart,
    createCheckoutSession,
    updateCartQuantity
} from "../services/apiHelpers";
import type { RootState } from "../Redux/store";

interface CartItem {
    cartItemId: number;
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    unitType: string | null;
    discount: number | null;
    minValue: number | null;
    maxValue: number | null;
}

interface ShowCartProps {
    showCart: boolean;
    setShowCart: (value: boolean) => void;
    cart: CartItem[];
    cartCount: number;
    totalPrice: number;

}

const ShowCart: React.FC<ShowCartProps> = ({
    showCart,
    setShowCart,
    cart,
    cartCount,
    totalPrice
}) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.user.userId);

    const [isCheckingOut, setIsCheckingOut] = useState(false);
    // -------------------------------------------------------------
    // REMOVE ITEM FROM CART
    // -------------------------------------------------------------
    const handleRemoveFromCart = async (id: number) => {
        try {
            const response = await deleteFromCart(userId, id);

            if (response.status === 200) {
                dispatch(removeFromCart(id));
                toast.success("Product removed from cart");
            }
        } catch (error) {
            toast.error("Failed to remove product from cart");
        }
    };

    // -------------------------------------------------------------
    // INCREASE QUANTITY (Dynamic)
    // -------------------------------------------------------------
    // INCREASE
    const handleIncreaseQuantity = async (item: CartItem) => {
        const min = item.minValue ?? 1;
        const max = item.maxValue ?? 50;

        const newQuantity = Math.min(max, item.quantity + 1);

        // ensure id type matches reducer (number)
        dispatch(increaseQuantity({ cartItemId: Number(item.cartItemId), amount: 1 }));

        try {
            await updateCartQuantity(userId, Number(item.cartItemId), newQuantity);
        } catch (error) {
            // rollback exactly the same amount
            dispatch(decreaseQuantity({ cartItemId: Number(item.cartItemId), amount: 1, min }));
            toast.error("Failed to update quantity");
        }
    };

    // DECREASE
    const handleDecreaseQuantity = async (item: CartItem) => {
        const min = item.minValue ?? 1;

        if (item.quantity - 1 < min) {
            handleRemoveFromCart(Number(item.cartItemId));
            return;
        }

        const newQuantity = Math.max(min, item.quantity - 1);

        dispatch(decreaseQuantity({ cartItemId: Number(item.cartItemId), amount: 1, min }));

        try {
            await updateCartQuantity(userId, Number(item.cartItemId), newQuantity);
        } catch (error) {
            // rollback
            dispatch(increaseQuantity({ cartItemId: Number(item.cartItemId), amount: 1 }));
            toast.error("Failed to update quantity");
        }
    };


    // -------------------------------------------------------------
    // CHECKOUT
    // -------------------------------------------------------------
    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const MIN_ORDER = 50;
        if (totalPrice < MIN_ORDER) {
            toast.error(`Minimum order amount is ₹${MIN_ORDER}. Please add more items.`);
            return;
        }

        setIsCheckingOut(true);

        try {
            const baseUrl = window.location.origin;
            const successUrl = `${baseUrl}/processing-payment`;
            const cancelUrl = `${baseUrl}/payment-failure`;

            const response = await createCheckoutSession(userId, successUrl, cancelUrl);

            if (response.data.checkoutUrl) {
                window.location.href = response.data.checkoutUrl;
            } else {
                toast.error("Checkout session failed");
            }
        } catch (error) {
            toast.error("Failed to proceed to checkout");
        } finally {
            setIsCheckingOut(false);
        }
    };

    // SAVINGS CALCULATION
    const savings = cart.reduce((total, item) => {
        const originalPrice = item.price * 1.2;
        return total + (originalPrice - item.price) * item.quantity;
    }, 0);

    // -------------------------------------------------------------
    // UI RENDER
    // -------------------------------------------------------------
    return (
        <AnimatePresence>
            {showCart && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCart(false)}
                    />

                    {/* DRAWER */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[520px] bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                                        <ShoppingBag size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                                        <p className="text-emerald-100 text-sm">
                                            {cartCount} {cartCount === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCart(false)}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* SAVE MONEY BANNER */}
                            {savings > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-3 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-2 rounded-lg"
                                >
                                    <Tag size={16} className="text-yellow-300" />
                                    <span className="text-white text-sm font-medium">
                                        You're saving ₹{savings.toFixed(2)}!
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* CART CONTENT */}
                        <div className="flex-1 overflow-y-auto bg-gray-50">
                            {cart.length === 0 ? (
                                // EMPTY CART UI
                                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <ShoppingCart size={64} className="text-gray-300" />
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Your Cart is Empty
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Add items to get started!
                                    </p>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3">
                                    {/* CART ITEMS */}
                                    {cart.map((item, index) => {
                                        // Dynamic values with fallback
                                        const min = item.minValue ?? 1;
                                        const max = item.maxValue ?? 50;

                                        const unit =
                                            item.unitType ||
                                            ""; // DIET FRUITS → maybe empty

                                        const unitLabel = unit
                                            .replace("LITRE", "L")
                                            .replace("MILLILITER", "ml")
                                            .replace("KILOGRAM", "kg")
                                            .replace("GRAM", "g")
                                            .replace("PIECE", "pc")
                                            .replace("PACKET", "pkt");

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex gap-4">
                                                    {/* IMAGE */}
                                                    <div className="relative flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded-xl"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveFromCart(item.id)
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>

                                                    {/* ITEM DETAILS */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                                                            {item.name}
                                                        </h4>

                                                        {/* PRICE */}
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <span className="text-lg font-bold text-emerald-600">
                                                                ₹
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>

                                                        {/* QUANTITY CONTROLS */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                                                                {/* DECREASE */}
                                                                <button
                                                                    onClick={() =>
                                                                        handleDecreaseQuantity(item)
                                                                    }
                                                                    className="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                                                                >
                                                                    {item.quantity <= min ? (
                                                                        <Trash2 size={14} />
                                                                    ) : (
                                                                        <Minus size={14} />
                                                                    )}
                                                                </button>

                                                                {/* DISPLAY */}
                                                                <span className="w-16 text-center font-semibold text-gray-800">
                                                                    {item.quantity} {unitLabel}
                                                                </span>

                                                                {/* INCREASE */}
                                                                <button
                                                                    onClick={() =>
                                                                        handleIncreaseQuantity(item)
                                                                    }
                                                                    disabled={
                                                                        item.quantity >= max
                                                                    }
                                                                    className="w-8 h-8 rounded-lg bg-white text-gray-600 hover:text-emerald-600 flex items-center justify-center transition-colors shadow-sm disabled:opacity-40"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* FOOTER SECTION */}
                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 bg-white p-6">
                                {/* MINIMUM ORDER WARNING */}
                                {totalPrice < 50 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
                                    >
                                        <AlertCircle
                                            size={20}
                                            className="text-amber-600 mt-0.5"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-amber-800 mb-1">
                                                Minimum Order: ₹50.00
                                            </p>
                                            <p className="text-xs text-amber-700">
                                                Add ₹{(50 - totalPrice).toFixed(2)} more to proceed
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* SUMMARY */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>
                                            Subtotal ({cartCount} items)
                                        </span>
                                        <span className="font-semibold">
                                            ₹{totalPrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Truck size={16} />
                                            <span>Delivery</span>
                                        </div>
                                        <span className="font-semibold text-green-600">
                                            FREE
                                        </span>
                                    </div>

                                    {savings > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Total Savings</span>
                                            <span className="font-semibold">
                                                -₹{savings.toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-bold text-gray-800">
                                                Total
                                            </span>
                                            <span className="text-2xl font-bold text-emerald-600">
                                                ₹{totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CHECKOUT BUTTON */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || totalPrice < 50}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag size={20} />
                                            Proceed to Checkout
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-3">
                                    Secure checkout powered by Stripe
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShowCart;
