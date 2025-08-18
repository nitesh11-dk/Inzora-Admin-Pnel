"use client";

import { useState, useEffect } from "react";
import { setUserDiscount, getAllPlatformsWithCategoriesAndServices } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

function DiscountForm() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get("userId") || "";

  const [userId, setUserId] = useState(initialUserId);
  const [platforms, setPlatforms] = useState([]);
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState(null);

  const router = useRouter();

  // ✅ Load platforms + categories + services from DB
  useEffect(() => {
    async function loadPlatforms() {
      try {
        const data = await getAllPlatformsWithCategoriesAndServices();
        console.log(data)
        setPlatforms(data);
      } catch (err) {
        console.error("Error loading platforms:", err);
      }
    }
    loadPlatforms();
  }, []);

  async function updateDiscount(data) {
    const { userId, serviceId, discount } = data;

    if (!userId || !serviceId || !discount) {
      throw new Error("Missing required fields");
    }

    const discountValue = Number(discount);
    if (isNaN(discountValue)) {
      throw new Error("Discount must be a number");
    }

    const updatedUser = await setUserDiscount(userId, serviceId, discountValue);
    router.push(`/admin/dashboard/users/${userId}/discounts`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await updateDiscount({ userId, serviceId, discount });
      setMessage("✅ Discount updated successfully!");
      setServiceId("");
      setDiscount("");
      setPlatform("");
      setCategory("");
      router.refresh();
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  // Get categories for selected platform
  const selectedPlatform = platforms.find((p) => p.name === platform);
  const categories = selectedPlatform ? Object.keys(selectedPlatform.categories) : [];

  // Get services for selected category
  const services =
    selectedPlatform && category
      ? selectedPlatform.categories[category]
      : [];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Set User Discount
        </h2>

        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            placeholder="Enter user ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setCategory("");
              setServiceId("");
            }}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">-- Select Platform --</option>
            {platforms.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        {platform && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setServiceId("");
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Service */}
        {category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Select Service --</option>
              {services.map((svc) => (
                <option key={svc.service} value={svc.service}>
                  {svc.service} — {svc.desc} (Rate: {svc.rate})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            min="1"
            max="100"
            required
            placeholder="Enter discount 1-100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Update Discount
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm font-medium mt-2 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default DiscountForm;
