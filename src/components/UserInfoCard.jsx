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
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Information
      </h3>
      <div className="space-y-4">
        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FiUser className="text-gray-400" />
            <span>Name:</span>
          </div>
          <span className="font-medium break-all">{user.name}</span>
        </div>

        {/* Email */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FiMail className="text-gray-400" />
            <span>Email:</span>
          </div>
          <span className="font-medium break-all">{user.email}</span>
        </div>

        {/* Joined Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FiCalendar className="text-gray-400" />
            <span>Joined:</span>
          </div>
          <span className="font-medium">{formatDate(user.createdAt)}</span>
        </div>

        {/* Role */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <FiShield className="text-gray-400" />
            <span>Role:</span>
          </div>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
      </div>
    </div>
  );
}
