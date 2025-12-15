import React, { useEffect, useState, useRef } from "react";
import { X, Bell } from "lucide-react";
import newOrderSound from "../assets/sounds/old-broken.mp3";

interface NewOrderPopupProps {
  order: any;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  autoAcceptTime?: number;
  onClose: () => void;
}

const NewOrderPopup: React.FC<NewOrderPopupProps> = ({
  order,
  onAccept,
  onReject,
  autoAcceptTime = 10,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(autoAcceptTime);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // 🎵 Play looping sound when popup opens
  useEffect(() => {
    if (!order) return;
    const sound = new Audio(newOrderSound);
    sound.loop = true;
    sound.volume = 0.8;
    sound.play().catch(() => { });
    soundRef.current = sound;

    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, [order?.id]);

  // ⏳ Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAccept(); // auto accept
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // 🔇 Stop sound helper
  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  // ✅ Accept
  const handleAccept = () => {
    stopSound();
    onAccept(order.id);
    onClose(); // 👈 close popup
  };

  // ❌ Reject
  const handleReject = () => {
    stopSound();
    onReject(order.id);
    onClose(); // 👈 close popup
  };

  // SVG Configuration for Circular Timer
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progressOffset = circumference - ((timeLeft / autoAcceptTime) * circumference);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md rounded-3xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={handleReject}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>

        {/* Bell Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Bell className="text-blue-600 w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🛎️ New Order Alert!
        </h2>
        <p className="text-center text-gray-500 mt-1">
          You have a new incoming order
        </p>

        {/* Order Info */}
        <div className="bg-gray-50 p-4 rounded-xl mt-4 text-center text-sm text-gray-700">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="relative flex items-center justify-center">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                stroke="#e5e7eb"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#2563eb"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: progressOffset, transition: 'stroke-dashoffset 0.5s linear' }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute text-blue-600 font-bold text-sm">
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderPopup;
