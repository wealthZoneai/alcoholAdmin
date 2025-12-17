import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    Users,
    Star,
    Image as ImageIcon,
    MessageSquare,
    Package,
    ShieldCheck,
    TrendingUp,
    Clock,
    MapPin,
    Gift,
    BarChart2,
    ChevronRight,
    Bell,
    Award,
    Zap,
    UtensilsCrossed,
    Smartphone,
    Search
} from "lucide-react";
import type { RootState } from "../../Redux/store";
import AdminStatCard from "../../components/Admin/AdminStatCard";
import { getAllOrders, getMainCategories } from "../../services/apiHelpers";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { role, userId } = useSelector((state: RootState) => state.user);

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        categories: 0
    });

    useEffect(() => {
        if (role !== "ADMIN") {
            navigate("/admin-dashboard");
            return;
        }
        fetchStats();
    }, [role, navigate, userId]);

    const fetchStats = async () => {
        if (!userId) return;
        try {
            const [ordersRes, catsRes] = await Promise.all([
                getAllOrders(userId),
                getMainCategories()
            ]);

            const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
            const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
            const pendingOrders = orders.filter((order: any) => order.status === 'PLACED').length;

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders,
                categories: Array.isArray(catsRes.data) ? catsRes.data.length : 0
            });

        } catch (error) {
            console.error("Error fetching admin stats:", error);
        }
    };

    interface DashboardItem {
        label: string;
        subLabel?: string;
        path: string;
        icon: React.ReactNode;
        active?: boolean;
    }

    interface DashboardSection {
        title: string;
        description: string;
        color: string;
        lightColor: string;
        icon: React.ReactNode;
        items: DashboardItem[];
    }

    const sections: DashboardSection[] = [
        {
            title: "Live Operations",
            description: "Manage real-time activities",
            color: "from-rose-500 to-orange-500",
            lightColor: "bg-orange-50 text-orange-600",
            icon: <Zap className="text-white" />,
            items: [
                { label: "Live Orders", subLabel: `${stats.pendingOrders} Pending`, path: "/admin/orders", icon: <ShoppingBag size={20} />, active: stats.pendingOrders > 0 },
                { label: "Warehouse Ops", subLabel: "Live Packing Queue", path: "/admin/kitchen", icon: <Package size={20} />, active: false },
                { label: "Delivery Staff", subLabel: "Track Drivers", path: "/admin/staff", icon: <MapPin size={20} /> },
            ]
        },
        {
            title: "Menu & Catalog",
            description: "Update your food items",
            color: "from-emerald-500 to-teal-500",
            lightColor: "bg-emerald-50 text-emerald-600",
            icon: <Package className="text-white" />,
            items: [
                { label: "Categories", path: "/admin/categories", icon: <Layers size={20} /> },
                { label: "Sub-Categories", path: "/admin/sub-categories", icon: <Layers size={20} /> },
                { label: "Food Inventory", subLabel: "Edit Items/Stock", path: "/admin/inventory", icon: <LayoutDashboard size={20} /> },
                { label: "Top Rated", path: "/admin/top-rated", icon: <Star size={20} /> },
                { label: "Items Inventory", subLabel: "Edit Items/Item", path: "/admin/Item-Inventory", icon: <LayoutDashboard size={20} /> },

            ]
        },
        {
            title: "Growth & Marketing",
            description: "Boost your sales",
            color: "from-violet-500 to-purple-500",
            lightColor: "bg-purple-50 text-purple-600",
            icon: <TrendingUp className="text-white" />,
            items: [
                { label: "Banners", path: "/admin/banners", icon: <ImageIcon size={20} /> },
                { label: "combos", path: "/admin/combos", icon: <ImageIcon size={20} /> },
                { label: "Offers & Coupons", path: "/admin/marketing", icon: <Gift size={20} /> },
                { label: "Push Notifications", path: "/admin/notifications", icon: <Bell size={20} /> },
                { label: "Customer Reviews", path: "/admin/reviews", icon: <MessageSquare size={20} /> },
                { label: "Popular Brands", path: "/admin/brands", icon: <Award size={20} /> },
            ]
        },
        {
            title: "Analytics & Users",
            description: "Deep dive into data",
            color: "from-blue-500 to-indigo-500",
            lightColor: "bg-blue-50 text-blue-600",
            icon: <BarChart2 className="text-white" />,
            items: [
                { label: "Sales Analytics", path: "/admin/analytics", icon: <TrendingUp size={20} /> },
                { label: "Customers", path: "/admin/Customers", icon: <Users size={20} /> },
                { label: "App Settings", path: "/admin/settings", icon: <Smartphone size={20} /> },
            ]
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] pb-12">

            {/* Header / Hero */}
            <div className="bg-[#1a1c23] text-white pt-24 pb-32 px-4 sm:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="max-w-[1600px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/10">
                                    Admin Console
                                </span>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase border border-emerald-500/20 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                                Dashboard Overview
                            </h1>
                            <p className="text-gray-400 font-medium text-lg max-w-xl">
                                Welcome back! You have <span className="text-orange-400 font-bold">{stats.pendingOrders} new orders</span> pending today.
                            </p>
                        </div>

                        {/* <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    className="bg-white/10 border border-white/10 text-white placeholder:text-gray-500 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:bg-white/20 transition-all w-64 backdrop-blur-sm"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Main Content - Negative Margin to Overlap Hero */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 -mt-20 relative z-20">

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <AdminStatCard
                        title="Total Revenue"
                        value={`₹${stats.totalRevenue.toLocaleString()}`}
                        icon={<TrendingUp size={24} className="text-white" />}
                        color="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                        trend="up"
                        trendValue="+12.5%"
                        delay={0}
                    />
                    <AdminStatCard
                        title="Total Orders"
                        value={stats.totalOrders}
                        icon={<ShoppingBag size={24} className="text-white" />}
                        color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        trend="up"
                        trendValue="+5.2%"
                        delay={0.1}
                    />
                    <AdminStatCard
                        title="Active Items"
                        value={stats.categories * 12} // Mock multiplier for demo
                        icon={<Package size={24} className="text-white" />}
                        color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                        delay={0.2}
                    />
                    <AdminStatCard
                        title="Active Users"
                        value="1,240"
                        icon={<Users size={24} className="text-white" />}
                        color="bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                        trend="up"
                        trendValue="+8.1%"
                        delay={0.3}
                    />
                </motion.div>

                {/* Bento Grid Sections */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                >
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemAnim}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{section.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {section.items.map((item, itemIdx) => (
                                    <button
                                        key={itemIdx}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center p-3 rounded-2xl transition-all duration-300 text-left border
                                            ${item.active
                                                ? 'bg-rose-50 border-rose-100 hover:bg-rose-100 shadow-sm'
                                                : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-100 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3
                                            ${item.active ? 'bg-rose-100 text-rose-600' : 'bg-white text-gray-600'}
                                        `}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-sm truncate ${item.active ? 'text-rose-700' : 'text-gray-900'}`}>
                                                {item.label}
                                            </p>
                                            {item.subLabel && (
                                                <p className={`text-xs truncate ${item.active ? 'text-rose-500' : 'text-gray-400'}`}>
                                                    {item.subLabel}
                                                </p>
                                            )}
                                        </div>
                                        {item.active && (
                                            <span className="flex h-2 w-2 mr-2">
                                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                            </span>
                                        )}
                                        <ChevronRight size={16} className={`${item.active ? 'text-rose-400' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Message */}
                {/* <div className="mt-12 text-center pb-8 opacity-60">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                        Designed for Performance
                    </div>
                </div> */}

            </div>
        </div>
    );
};

export default AdminDashboard;
