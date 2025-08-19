"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { FiUser, FiPackage, FiGift, FiDollarSign, FiArrowLeft, FiShield } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById } from "../actions";

export default function UserLayout({ children }) {
  const { userId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await getUserById(userId);
      if (res.success) setUser(res.data);
    }
    fetchUser();
  }, [userId]);

  const tabs = [
    { href: `/admin/dashboard/users/${userId}`, label: "Overview", icon: <FiUser /> },
    { href: `/admin/dashboard/users/${userId}/orders`, label: "Orders History", icon: <FiPackage /> },
    { href: `/admin/dashboard/users/${userId}/discounts`, label: "Discounts", icon: <FiGift /> },
    { href: `/admin/dashboard/users/${userId}/topups`, label: "Topup History", icon: <FiDollarSign /> },
    { href: `/admin/dashboard/users/${userId}/wallet`, label: "Wallet", icon: <FiDollarSign /> },
  ];

  if (!user) {
    return <div className="p-6">Loading user...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => router.push("/admin/dashboard/users")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="text-lg" />
              Back
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium self-start sm:self-center ${
                user.isAdmin ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              <FiShield className="mr-1" />
              {user.isAdmin ? "Admin" : "User"}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <nav className="flex overflow-x-auto no-scrollbar border-b border-gray-200 bg-white rounded-lg shadow-sm mb-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                pathname === tab.href
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Page Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
