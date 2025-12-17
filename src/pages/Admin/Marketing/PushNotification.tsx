import React, { useState } from "react";
import axios from "axios";
import { Bell, Users } from "lucide-react";

interface UserType {
  id: string;
  name: string;
  token: string;
}

const AdminPushNotification: React.FC = () => {
  const [users] = useState<UserType[]>([
    { id: "1", name: "John Doe", token: "token1" },
    { id: "2", name: "Jane Smith", token: "token2" },
    { id: "3", name: "Alice Johnson", token: "token3" },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const toggleUser = (token: string) => {
    setSelectedUsers((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  const selectAllUsers = () => setSelectedUsers(users.map((u) => u.token));
  const deselectAllUsers = () => setSelectedUsers([]);

  const sendNotification = async () => {
    if (!title || !message || selectedUsers.length === 0) {
      setStatus("Please fill all fields and select users");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/notifications", {
        title,
        message,
        userTokens: selectedUsers,
      });

      setStatus(`Notification sent to ${selectedUsers.length} users ✅`);
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
    } catch (err) {
      console.error(err);
      setStatus("Failed to send notification ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 mt-10">
      <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center mb-6 space-x-3">
          <Bell className="text-indigo-500" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Push Notification</h2>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6 ">
          <input
            type="text"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            placeholder="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl border border-gray-300 bg-white placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 "
          />
        </div>

        {/* User Selection */}
        <div className="mb-6 ">
          <div className="flex justify-between items-center mb-2 text-gray-700 font-semibold">
            <h3 className="text-lg">Select Users</h3>
            <div className="space-x-2">
              <button onClick={selectAllUsers} className="text-sm text-indigo-600 hover:underline">
                Select All
              </button>
              <button onClick={deselectAllUsers} className="text-sm text-red-500 hover:underline">
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((user) => (
              <label
                key={user.id}
                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200
                  ${
                    selectedUsers.includes(user.token)
                      ? "bg-indigo-50 border-indigo-400 text-gray-800 shadow"
                      : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                  }`}
              >
                <Users className="mr-2 text-gray-600" />
                <span>{user.name}</span>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.token)}
                  onChange={() => toggleUser(user.token)}
                  className="ml-auto accent-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={sendNotification}
          className="w-full py-3 rounded-2xl bg-indigo-500 text-white font-bold shadow-md hover:bg-indigo-600 transition-all"
        >
          Send Notification
        </button>

        {/* Status */}
        {status && (
          <p className="mt-4 text-center font-medium text-green-600">{status}</p>
        )}
      </div>
    </div>
  );
};

export default AdminPushNotification;
