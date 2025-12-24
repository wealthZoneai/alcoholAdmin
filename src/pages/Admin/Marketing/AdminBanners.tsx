import { useState, useEffect, useRef } from "react";
import {
    UploadCloud,
    Save,
    Play,
    Image as ImageIcon,
    Sparkles,
    Layout
} from "lucide-react";
import { toast } from "react-hot-toast";
import { getHomeBanner, createOrUpdateHomeBanner } from "../../../services/apiHelpers";

/* ================= TYPES ================= */

interface BannerData {
    title: string;
    subtitle: string;
    // description: string;
    image: string;
    video?: string;
}

/* ========== VIDEO DURATION HELPER ========== */

const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            const duration = video.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            resolve(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
        };
        video.src = URL.createObjectURL(file);
    });
};

/* ================= COMPONENT ================= */

const AdminBanners = () => {
    const defaultData: BannerData = {
        title: "",
        subtitle: "",
        // description: "",
        image: "",
        video: ""
    };

    /* ========== STATES ========== */
    const [loading, setLoading] = useState(false);
    const [bannerData, setBannerData] = useState<BannerData>(defaultData);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [bannerId, setBannerId] = useState<any | null>(null);


    const [previews, setPreviews] = useState({
        image: "",
        video: ""
    });

    const [videoMeta, setVideoMeta] = useState({
        size: "",
        duration: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    /* ========== FETCH EXISTING BANNER ========== */

    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        try {
            const response = await getHomeBanner("HOME_BANNER");

            if (response?.data) {
                setBannerId(response.data[0].id);
                setBannerData({
                    title: response.data.title || "",
                    subtitle: response.data.description || "",
                    image: response.data.image || "",
                    video: response.data.video || ""
                });

                setPreviews({
                    image: response.data.image || "",
                    video: response.data.video || ""
                });
            }
        } catch (error) {
            console.error("Error fetching banner:", error);
        } finally {

        }
    };


    /* ========== IMAGE CHANGE ========== */

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviews((prev) => ({
            ...prev,
            image: URL.createObjectURL(file)
        }));
    };

    /* ========== VIDEO CHANGE ========== */

    const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setVideoFile(file);
        setPreviews((prev) => ({
            ...prev,
            video: URL.createObjectURL(file)
        }));

        const size = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        const duration = await getVideoDuration(file);

        setVideoMeta({ size, duration });
    };

    /* ========== SAVE / UPDATE BANNER ========== */

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append("section", "HOME_BANNER");
            formData.append("orderIndex", "1");
            formData.append("title", bannerData.title);
            formData.append("description", bannerData.subtitle);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            if (videoFile) {
                formData.append("video", videoFile);
            }

            const response = await createOrUpdateHomeBanner(
                formData,
                bannerId ?? undefined
            );

            if (response?.data) {
                toast.success(
                    bannerId
                        ? "Home banner updated successfully"
                        : "Home banner created successfully"
                );

                setBannerId(response.data.id);
                setBannerData({
                    title: response.data.title,
                    subtitle: response.data.description,
                    image: response.data.image,
                    video: response.data.video
                });
            }
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error("Failed to save banner");
        } finally {
            setLoading(false);
        }
    };


    /* ========== LOADING STATE ========== */
    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-6 px-4 animate-fade-in">
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Layout className="text-emerald-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Home Banner Management</h1>
                </div>
                <p className="text-gray-500 ml-12">Manage the hero section of your consumer app.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Left Column: Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Text Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Sparkles size={18} className="text-yellow-500" />
                            Content & Messaging
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Headline Title</label>
                                <input
                                    type="text"
                                    value={bannerData.title}
                                    onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-lg"
                                    placeholder="e.g., Fresh Groceries at your Doorstep?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle / Description</label>
                                <textarea
                                    rows={3}
                                    value={bannerData.subtitle}
                                    onChange={(e) => setBannerData({ ...bannerData, subtitle: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="e.g., Get up to 50% off on daily essentials..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Uploads */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-500" />
                                Hero Image
                            </h2>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                            >
                                {previews.image ? (
                                    <>
                                        <img src={previews.image} className="w-full h-full object-cover" alt="Banner Preview" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium flex items-center gap-2"><UploadCloud /> Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                            <UploadCloud className="text-blue-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Upload Banner Image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
                        </div>

                        {/* Video Upload */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Play size={18} className="text-red-500" />
                                Background Video
                            </h2>
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden relative group"
                            >
                                {previews.video ? (
                                    <>
                                        <video src={previews.video} className="w-full h-full object-cover" muted loop autoPlay />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white font-medium flex items-center gap-2"><UploadCloud /> Change Video</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
                                            <UploadCloud className="text-red-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Upload Background Video</p>
                                        <p className="text-xs text-gray-400 mt-1">MP4, WebM (Max 20MB)</p>
                                    </>
                                )}
                            </div>
                            {videoMeta.size && (
                                <div className="mt-3 flex gap-4 text-xs font-medium text-gray-500">
                                    <span>Size: {videoMeta.size}</span>
                                    <span>Duration: {videoMeta.duration}</span>
                                </div>
                            )}
                            <input type="file" ref={videoInputRef} onChange={handleVideoChange} hidden accept="video/*" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Live Preview Card */}
                    <div className="bg-black rounded-[2rem] p-2 shadow-2xl overflow-hidden relative aspect-[9/16] mx-auto w-[280px]">
                        <div className="absolute inset-0 bg-gray-900">
                            {previews.video ? (
                                <video src={previews.video} className="w-full h-full object-cover opacity-60" muted loop autoPlay />
                            ) : (
                                <img src={previews.image} className="w-full h-full object-cover opacity-60" alt="Mobile Preview" />
                            )}
                        </div>
                        <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full mb-4"></div>
                            <h3 className="text-2xl font-bold leading-tight mb-2">{bannerData.title || "Your Title Here"}</h3>
                            <p className="text-sm text-white/80 line-clamp-3">{bannerData.subtitle || "Subtitle goes here..."}</p>
                            <div className="mt-6 h-10 bg-emerald-500 rounded-xl w-full"></div>
                        </div>
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <button
                            onClick={handleSave}
                            disabled={loading || (!imageFile && !videoFile && !bannerData.title)}
                            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Publishing..." : "Publish Changes"}
                            {!loading && <Save size={18} />}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">Changes reflect immediately on the user app.</p>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default AdminBanners;
