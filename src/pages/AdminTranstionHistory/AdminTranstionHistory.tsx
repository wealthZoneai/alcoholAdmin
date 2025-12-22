
import React, { useState, useMemo, useEffect } from "react";
import TransactionStats from "./components/TransactionStats";
import TransactionToolbar from "./components/TransactionToolbar";
import TransactionTable from "./components/TransactionTable";
import type { Transaction } from "./components/TransactionRow";
import {
    getTransactionsHistory,
    getTransactionsHistoryByType,
    type PaymentTransaction,
    type TransactionAnalytics
} from "../../services/apiHelpers";

const AdminTranstionHistory: React.FC = () => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<"ALL" | "SUCCESS" | "REFUNDED" | "PENDING">("ALL");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState<TransactionAnalytics>({
        totalCollectionAmount: 0,
        successRate: 0,
        refundedRate: 0,
        cancelledRate: 0
    });

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Passing "analytics" or empty string as type? 
                // The endpoint is getTransactionsHistoryByType which points to 'api/checkout/analytics'.
                // It takes a type param. "ALL" seems appropriate or empty.
                const response = await getTransactionsHistoryByType("ALL");
                if (response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchStats();
    }, []);

    // Fetch Transactions
    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const typeParam = activeTab === "ALL" ? "" : activeTab;
                const response = await getTransactionsHistory(typeParam);

                const rawData: PaymentTransaction[] = response.data || [];

                const mappedData: Transaction[] = rawData.map((txn) => ({
                    id: `TXN-${txn.id}`,
                    orderId: txn.orderId,
                    customer: {
                        name: `User #${txn.userId}`,
                        email: "N/A",
                        avatarColor: "bg-gray-100 text-gray-600"
                    },
                    // Assuming amount is in cents/paise
                    amount: txn.amount / 100,
                    date: new Date(txn.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                    }),
                    method: "Online",
                    status: txn.status as "SUCCESS" | "REFUNDED" | "PENDING"
                }));

                setTransactions(mappedData);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
                setTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [activeTab]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(txn => {
            const matchesSearch =
                txn.id.toLowerCase().includes(search.toLowerCase()) ||
                txn.orderId.toLowerCase().includes(search.toLowerCase()) ||
                txn.customer.name.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [search, transactions]);

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

                    {isLoading ? (
                        <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
                            Loading transactions...
                        </div>
                    ) : (
                        <TransactionTable
                            transactions={filteredTransactions}
                            totalFiltered={filteredTransactions.length}
                            totalItems={transactions.length}
                            clearFilters={clearFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTranstionHistory;
