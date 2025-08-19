"use client";

import { Children, useState } from "react";
import { FaWallet, FaBars, FaWhatsapp, FaInstagram, FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiSettings, FiPackage, FiDollarSign, FiFileText, FiUser } from "react-icons/fi";
 import { FiTool } from "react-icons/fi"; // ✅ add this import

export default function Navbar({ isLoggedIn, wallet,children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  async function logoutUser() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="relative min-h-screen  flex flex-col">
      {/* Top Navbar */}
      <div className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 sticky top-0 z-50 flex justify-between items-center py-4">
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          <Link href="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
         <img
                src="/logo.jpg"
                alt="Brezora - ADMIN"
                className="h-12 w-12 rounded-full object-cover"
              />
            <span className="hidden sm:inline">Brezora - ADMIN</span>
          </Link>
        </div>

        {isLoggedIn && (
          <a 
            href="https://themainsmmprovider.in/addfunds" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer select-none">
              <FaWallet className="text-xl" />
              <span className="font-semibold">₹{wallet?.balance ? parseFloat(wallet.balance).toFixed(4) : "0.00"}</span>
              <FaPlus />
            </div>
          </a>
        )}
      </div>

<div className="flex h-[92vh]">
  
      {/* Sidebar & Overlay */}
      {isLoggedIn && (
        <>
          {/* Sidebar Overlay */}
          <div
            onClick={closeSidebar}
            className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 lg:hidden ${
              sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!sidebarOpen}
          ></div>

          {/* Sidebar */}
          <aside
            className={`fixed top-14 left-0 bottom-0 w-64  bg-white border-r border-gray-200 text-gray-800 flex  flex-col justify-between z-50 transform transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:static lg:top-auto lg:bottom-auto lg:border-none lg:flex`}
          >
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <ul className="space-y-1">
                {[
                  { href: "/admin/dashboard/users", icon: <FiSettings className="text-xl" />, label: "Users" },
{ 
  href: "/admin/dashboard/service", 
  icon: <FiTool className="text-xl" />, // ✅ changed to service-like icon
  label: "Services" // also renamed label for clarity
}
                ].map(({ href, icon, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeSidebar}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => {
                    logoutUser?.();
                    closeSidebar();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>

          
          </aside>
        </>
      )}
      {children}
</div>

     
    </div>
  );
}
