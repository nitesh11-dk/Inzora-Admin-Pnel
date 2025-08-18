"use client";

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  
import { getAllServices } from "../actions";   
import LoadingState from "@/components/LodingState"; 
 // 👈 reusable loader

const Services = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllServices() {
      try {
        setLoading(true);
        const data = await getAllServices(); // server action
        setServices(data.data);
      } catch (err) {
        setError(err.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    }

    fetchAllServices();
  }, []);

  const handleCardClick = (platformName) => {
    router.push(`/dashboard/service/${encodeURIComponent(platformName.toLowerCase())}`);
  };

  if (loading) return <LoadingState text="Loading Services..." />; 

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Professional Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
          Brezora Services
        </h1>
        <p className="text-gray-600 text-lg">
          Helping your social media presence grow securely and efficiently.
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.length > 0 ? (
          services.map((platform) => (
            <div
              key={platform.name}
              onClick={() => handleCardClick(platform.name)}
              className="cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-300 p-6 flex flex-col items-center text-center bg-white"
            >
              <img
                src={platform.image}
                alt={platform.name}
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {platform.name}
              </h3>
              <p className="text-gray-600 text-sm">{platform.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No services available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
