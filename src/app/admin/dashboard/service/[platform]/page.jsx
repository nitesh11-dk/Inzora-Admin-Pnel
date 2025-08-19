"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getPlatformById,
  addCategory,
  deleteCategory,
  updateCategory,
  addServiceToCategory,
  updateServiceInCategory,
  deleteServiceFromCategory,
} from "../../actions";
import LoadingState from "@/components/LodingState";

// ✅ Normalize backend response so _id is string and categories is object
const normalizePlatform = (platform) => ({
  ...platform,
  _id: platform._id?.toString(),
  categories: platform.categories ? { ...platform.categories } : {},
});

const PlatformDetail = () => {
  const { platform: platformName } = useParams();
  const [platform, setPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category state
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameEdit, setCategoryNameEdit] = useState("");

  // Service state
  const [newService, setNewService] = useState({
    service: "",
    rate: "",
    min: "",
    max: "",
    desc: "",
  });
  const [editingService, setEditingService] = useState(null); // {category, index}
  const [serviceEdit, setServiceEdit] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);

  // ✅ Fetch platform data
  useEffect(() => {
    async function fetchPlatform() {
      try {
        setLoading(true);
        const res = await getPlatformById(platformName);
        if (res.success) {
          setPlatform(normalizePlatform(res.data));
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError("Failed to load platform");
      } finally {
        setLoading(false);
      }
    }
    fetchPlatform();
  }, [platformName]);

  // CATEGORY HANDLERS
  const handleAddCategory = async () => {
    if (!newCategory) return;
    const res = await addCategory(platform._id, newCategory);
    if (res.success) {
      setPlatform((prev) => ({
        ...prev,
        categories: { ...prev.categories, [newCategory]: [] },
      }));
      setNewCategory("");
    }
  };

  const handleDeleteCategory = async (category) => {
    const res = await deleteCategory(platform._id, category);
    if (res.success) {
      setPlatform((prev) => {
        const updatedCats = { ...prev.categories };
        delete updatedCats[category];
        return { ...prev, categories: updatedCats };
      });
      if (selectedCategory === category) setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = async (oldCategory, newName) => {
    if (!newName) return;
    const res = await updateCategory(platform._id, oldCategory, newName);
    if (res.success) {
      setPlatform((prev) => {
        const updatedCats = { ...prev.categories };
        updatedCats[newName] = updatedCats[oldCategory];
        delete updatedCats[oldCategory];
        return { ...prev, categories: updatedCats };
      });
      if (selectedCategory === oldCategory) setSelectedCategory(newName);
      setEditingCategory(null);
      setCategoryNameEdit("");
    }
  };

  // SERVICE HANDLERS
  const handleAddService = async () => {
    if (!selectedCategory) return;
    const res = await addServiceToCategory(platform._id, selectedCategory, newService);
    if (res.success) {
      setPlatform((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [selectedCategory]: [...(prev.categories[selectedCategory] || []), newService],
        },
      }));
      setNewService({ service: "", rate: "", min: "", max: "", desc: "" });
    }
  };

  const handleUpdateService = async (category, index, updatedService) => {
    const res = await updateServiceInCategory(platform._id, category, index, updatedService);
    if (res.success) {
      setPlatform((prev) => {
        const updated = [...prev.categories[category]];
        updated[index] = updatedService;
        return { ...prev, categories: { ...prev.categories, [category]: updated } };
      });
      setEditingService(null);
      setServiceEdit(null);
    }
  };

  const handleDeleteService = async (category, index) => {
    const res = await deleteServiceFromCategory(platform._id, category, index);
    if (res.success) {
      setPlatform((prev) => {
        const updated = [...prev.categories[category]];
        updated.splice(index, 1);
        return { ...prev, categories: { ...prev.categories, [category]: updated } };
      });
    }
  };

  // -------- UI --------
  if (loading) return <LoadingState text="Loading Platform..." />;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!platform) return <p className="text-center py-10">Platform not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        {platform.name}
      </h1>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Category List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(platform.categories || {}).map((cat) => (
            <div
              key={cat}
              className={`p-4 border rounded cursor-pointer ${
                selectedCategory === cat ? "bg-blue-50 border-blue-600" : "bg-white"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                {editingCategory === cat ? (
                  <>
                    <input
                      value={categoryNameEdit}
                      onChange={(e) => setCategoryNameEdit(e.target.value)}
                      className="border p-1 rounded flex-1"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUpdateCategory(cat, categoryNameEdit);
                        }}
                        className="text-green-600 font-bold"
                      >
                        ✔
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(null);
                          setCategoryNameEdit("");
                        }}
                        className="text-gray-500"
                      >
                        ✖
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold capitalize">{cat}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(cat);
                          setCategoryNameEdit(cat);
                        }}
                        className="text-yellow-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(cat);
                        }}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      {selectedCategory && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Services in {selectedCategory}
          </h2>

          {/* Add Service Form */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-2">
            <input
              type="text"
              placeholder="Service ID"
              value={newService.service}
              onChange={(e) => setNewService({ ...newService, service: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Rate"
              value={newService.rate}
              onChange={(e) => setNewService({ ...newService, rate: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Min"
              value={newService.min}
              onChange={(e) => setNewService({ ...newService, min: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={newService.max}
              onChange={(e) => setNewService({ ...newService, max: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newService.desc}
              onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
              className="border p-2 rounded md:col-span-2"
            />
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Service
            </button>
          </div>

          {/* Service List */}
          <div className="space-y-4">
            {platform.categories[selectedCategory]?.map((svc, index) => (
              <div
                key={index}
                className="border p-4 rounded bg-white shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4"
              >
                {editingService?.index === index ? (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-2">
                    <input
                      value={serviceEdit.service}
                      onChange={(e) =>
                        setServiceEdit({ ...serviceEdit, service: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      value={serviceEdit.rate}
                      onChange={(e) =>
                        setServiceEdit({ ...serviceEdit, rate: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      value={serviceEdit.min}
                      onChange={(e) =>
                        setServiceEdit({ ...serviceEdit, min: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      value={serviceEdit.max}
                      onChange={(e) =>
                        setServiceEdit({ ...serviceEdit, max: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      value={serviceEdit.desc}
                      onChange={(e) =>
                        setServiceEdit({ ...serviceEdit, desc: e.target.value })
                      }
                      className="border p-1 rounded md:col-span-2"
                    />
                    <div className="flex gap-2 col-span-1 md:col-span-6 mt-2">
                      <button
                        onClick={() =>
                          handleUpdateService(selectedCategory, index, serviceEdit)
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingService(null);
                          setServiceEdit(null);
                        }}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h4 className="font-bold">{svc.service}</h4>
                      <p className="text-sm text-gray-600">{svc.desc}</p>
                      <p className="text-xs text-gray-500">
                        Rate: {svc.rate} | Min: {svc.min} | Max: {svc.max}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingService({ category: selectedCategory, index });
                          setServiceEdit(svc);
                        }}
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(selectedCategory, index)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformDetail;
