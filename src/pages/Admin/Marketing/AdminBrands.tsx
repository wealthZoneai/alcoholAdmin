import React, { useState, useEffect } from "react";
import { UploadCloud, Save, Loader2, Award, Star, Wine } from "lucide-react";
import { toast } from "react-hot-toast";
import { getHomeBrands, updateHomeBrands } from "../../../services/apiHelpers";

interface BrandData {
    title: string;
    subtitle: string;
    description: string;
    image: string;
}

const defaultData: BrandData = {
    title: "Popular Brands",
    subtitle: "Premium & Elegant",
    description: "Discover the world of wine — from bold reds to refreshing whites, every bottle carries a story of taste, aroma, and celebration.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop",
};

const AdminBrands = () => {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState<BrandData>(defaultData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await getHomeBrands();
            if (response.data) {
                setFormData(response.data);
                setPreview(response.data.image);
            } else {
                setPreview(defaultData.image);
            }
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("subtitle", formData.subtitle);
            data.append("description", formData.description);
            if (imageFile) data.append("image", imageFile);

            const response = await updateHomeBrands(data);
            if (response.data) {
                setFormData(response.data);
                toast.success("Brand section updated successfully!");
            }
        } catch (error) {
            console.error("Error updating brands:", error);
            toast.error("Failed to update brand section");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-6 px-4 animate-fade-in">
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="text-purple-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Popular Brands Section</h1>
                </div>
                <p className="text-gray-500 ml-12">Manage the featured brands content on the home screen.</p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700">Section Image</label>
                                <div className="relative h-64 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-purple-500 transition-colors group cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium flex items-center gap-2">
                                                    <UploadCloud size={20} /> Change Image
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <UploadCloud size={40} className="text-gray-300 mb-2" />
                                            <span className="text-sm font-medium">Click to upload image</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Main Heading</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                        placeholder="e.g. Popular Brands"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                        placeholder="e.g. Premium & Elegant"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                                    placeholder="Enter section description..."
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-black font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Live Preview</h3>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative">
                        <div className="relative h-48">
                            <img src={preview || defaultData.image} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs inline-block mb-2">Featured</div>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.subtitle || "Subtitle"}</h4>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{formData.description || "Description..."}</p>
                            <div className="flex gap-2 mb-4">
                                {[Wine, Award, Star].map((Icon, i) => (
                                    <div key={i} className="p-2 bg-white rounded-lg shadow-sm">
                                        <Icon size={14} className="text-purple-500" />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full bg-gray-900 text-white py-2 rounded-lg text-center text-sm font-medium opacity-50">
                                Explore Collection
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBrands;
