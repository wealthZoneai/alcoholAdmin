import React from "react";
import { ArrowLeft, Plus, Phone, Mail, MoreVertical, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminStaff = () => {
    const navigate = useNavigate();

    const staffMembers = [
        { id: 1, name: "Rahul Sharma", role: "Store Manager", phone: "+91 98765 43210", email: "rahul.mgr@benjour.com", rating: 4.8, status: "Active", avatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff" },
        { id: 2, name: "Priya Singh", role: "Head Chef", phone: "+91 87654 32109", email: "priya.chef@benjour.com", rating: 4.9, status: "Active", avatar: "https://ui-avatars.com/api/?name=Priya+Singh&background=F59E0B&color=fff" },
        { id: 3, name: "Amit Kumar", role: "Delivery Partner", phone: "+91 76543 21098", email: "amit.dlv@benjour.com", rating: 4.5, status: "On Duty", avatar: "https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff" },
        { id: 4, name: "Sneha Verma", role: "Kitchen Staff", phone: "+91 65432 10987", email: "sneha.kit@benjour.com", rating: 4.2, status: "On Leave", avatar: "https://ui-avatars.com/api/?name=Sneha+Verma&background=EF4444&color=fff" },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-24 px-4 sm:px-8 pb-12">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium">
                            <ArrowLeft size={18} />
                            Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff & Drivers</h1>
                        <p className="text-gray-500 mt-1">Manage your team, permissions, and shifts.</p>
                    </div>

                    <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-black transition-all shadow-lg text-sm">
                        <Plus size={18} />
                        Add New Member
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {staffMembers.map(member => (
                        <div key={member.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
                                <MoreVertical size={18} />
                            </button>

                            <div className="flex flex-col items-center text-center mt-2">
                                <div className="w-20 h-20 rounded-full p-1 border-2 border-gray-100 mb-4 bg-white">
                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1 mb-4 ${member.role.includes("Chef") || member.role.includes("Kitchen") ? "bg-orange-50 text-orange-700" :
                                    member.role.includes("Driver") ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                                    }`}>
                                    {member.role}
                                </span>
                            </div>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-900 text-sm">{member.rating}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${member.status === 'Active' || member.status === 'On Duty' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                    }`}>
                                    {member.status}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Optional visual cue) */}
                    <button className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all group h-full min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
                            <Plus size={24} className="group-hover:text-emerald-600" />
                        </div>
                        <span className="font-semibold text-sm">Add Staff Member</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminStaff;
