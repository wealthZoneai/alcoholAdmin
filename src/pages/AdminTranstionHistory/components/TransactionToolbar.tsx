import React from "react";
import { Search, Calendar, Download } from "lucide-react";

interface TransactionToolbarProps {
    search: string;
    setSearch: (val: string) => void;
    activeTab: "ALL" | "SUCCESS" | "REFUNDED" | "PENDING";
    setActiveTab: (tab: any) => void;
}

const TransactionToolbar: React.FC<TransactionToolbarProps> = ({
    search,
    setSearch,
    activeTab,
    setActiveTab
}) => {
    return (
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-gray-900/5 focus-within:border-gray-900 transition-all w-full max-w-md">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search Txn ID, Order ID, or Customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full ml-3 text-gray-700 font-bold placeholder:font-medium text-sm"
                />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    {(["ALL", "SUCCESS", "REFUNDED", "PENDING"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeTab === tab
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Date Range</span>
                </button>

                <button className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg flex items-center gap-2">
                    <Download size={18} />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>
        </div>
    );
};

export default TransactionToolbar;
