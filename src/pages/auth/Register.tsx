import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import googleIcon from "../../../assets/google-contained.svg";
// import facebookIcon from "../../../assets/facebook.svg";
// import appleIcon from "../../../assets/Apple.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RegisterUser } from "../../services/apiHelpers";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await RegisterUser({ username, email, password });
      if (response) {
        if (response?.data === "Email already exists for a Customer account!"){
          toast.error("Email already exists for a Merchant account!");
          return;
        }
        toast.success("OTP sent to your email!");
        navigate("/otp", { state: { email } }); 
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* 🔹 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>

      {/* 🔹 Black Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70"></div>

      {/* 🔹 Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 text-white"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-1 tracking-wide">
          Create Account
        </h2>
        <p className="text-center text-gray-300 text-xs mb-5">
          Join and start managing your dashboard
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none text-white placeholder-gray-300 text-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none text-white placeholder-gray-300 text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none text-white placeholder-gray-300 text-sm pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-md text-white text-sm font-semibold shadow-lg transition-all duration-300 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-sky-500 hover:to-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-500/40" />
          <span className="mx-2 text-xs text-gray-300">OR</span>
          <hr className="flex-1 border-gray-500/40" />
        </div>

        {/* Social Signup */}
        {/* <div className="flex justify-center gap-4">
          {renderImage({
            src: googleIcon,
            alt: "Google",
            className:
              "cursor-pointer w-7 h-7 p-1 bg-white/20 rounded-full hover:bg-white/30 transition",
          })}
          {renderImage({
            src: facebookIcon,
            alt: "Facebook",
            className:
              "cursor-pointer w-7 h-7 p-1 bg-white/20 rounded-full hover:bg-white/30 transition",
          })}
          {renderImage({
            src: appleIcon,
            alt: "Apple",
            className:
              "cursor-pointer w-7 h-7 p-1 bg-white/20 rounded-full hover:bg-white/30 transition",
          })}
        </div> */}

        {/* Already have account */}
        <p className="text-center text-gray-300 text-xs mt-5">
          Already have an account?{" "}
          <a href="/" className="text-sky-400 font-medium hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
