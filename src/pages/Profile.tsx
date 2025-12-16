import React, { useEffect, useState } from "react";
import { ShieldCheck, LogOut, Camera } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import ImageCropperModal from "../components/ImageCropperModal";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from "../services/apiHelpers";
import toast from "react-hot-toast";

const AdminProfile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);

  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    role: "ADMIN",
    status: "Active",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getUserProfile(userId)
      .then((res) => {
        if (res?.data) {
          setFormData({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            email: res.data.email || "",
            phoneNumber: res.data.phoneNumber || "",
            location: res.data.location || "",
            role: res.data.role || "ADMIN",
            status: res.data.status || "Active",
          });

          if (res.data.profileImg) {
            setProfileImage(res.data.profileImg);
          }
          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
        }
      })
      .catch(() => setIsNewProfile(true))
      .finally(() => setLoading(false));
  }, [userId]);

  /* ================= INPUT ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ================= IMAGE SELECT ================= */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  /* ================= IMAGE SAVE ================= */
  const handleCropSave = async (img: string) => {
    setProfileImage(img);

    const blob = await fetch(img).then((r) => r.blob());
    const file = new File([blob], "admin.jpg", { type: blob.type });
    setSelectedFile(file);

    setShowCropper(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error("Login required");

    setLoading(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([k, v]) =>
        formPayload.append(k, v)
      );

      if (selectedFile) {
        formPayload.append("profileImg", selectedFile);
      }

      isNewProfile
        ? await createUserProfile(userId, formPayload)
        : await updateUserProfile(userId, formPayload);

      toast.success("Profile saved successfully");
      setIsNewProfile(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-emerald-950 to-black overflow-y-auto px-4 py-10">

      {/* LOGOUT – FIXED */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 
          px-4 py-2 rounded-full text-white shadow-lg"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white shadow-2xl">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <label className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <img
                src={profileImage}
                className="w-36 h-36 rounded-full border-4 
                border-emerald-500 object-cover"
              />
              <div
                className="absolute inset-0 rounded-full bg-black/50 
                flex items-center justify-center opacity-0 
                group-hover:opacity-100 transition"
              >
                <Camera />
              </div>
            </label>

            <h1 className="mt-6 text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" />
              Admin Profile
            </h1>

            <span className="mt-2 px-4 py-1 text-xs bg-emerald-500/20 rounded-full">
              {formData.status}
            </span>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {["firstName", "lastName", "email", "phoneNumber", "location"].map(
              (field) => (
                <div key={field}>
                  <label className="text-xs uppercase text-gray-300">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 rounded-xl 
                    bg-white/10 border border-white/20 
                    focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              )
            )}

            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                disabled={loading}
                className="px-14 py-3 rounded-full bg-gradient-to-r 
                from-emerald-500 to-emerald-700 font-semibold"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CROPPER */}
      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onSave={handleCropSave}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default AdminProfile;
