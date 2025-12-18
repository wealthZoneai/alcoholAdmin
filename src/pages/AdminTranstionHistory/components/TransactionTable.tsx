import React from "react";
import TransactionRow from "./TransactionRow";
import type { Transaction } from "./TransactionRow";
import { Receipt } from "lucide-react";

interface TransactionTableProps {
    transactions: Transaction[];
    totalFiltered: number;
    totalItems: number;
    clearFilters: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
    transactions,
    totalFiltered,
    totalItems,
    clearFilters
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/30">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount & Date</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((txn) => (
                            <TransactionRow key={txn.id} transaction={txn} />
                        ))}
                    </tbody>
                </table>
            </div>

            {transactions.length === 0 && (
                <div className="p-24 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-300 mb-6 border-4 border-dashed border-gray-100">
                        <Receipt size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">No Transactions Found</h3>
                    <p className="text-gray-500 max-w-sm mt-2 font-medium">We couldn't find any transaction history matching your criteria.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Pagination Footer */}
            <div className="px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                <p className="text-sm font-bold text-gray-500">
                    Showing <span className="text-gray-900">{totalFiltered}</span> of <span className="text-gray-900">{totalItems}</span> logs
                </p>
                <div className="flex items-center gap-2">
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 rounded-2xl text-xs font-black opacity-50 cursor-not-allowed">Previous</button>
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3].map(p => (
                            <button
                                key={p}
                                className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${p === 1 ? 'bg-gray-900 text-white shadow-xl scale-110' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:scale-105'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-900 rounded-2xl text-xs font-black hover:bg-gray-50 hover:shadow-md transition-all">Next</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;
