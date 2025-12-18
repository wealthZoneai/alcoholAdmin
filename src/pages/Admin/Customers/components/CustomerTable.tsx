import React from "react";
import CustomerRow from "./CustomerRow";
import type { AdminCustomer } from "./CustomerRow";
import { Users } from "lucide-react";

interface CustomerTableProps {
    customers: AdminCustomer[];
    toggleStatus: (id: number) => void;
    onRowClick: (customer: AdminCustomer) => void;
    clearFilters: () => void;
    totalFiltered: number;
    totalItems: number;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
    customers,
    toggleStatus,
    onRowClick,
    clearFilters,
    totalFiltered,
    totalItems
}) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Order Type</th>
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stats</th>
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Activity</th>
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {customers.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                toggleStatus={toggleStatus}
                                onClick={onRowClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {customers.length === 0 && (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6 border-2 border-dashed border-gray-200">
                        <Users size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No customers found</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Adjust your filters or try searching for something else.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-6 text-blue-600 font-bold flex items-center gap-1 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Pagination Footer */}
            <div className="px-8 py-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                <p className="text-sm font-semibold text-gray-500">
                    Showing <span className="text-gray-900">{totalFiltered}</span> of <span className="text-gray-900">{totalItems}</span> customers
                </p>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-400 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Previous</button>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map(p => (
                            <button key={p} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === 1 ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
                        ))}
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">Next</button>
                </div>
            </div>
        </div>
    );
};

export default CustomerTable;
