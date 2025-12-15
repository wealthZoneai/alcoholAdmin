import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import ImageCropperModal from "../components/ImageCropperModal";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import { getUserProfile, createUserProfile, updateUserProfile } from "../services/apiHelpers";
import toast from "react-hot-toast";

const Profile: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/120");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    location: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await getUserProfile(userId);
        if (response.data) {
          const { firstName, lastName, phoneNumber, email, location, profileImg } = response.data;
          setFormData({
            firstName: firstName || "",
            lastName: lastName || "",
            phoneNumber: phoneNumber || "",
            email: email || "",
            location: location || ""
          });

          if (profileImg) setProfileImage(profileImg);

          setIsNewProfile(false);
        } else {
          setIsNewProfile(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsNewProfile(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = (img: string) => {
    setProfileImage(img);

    // Convert cropped Base64 → File for upload
    fetch(img)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        toast.error("User ID missing. Please log in.");
        return;
      }

      const dataPayload = {
        ...formData,
        file: selectedFile
      };

      if (isNewProfile) {
        await createUserProfile(userId, dataPayload);
        toast.success("Profile created successfully!");
        setIsNewProfile(false);
      } else {
        await updateUserProfile(userId, dataPayload);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  // Initial loading spinner
  if (loading && !formData.firstName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-300 py-16">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative">

        {/* Hidden Upload Input */}
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Banner */}
        <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 h-32 relative">
          {/* Clickable Profile Image */}
          <div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 cursor-pointer group"
            onClick={() => document.getElementById("profile-upload")?.click()}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover 
              group-hover:opacity-80 transition"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 
            text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition">
              Change
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-20 px-10 pb-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-600 text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 
                focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 
                focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 
                focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">E-mail Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 
                focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-gray-600 text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New Delhi, India"
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 
                focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="mt-8 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
                text-white px-8 py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6">

        {/* Left Side - Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Love to hear from you</h2>
          <p className="text-gray-500 text-sm mb-6">Reach out to us anytime — we’re here to help.</p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
              focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
            <textarea
              placeholder="Write a message..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 
              focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="w-full py-2 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
              text-white rounded-lg font-medium shadow-md hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side - Contact Info */}
        <div className="space-y-6">

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <MapPin className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Our Location</h3>
              <p className="text-sm">Belgian Street, Town</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Mail className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Send us mail</h3>
              <p className="text-sm">support@benjour.com</p>
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-xl px-6 py-5 flex items-center gap-4 shadow-lg">
            <Phone className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Call us</h3>
              <p className="text-sm">+91 00000 00001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropperModal
          image={selectedImage}
          onClose={() => setShowCropper(false)}
          onSave={handleCropSave}
        />
      )}

      {/* Logout Button */}
      <div className="mt-20 mb-10 flex justify-center">
        <button
          onClick={(): void => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
          }}
          className="px-10 py-3 bg-linear-to-br from-emerald-900 via-emerald-800 to-emerald-950 
          text-white rounded-lg shadow-md hover:opacity-90 transition font-medium"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;
