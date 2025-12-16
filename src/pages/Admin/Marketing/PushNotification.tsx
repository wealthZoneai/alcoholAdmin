import React, { useState } from "react";
import axios from "axios";
import { Bell, Users } from "lucide-react";

interface UserType {
  id: string;
  name: string;
  token: string;
}

const AdminPushNotification: React.FC = () => {
  // Example users (replace with API fetch)
  const [users] = useState<UserType[]>([
    { id: "1", name: "John Doe", token: "token1" },
    { id: "2", name: "Jane Smith", token: "token2" },
    { id: "3", name: "Alice Johnson", token: "token3" },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Toggle single user selection
  const toggleUser = (token: string) => {
    setSelectedUsers((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  // Select/Deselect All
  const selectAllUsers = () => setSelectedUsers(users.map((u) => u.token));
  const deselectAllUsers = () => setSelectedUsers([]);

  // Send notification to all selected users at once
  const sendNotification = async () => {
    if (!title || !message || selectedUsers.length === 0) {
      setStatus("Please fill all fields and select users");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/notifications", {
        title,
        message,
        userTokens: selectedUsers, // send as bulk
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
        <div className="flex items-center mb-6 space-x-3">
          <Bell className="text-indigo-500" size={32} />
          <h2 className="text-2xl font-bold text-gray-800">Push Notification</h2>
        </div>

        {/* Notification Form */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* User Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Select Users</h3>
            <div className="space-x-2">
              <button
                onClick={selectAllUsers}
                className="text-sm text-indigo-600 hover:underline"
              >
                Select All
              </button>
              <button
                onClick={deselectAllUsers}
                className="text-sm text-red-600 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((user) => (
              <label
                key={user.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.includes(user.token)
                    ? "bg-indigo-100 border-indigo-500"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Users className="mr-2 text-gray-600" />
                <span className="text-gray-800">{user.name}</span>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.token)}
                  onChange={() => toggleUser(user.token)}
                  className="ml-auto"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={sendNotification}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md transition-all"
        >
          Send Notification
        </button>

        {status && (
          <p className="mt-4 text-center font-medium text-green-600">{status}</p>
        )}
      </div>
    </div>
  );
};

export default AdminPushNotification;
