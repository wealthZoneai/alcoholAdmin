import React, { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import CustomerStats from "./Customers/components/CustomerStats";
import CustomerToolbar from "./Customers/components/CustomerToolbar";
import CustomerTable from "./Customers/components/CustomerTable";
import type { AdminCustomer } from "./Customers/components/CustomerRow";
import CustomerDetailsModal from "./Customers/components/CustomerDetailsModal";
import { AnimatePresence } from "framer-motion";

const customersData: AdminCustomer[] = [
  {
    id: 1,
    name: "Rahul Mehta",
    phone: "+91 9876543210",
    email: "rahul@gmail.com",
    orderType: "Alcohol",
    totalOrders: 15,
    lastOrderDate: "15 Dec 2025",
    status: "ACTIVE",
    avatarColor: "bg-purple-100 text-purple-600"
  },
  {
    id: 2,
    name: "Sneha Patel",
    phone: "+91 9988776655",
    email: "sneha@gmail.com",
    orderType: "Grocery",
    totalOrders: 8,
    lastOrderDate: "12 Dec 2025",
    status: "BLOCKED",
    avatarColor: "bg-blue-100 text-blue-600"
  },
  {
    id: 3,
    name: "Amit Kumar",
    phone: "+91 9123456789",
    email: "amit@gmail.com",
    orderType: "Both",
    totalOrders: 27,
    lastOrderDate: "16 Dec 2025",
    status: "ACTIVE",
    avatarColor: "bg-emerald-100 text-emerald-600"
  },
  {
    id: 4,
    name: "Priya Sharma",
    phone: "+91 8877665544",
    email: "priya@example.com",
    orderType: "Grocery",
    totalOrders: 12,
    lastOrderDate: "17 Dec 2025",
    status: "ACTIVE",
    avatarColor: "bg-orange-100 text-orange-600"
  },
];

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState(customersData);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.status === "ACTIVE").length,
    blocked: customers.filter(c => c.status === "BLOCKED").length,
  }), [customers]);

  const toggleStatus = (id: number) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
            ...customer,
            status: customer.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
          }
          : customer
      )
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "ALL" || customer.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const clearFilters = () => {
    setSearch("");
    setActiveTab("ALL");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Management</h1>
            <p className="text-gray-500 mt-1">Monitor user activity, handle support, and manage access.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white text-gray-700 px-4 py-2.5 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
              <Calendar size={18} />
              Last 30 Days
            </button>
          </div>
        </div>

        <CustomerStats stats={stats} />

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <CustomerToolbar
            search={search}
            setSearch={setSearch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <CustomerTable
            customers={filteredCustomers}
            toggleStatus={toggleStatus}
            onRowClick={setSelectedCustomer}
            clearFilters={clearFilters}
            totalFiltered={filteredCustomers.length}
            totalItems={customers.length}
          />
        </div>
      </div>
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;

