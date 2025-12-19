import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAnlyticsDashboard } from "../../../services/apiHelpers";



const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("Week");
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await getAnlyticsDashboard(timeRange.toUpperCase());
            console.log("Analytics API Response:", response);

            const apiData = response.data || response;

            // Transform backend data to frontend structure
            const transformedData = {
                totalRevenue: {
                    value: `₹${apiData.totalRevenue}`,
                    change: "0%", // Backend doesn't provide change yet
                    isPositive: true
                },
                totalOrders: {
                    value: apiData.totalOrders,
                    change: "0%",
                    isPositive: true
                },
                avgOrderValue: {
                    value: `₹${apiData.avgOrderValue}`,
                    change: "0%",
                    isPositive: false
                },
                activeCustomers: {
                    value: apiData.activeCustomers,
                    change: "0%",
                    isPositive: true
                },
                revenueTrends: (apiData.revenueTrend || []).map((item: any) => ({
                    name: item[0], // Date string
                    revenue: item[1]
                })),
                categoryData: (apiData.categorySplit || []).map((item: any) => ({
                    name: item[0],
                    value: item[1]
                })),
                // Separate order volume data if needed, or merge into trends if X-axis is shared
                orderVolume: (apiData.orderVolume || []).map((item: any) => ({
                    name: item[0],
                    orders: item[1]
                }))
            };

            setAnalyticsData(transformedData);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Overview</h1>
                        <p className="text-gray-500 mt-1">Deep dive into your store's performance metrics.</p>
                    </div>

                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                        {["Day", "Week", "Month", "Year"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${timeRange === range
                                    ? "bg-gray-900 text-white shadow-md"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Revenue"
                        value={analyticsData?.totalRevenue?.value || "₹45,230"}
                        change={analyticsData?.totalRevenue?.change || "+12.5%"}
                        isPositive={analyticsData?.totalRevenue?.isPositive ?? true}
                        icon={<DollarSign size={20} className="text-emerald-600" />}
                        color="bg-emerald-50"
                    />
                    <KPICard
                        title="Total Orders"
                        value={analyticsData?.totalOrders?.value || "1,240"}
                        change={analyticsData?.totalOrders?.change || "+8.2%"}
                        isPositive={analyticsData?.totalOrders?.isPositive ?? true}
                        icon={<ShoppingBag size={20} className="text-blue-600" />}
                        color="bg-blue-50"
                    />
                    <KPICard
                        title="Avg. Order Value"
                        value={analyticsData?.avgOrderValue?.value || "₹0"}
                        change={analyticsData?.avgOrderValue?.change || "-2.1%"}
                        isPositive={analyticsData?.avgOrderValue?.isPositive ?? false}
                        icon={<TrendingUp size={20} className="text-orange-600" />}
                        color="bg-orange-50"
                    />
                    <KPICard
                        title="Active Customers"
                        value={analyticsData?.activeCustomers?.value || "0"}
                        change={analyticsData?.activeCustomers?.change || "+14.5%"}
                        isPositive={analyticsData?.activeCustomers?.isPositive ?? true}
                        icon={<Users size={20} className="text-purple-600" />}
                        color="bg-purple-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart - Revenue */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Trends</h3>
                                <p className="text-sm text-gray-500">Income over the last {timeRange.toLowerCase()}</p>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 font-bold text-sm">+23% Growth</div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analyticsData?.revenueTrends || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ stroke: '#10B981', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Chart - Top Categories */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Popular Categories</h3>
                        <div className="h-[300px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analyticsData?.categoryData || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {(analyticsData?.categoryData || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Donuts Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
                                    <p className="text-xl font-bold text-gray-900">1,200</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-4">
                            {(analyticsData?.categoryData || []).map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{item.value} sold</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Third Row - Orders Chart */}
                <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Order Volume</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData?.orderVolume || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Subcomponent: KPI Card
const KPICard = ({ title, value, change, isPositive, icon, color }: any) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}
            </span>
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
        </div>
    </div>
);

export default AnalyticsDashboard;
