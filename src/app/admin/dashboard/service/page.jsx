"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
} from "../actions";
import LoadingState from "@/components/LodingState";

const Services = () => {
  const router = useRouter();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single form for Add & Edit
  const [form, setForm] = useState({ name: "", image: "", description: "" });
  const [editId, setEditId] = useState(null); // null means add mode

  useEffect(() => {
    async function fetchAllPlatforms() {
      try {
        setLoading(true);
        const data = await getAllPlatforms();
        setPlatforms(data.data);
      } catch (err) {
        setError(err.message || "Failed to load platforms");
      } finally {
        setLoading(false);
      }
    }
    fetchAllPlatforms();
  }, []);

  const handleCardClick = (platformName) => {
    router.push(
      `/admin/dashboard/service/${encodeURIComponent(
        platformName.toLowerCase()
      )}`
    );
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    if (!form.name || !form.image) return setError("Name and Image are required");

    try {
      setLoading(true);
      if (editId) {
        // Update mode
        const res = await updatePlatform(editId, form);
        if (res.success) {
          setPlatforms(platforms.map((p) => (p._id === editId ? res.data : p)));
          setForm({ name: "", image: "", description: "" });
          setEditId(null);
        } else {
          setError(res.message);
        }
      } else {
        // Add mode
        const res = await createPlatform(form);
        if (res.success) {
          setPlatforms([...platforms, res.data]);
          setForm({ name: "", image: "", description: "" });
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError("Failed to save platform");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (platform) => {
    setEditId(platform._id);
    setForm({
      name: platform.name,
      image: platform.image,
      description: platform.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional: scroll to form
  };

  const handleDeletePlatform = async (id) => {
    try {
      const res = await deletePlatform(id);
      if (res.success) {
        setPlatforms(platforms.filter((p) => p._id !== id));
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to delete platform");
    }
  };

  if (loading) return <LoadingState text="Loading Platforms..." />;

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Brezora Platforms
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage all your platforms here.
        </p>
      </div>

      {/* Add / Edit Platform Form */}
      <div className="mb-6 sm:mb-8 border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          {editId ? "Edit Platform" : "Add New Platform"}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Platform Name"
            className="border p-2 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="border p-2 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded-lg w-full text-sm sm:text-base focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAddOrUpdate}
            className="px-4 py-2 w-full sm:w-auto bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {editId ? "Update Platform" : "Add Platform"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setForm({ name: "", image: "", description: "" });
                setEditId(null);
              }}
              className="px-4 py-2 w-full sm:w-auto bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {platforms.length > 0 ? (
          platforms.map((platform) => (
            <div
              key={platform._id}
              onClick={() => handleCardClick(platform.name)}
              className="cursor-pointer border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-4 sm:p-6 flex flex-col items-center text-center bg-white"
            >
              <img
                src={platform.image}
                alt={platform.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-4"
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {platform.name}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                {platform.description}
              </p>
              <div
                className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleEditClick(platform)}
                  className="w-full sm:w-auto px-3 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlatform(platform._id)}
                  className="w-full sm:w-auto px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No platforms available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Services;
