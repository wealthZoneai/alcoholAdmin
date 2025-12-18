import React from "react";
import { CreditCard, ArrowRight, MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";

export interface Transaction {
    id: string;
    orderId: string;
    customer: {
        name: string;
        email: string;
        avatarColor: string;
    };
    amount: number;
    date: string;
    method: "UPI" | "Credit Card" | "Debit Card" | "Net Banking";
    status: "SUCCESS" | "REFUNDED" | "PENDING";
}

interface TransactionRowProps {
    transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const statusConfig = {
        SUCCESS: { bg: "bg-emerald-50", text: "text-emerald-600", icon: CheckCircle2, dot: "bg-emerald-500" },
        REFUNDED: { bg: "bg-rose-50", text: "text-rose-600", icon: XCircle, dot: "bg-rose-500" },
        PENDING: { bg: "bg-amber-50", text: "text-amber-600", icon: Clock, dot: "bg-amber-500" },
    };

    const config = statusConfig[transaction.status];

    return (
        <tr className="group hover:bg-gray-50/50 transition-all cursor-pointer border-b border-gray-50 last:border-0 font-medium">
            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-sm tracking-tight">{transaction.id}</span>
                    <span className="text-xs text-gray-400 font-bold uppercase mt-0.5">Order {transaction.orderId}</span>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${transaction.customer.avatarColor} flex items-center justify-center font-black text-xs shadow-inner`}>
                        {getInitials(transaction.customer.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-gray-900 font-bold text-sm truncate">{transaction.customer.name}</span>
                        <span className="text-xs text-gray-400 truncate">{transaction.customer.email}</span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                        <CreditCard size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{transaction.method}</span>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-black text-sm">₹{transaction.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">{transaction.date}</span>
                </div>
            </td>

            <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${config.bg} ${config.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></div>
                    {transaction.status}
                </span>
            </td>

            <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-sm">
                        <ArrowRight size={16} />
                    </button>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionRow;
