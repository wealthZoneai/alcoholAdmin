import React from "react";
import { Phone, Mail, Lock, Unlock, MoreHorizontal } from "lucide-react";

export interface AdminCustomer {
    id: number;
    name: string;
    phone: string;
    email: string;
    orderType: "Alcohol" | "Grocery" | "Both";
    totalOrders: number;
    lastOrderDate: string;
    status: "ACTIVE" | "BLOCKED";
    avatarColor: string;
}

interface CustomerRowProps {
    customer: AdminCustomer;
    toggleStatus: (id: number) => void;
    onClick: (customer: AdminCustomer) => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ customer, toggleStatus, onClick }) => {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <tr
            onClick={() => onClick(customer)}
            className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
        >
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${customer.avatarColor} flex items-center justify-center font-black text-lg shadow-inner`}>
                        {getInitials(customer.name)}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors uppercase">{customer.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Phone size={12} /> {customer.phone}</span>
                            <span className="flex items-center gap-1"><Mail size={12} /> {customer.email}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border ${customer.orderType === 'Alcohol' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                        customer.orderType === 'Grocery' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                            'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}>
                        {customer.orderType.toUpperCase()}
                    </span>
                </div>
            </td>

            <td className="px-6 py-5 text-center">
                <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-black text-gray-900">{customer.totalOrders}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Orders</span>
                </div>
            </td>

            <td className="px-6 py-5">
                <div className="text-sm font-semibold text-gray-700">{customer.lastOrderDate}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Last Transaction</div>
            </td>

            <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${customer.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${customer.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"} animate-pulse`}></div>
                    {customer.status}
                </span>
            </td>

            <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => toggleStatus(customer.id)}
                        className={`p-2 rounded-xl transition-all ${customer.status === "ACTIVE"
                            ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
                            }`}
                        title={customer.status === "ACTIVE" ? "Block Customer" : "Unblock Customer"}
                    >
                        {customer.status === "ACTIVE" ? <Lock size={18} /> : <Unlock size={18} />}
                    </button>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CustomerRow;
