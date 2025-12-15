// src/layouts/Layout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminNewOrderListener from "../components/Admin/AdminNewOrderListener";

const Layout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNewOrderListener />
      <Header onSearchChange={setSearchQuery} />

      <main className="grow">
        <Outlet context={{ searchQuery }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
