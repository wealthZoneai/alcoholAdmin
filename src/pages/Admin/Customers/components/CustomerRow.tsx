import React from "react";
import { Phone, Mail } from "lucide-react";

export interface CustomerOrder {
    id: string;
    date: string;
    items: string;
    amount: number;
    status: "DELIVERED" | "CANCELLED" | "PENDING";
}

export interface AdminCustomer {
    id: number;
    name: string;
    phone: string;
    email: string;
    orderType: "Alcohol" | "Grocery" | "Both";
    totalOrders: number;
    totalSpent: number;
    avgTicket: number;
    orderSuccess: string;
    refundRequests: number;
    joinDate: string;
    address: string;
    lastOrderDate: string;
    recentOrders: CustomerOrder[];
    status: "ACTIVE" | "BLOCKED";
    avatarColor: string;
}

interface CustomerRowProps {
    customer: AdminCustomer;
    onClick: (customer: AdminCustomer) => void;
}

const CustomerRow: React.FC<CustomerRowProps> = ({ customer, onClick }) => {
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
        </tr>
    );
};

export default CustomerRow;
