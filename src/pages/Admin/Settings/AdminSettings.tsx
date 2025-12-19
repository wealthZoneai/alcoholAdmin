import { useState } from "react";
import {
    DollarSign,
    Globe,
    Mail,
    MapPin,
    Save,
    Settings,
    Shield,
    Store,
    ToggleLeft,
    ToggleRight
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminSettings = () => {
    const [loading, setLoading] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        storeName: "Benjour Groceries",
        storeEmail: "admin@benjour.com",
        storePhone: "+91 98765 43210",
        address: "123, Market Street, Mumbai",
        currency: "INR",
        taxRate: 18,
        deliveryFee: 40,
        freeDeliveryAbove: 500,

        // 🌧 ADDED ONLY
        rainyDeliveryEnabled: false,
        rainyExtraFee: 20,

        isStoreOpen: true,
        acceptingOrders: true,
    });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully!");
        }, 1000);
    };

    const Toggle = ({
        checked,
        onChange,
    }: {
        checked: boolean;
        onChange: () => void;
    }) => (
        <button
            onClick={onChange}
            className={`transition-colors duration-200 ${checked ? "text-emerald-500" : "text-gray-300"
                }`}
        >
            {checked ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
        </button>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-20 px-4 pb-20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                App Settings
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Configure your store, tax, and delivery preferences.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                        ) : (
                            <Save size={18} />
                        )}
                        Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Store Status */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Store size={18} className="text-purple-500" />
                                Store Status
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            Store Open
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Temporarily close store for maintenance
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={settings.isStoreOpen}
                                        onChange={() =>
                                            setSettings({
                                                ...settings,
                                                isStoreOpen: !settings.isStoreOpen,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            Accepting Orders
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Turn off to stop receiving new orders
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={settings.acceptingOrders}
                                        onChange={() =>
                                            setSettings({
                                                ...settings,
                                                acceptingOrders:
                                                    !settings.acceptingOrders,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* General Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500" />
                                General Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Store Name</label>
                                    <div className="relative">
                                        <Store size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            value={settings.storeName}
                                            onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Support Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="email"
                                            value={settings.storeEmail}
                                            onChange={e => setSettings({ ...settings, storeEmail: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Address</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            value={settings.address}
                                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <DollarSign size={18} className="text-emerald-500" />
                                Finance & Delivery
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                        Standard Delivery Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.deliveryFee}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                deliveryFee: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                        Free Delivery Above (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.freeDeliveryAbove}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                freeDeliveryAbove: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                        Tax / GST (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.taxRate}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                taxRate: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                                    />
                                </div>

                                {/* 🌧 ADDED ONLY */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">
                                                Rainy Time Delivery Fee 🌧
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Extra charge during rain
                                            </p>
                                        </div>
                                        <Toggle
                                            checked={settings.rainyDeliveryEnabled}
                                            onChange={() =>
                                                setSettings({
                                                    ...settings,
                                                    rainyDeliveryEnabled:
                                                        !settings.rainyDeliveryEnabled,
                                                })
                                            }
                                        />
                                    </div>

                                    {settings.rainyDeliveryEnabled && (
                                        <div className="mt-3">
                                            <label className="text-sm font-semibold text-gray-700 mb-1 block">
                                                Extra Rain Fee (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.rainyExtraFee}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        rainyExtraFee: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-60 pointer-events-none">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Shield size={18} className="text-orange-500" />
                                Security (Coming Soon)
                            </h2>
                            <p className="text-xs text-gray-500">
                                Two-factor authentication and role management will be available in the next update.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
