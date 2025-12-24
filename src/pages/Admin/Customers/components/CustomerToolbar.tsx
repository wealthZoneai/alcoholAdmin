import React from "react";
import { Search, Filter } from "lucide-react";

interface CustomerToolbarProps {
    search: string;
    setSearch: (value: string) => void;
}

const CustomerToolbar: React.FC<CustomerToolbarProps> = ({ search, setSearch }) => {
    return (
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-gray-900/5 focus-within:border-gray-900 transition-all w-full max-w-md">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 w-full ml-2 text-gray-700 font-medium placeholder:font-normal"
                />
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all">
                    <Filter size={20} />
                </button>
            </div>
        </div>
    );
};

export default CustomerToolbar;
