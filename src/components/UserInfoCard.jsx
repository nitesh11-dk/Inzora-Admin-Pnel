"use client";
import { FiUser, FiMail, FiCalendar, FiShield } from "react-icons/fi";

export default function UserInfoCard({ user }) {
  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FiUser className="text-gray-400" />
          <span className="text-gray-600">Name:</span>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiMail className="text-gray-400" />
          <span className="text-gray-600">Email:</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiCalendar className="text-gray-400" />
          <span className="text-gray-600">Joined:</span>
          <span className="font-medium">{formatDate(user.createdAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiShield className="text-gray-400" />
          <span className="text-gray-600">Role:</span>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
      </div>
    </div>
  );
}
