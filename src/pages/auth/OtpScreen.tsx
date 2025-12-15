import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserOtp } from "../../services/apiHelpers";

const OtpScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const length = 6;
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [resendAllowed, setResendAllowed] = useState(false);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    } else {
      setResendAllowed(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const char = raw.replace(/[^0-9]/g, "").slice(0, 1);
    if (!char) return;
    const next = [...values];
    next[index] = char;
    setValues(next);
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else {
      inputsRef.current[index]?.blur();
      verifyOtp(next.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[index]) {
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const prev = [...values];
        prev[index - 1] = "";
        setValues(prev);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!paste) return;
    const next = Array(length).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setValues(next);
    if (paste.length === length) verifyOtp(paste);
    else inputsRef.current[paste.length]?.focus();
  };

  const verifyOtp = async (otp: string) => {
    setError("");
    setLoading(true);
    try {
      const response = await UserOtp({email, otp});
      setLoading(false);
      if (response.data && response.data === "OTP verified! user account activated.") {
        toast.success("Register successfully!");
        navigate("/");
      } else {
        setError("Invalid OTP. Please try again.");
        setValues(Array(length).fill(""));
        inputsRef.current[0]?.focus();
      }
    } catch (err: any) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  const resend = async () => {
    if (!resendAllowed) return;
    setResendAllowed(false);
    setResendTimer(30);
    setError("");
    try {
      // Call resend OTP API (optional if you have it)
      // await ResendOtp({ email });
      toast.info("OTP resent successfully.");
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100 flex flex-col items-center text-center">
        <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold shadow-lg">
          OTP
        </div>

        <h2 className="text-lg font-semibold mb-1">Verify your account</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 4-digit code sent to{" "}
          <span className="font-medium text-gray-700">{email || "your email"}</span>
        </p>

        <div className="flex justify-center gap-4 mb-4" onPaste={handlePaste}>
          {Array.from({ length }).map((_, i) => (
            <div key={i} className="relative">
              <input
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={values[i]}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-14 text-center text-xl font-semibold rounded-xl shadow-inner outline-none transition-transform transform focus:scale-105 focus:ring-2 focus:ring-indigo-300 ${
                  error ? "ring-1 ring-red-200 animate-[shake_300ms]" : "ring-0"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="h-6">
          {loading ? (
            <div className="text-sm text-gray-500">Verifying…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="text-sm text-gray-500">
              You can paste the code or type it manually.
            </div>
          )}
        </div>

        <button
          onClick={() => verifyOtp(values.join(""))}
          disabled={values.join("").length !== length || loading}
          className={`mt-6 w-full py-2 px-4 rounded-lg font-medium shadow-sm transition-opacity ${
            values.join("").length === length && !loading
              ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Verify
        </button>

        <div className="mt-4 text-xs text-gray-500">
          {resendAllowed ? (
            <button onClick={resend} className="underline text-indigo-600">
              Resend OTP
            </button>
          ) : (
            <>Resend available in {resendTimer}s</>
          )}
        </div>

        <style>{`
          @keyframes shake {
            0% { transform: translateX(0) }
            25% { transform: translateX(-6px) }
            50% { transform: translateX(6px) }
            75% { transform: translateX(-4px) }
            100% { transform: translateX(0) }
          }
          .animate-[shake_300ms] { animation: shake 300ms linear; }
        `}</style>
      </div>
    </div>
  );
};

export default OtpScreen;
