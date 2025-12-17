import React, { useState } from "react";

interface AdminCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  orderType: "Alcohol" | "Grocery" | "Both";
  totalOrders: number;
  lastOrderDate: string;
  status: "ACTIVE" | "BLOCKED";
}

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
  },
];

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState(customersData);
  const [search, setSearch] = useState("");

  const toggleStatus = (id: number) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status:
                customer.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
            }
          : customer
      )
    );
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-24 px-8 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left ">Customer</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Order Type</th>
              <th className="p-4 text-left">Orders</th>
              <th className="p-4 text-left">Last Order</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{customer.name}</td>

                <td className="p-4">
                  <div>{customer.phone}</div>
                  <div className="text-xs text-gray-500">
                    {customer.email}
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {customer.orderType}
                  </span>
                </td>

                <td className="p-4">{customer.totalOrders}</td>

                <td className="p-4">{customer.lastOrderDate}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      customer.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>

                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(customer.id)}
                    className={`px-4 py-1 text-xs rounded-lg border ${
                      customer.status === "ACTIVE"
                        ? "border-red-500 text-red-600 hover:bg-red-50"
                        : "border-green-500 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {customer.status === "ACTIVE"
                      ? "Block"
                      : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No customers found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
