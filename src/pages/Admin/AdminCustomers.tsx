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
    totalSpent: 12450,
    avgTicket: 1850,
    orderSuccess: "94%",
    refundRequests: 2,
    joinDate: "12 Jan 2024",
    address: "123 Green Valley, Downtown City, 400010",
    lastOrderDate: "15 Dec 2025",
    recentOrders: [
      { id: "ORD-9281", date: "15 Dec 2025", items: "Whiskey, Orange Juice", amount: 2450, status: "DELIVERED" },
      { id: "ORD-8812", date: "12 Dec 2025", items: "Vodka, Tonic Water", amount: 1800, status: "DELIVERED" },
    ],
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
    totalSpent: 6200,
    avgTicket: 775,
    orderSuccess: "100%",
    refundRequests: 0,
    joinDate: "05 Mar 2024",
    address: "45 Blue Avenue, Uptown City, 400015",
    lastOrderDate: "12 Dec 2025",
    recentOrders: [
      { id: "ORD-7712", date: "12 Dec 2025", items: "Milk, Bread, Eggs", amount: 450, status: "DELIVERED" },
      { id: "ORD-6654", date: "01 Dec 2025", items: "Fruit Basket", amount: 1200, status: "DELIVERED" },
    ],
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
    totalSpent: 28900,
    avgTicket: 1070,
    orderSuccess: "88%",
    refundRequests: 4,
    joinDate: "20 Nov 2023",
    address: "88 Emerald Heights, Mid-City, 400020",
    lastOrderDate: "16 Dec 2025",
    recentOrders: [
      { id: "ORD-9912", date: "16 Dec 2025", items: "Rum, Coke, Snacks", amount: 3500, status: "DELIVERED" },
      { id: "ORD-8823", date: "10 Dec 2025", items: "Gin, Tonic", amount: 2800, status: "CANCELLED" },
    ],
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
    totalSpent: 9800,
    avgTicket: 816,
    orderSuccess: "96%",
    refundRequests: 1,
    joinDate: "10 Feb 2024",
    address: "12 Orange Street, East-City, 400025",
    lastOrderDate: "17 Dec 2025",
    recentOrders: [
      { id: "ORD-9988", date: "17 Dec 2025", items: "Organic Veggies", amount: 1500, status: "DELIVERED" },
    ],
    status: "ACTIVE",
    avatarColor: "bg-orange-100 text-orange-600"
  },
];

const AdminCustomers: React.FC = () => {
  const [customers] = useState(customersData);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);

  const stats = useMemo(() => ({
    total: customers.length,
  }), [customers]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const clearFilters = () => {
    setSearch("");
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
          />

          <CustomerTable
            customers={filteredCustomers}
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

