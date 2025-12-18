
import React, { useState, useMemo } from "react";
import TransactionStats from "./components/TransactionStats";
import TransactionToolbar from "./components/TransactionToolbar";
import TransactionTable from "./components/TransactionTable";
import type { Transaction } from "./components/TransactionRow";

const mockTransactions: Transaction[] = [
    {
        id: "TXN-928374",
        orderId: "ORD-1029",
        customer: { name: "Rahul Mehta", email: "rahul@gmail.com", avatarColor: "bg-purple-100 text-purple-600" },
        amount: 12450,
        date: "18 Dec 2025, 12:30 PM",
        method: "UPI",
        status: "SUCCESS"
    },
    {
        id: "TXN-827361",
        orderId: "ORD-1030",
        customer: { name: "Sneha Patel", email: "sneha@gmail.com", avatarColor: "bg-blue-100 text-blue-600" },
        amount: 5800,
        date: "18 Dec 2025, 11:15 AM",
        method: "Credit Card",
        status: "REFUNDED"
    },
    {
        id: "TXN-726154",
        orderId: "ORD-1031",
        customer: { name: "Amit Kumar", email: "amit@gmail.com", avatarColor: "bg-emerald-100 text-emerald-600" },
        amount: 2450,
        date: "17 Dec 2025, 09:45 PM",
        method: "UPI",
        status: "PENDING"
    },
    {
        id: "TXN-625143",
        orderId: "ORD-1032",
        customer: { name: "Priya Sharma", email: "priya@example.com", avatarColor: "bg-orange-100 text-orange-600" },
        amount: 18900,
        date: "17 Dec 2025, 08:20 PM",
        method: "Debit Card",
        status: "SUCCESS"
    },
    {
        id: "TXN-524132",
        orderId: "ORD-1033",
        customer: { name: "Kiran Shah", email: "kiran@example.com", avatarColor: "bg-rose-100 text-rose-600" },
        amount: 3200,
        date: "16 Dec 2025, 05:10 PM",
        method: "Net Banking",
        status: "SUCCESS"
    },
];

const AdminTranstionHistory: React.FC = () => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"ALL" | "SUCCESS" | "REFUNDED" | "PENDING">("ALL");

    const stats = useMemo(() => ({
        totalCollection: 1254800,
        successRate: 98.4,
        refunded: 12450,
        pending: 4500
    }), []);

    const filteredTransactions = useMemo(() => {
        return mockTransactions.filter(txn => {
            const matchesSearch =
                txn.id.toLowerCase().includes(search.toLowerCase()) ||
                txn.orderId.toLowerCase().includes(search.toLowerCase()) ||
                txn.customer.name.toLowerCase().includes(search.toLowerCase());

            const matchesTab = activeTab === "ALL" || txn.status === activeTab;

            return matchesSearch && matchesTab;
        });
    }, [search, activeTab]);

    const clearFilters = () => {
        setSearch("");
        setActiveTab("ALL");
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Finance</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Transaction History</h1>
                        <p className="text-gray-500 font-medium mt-1">Audit and monitor all incoming payments and refunds.</p>
                    </div>
                </div>

                <TransactionStats stats={stats} />

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <TransactionToolbar
                        search={search}
                        setSearch={setSearch}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <TransactionTable
                        transactions={filteredTransactions}
                        totalFiltered={filteredTransactions.length}
                        totalItems={mockTransactions.length}
                        clearFilters={clearFilters}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminTranstionHistory;
