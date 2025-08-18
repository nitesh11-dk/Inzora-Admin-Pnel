"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getDiscountedServicesByPlatform } from "../../actions"; // your createOrder action
import { toast } from "react-toastify";
import LoadingState from "@/components/LodingState"; 

const fetchServicesByPlatform = async (platform) => {
  const res = await getDiscountedServicesByPlatform(platform);
  return res;
};

const PlatformServicePage = () => {
  const router = useRouter();
  const params = useParams();
  const platform = params.platform;


  const [platformServices, setPlatformServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const quantity = watch("quantity");
  useEffect(() => {
    if (!platform) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchServicesByPlatform(platform.toLowerCase());
        console.log(data);
        setPlatformServices(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [platform]);

  useEffect(() => {
    if (selectedService && quantity) {
      const qty = parseInt(quantity, 10);
      const pricePerThousand = selectedService.rate;
      let price = (qty / 1000) * pricePerThousand;
  
      if (selectedService.discountApplied) {
        price = price * (1 - selectedService.discountApplied / 100);
      }
  
      setCalculatedPrice(price.toFixed(2));
    } else {
      setCalculatedPrice(0);
    }
  }, [selectedService, quantity]);
  

  const categoryServices =
    selectedCategory && platformServices?.categories
      ? platformServices.categories[selectedCategory]
      : [];

  const linkType = selectedCategory?.toLowerCase().includes("view") ||
    selectedCategory?.toLowerCase().includes("comment") ||
    selectedCategory?.toLowerCase().includes("like")
    ? "post"
    : selectedCategory?.toLowerCase().includes("follower")
    ? "profile"
    : "";

  
const onSubmit = async (data) => {
  const orderData = {
    platform,
    category: selectedCategory,
    service: selectedService.service,
    quantity: data.quantity,
    price: calculatedPrice,
    link: data.link,
  };

  try {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if needed
      },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();

    if (res.ok && result.validated) {
      reset();
      setSelectedCategory("");
      setSelectedService(null);
      setCalculatedPrice(0);

      toast.success("🎉 Order placed successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error(`❌ Order failed: ${result.error || "Unknown error"}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  } catch (err) {
    console.error("Order error:", err);
    toast.error(`🚨 Order failed: ${err.message}`, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

    
if (loading) return <LoadingState text="Loading Services..." />; // ✅ spinner here

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }
  
  if (!platformServices) {
    
    return   <div className="flex items-center justify-center w-full"> <p className="text-center py-10">No services found for this platform.</p> </div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <FiArrowLeft className="text-xl" />
        <span>Back</span>
      </Link>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize text-gray-800">{platform}</h1>

      <div className="space-y-8">
        {/* Categories */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Select a Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(platformServices.categories).map((category) => (
              <div
                key={category}
                className={`border rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition ${
                  selectedCategory === category ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedService(null);
                  reset();
                  setCalculatedPrice(0);
                }}
              >
                <h3 className="font-bold capitalize text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </div>

        {selectedCategory && (
  <div>
    <h2 className="text-xl font-semibold mb-3 text-gray-800">
      Select a Service for {selectedCategory}
    </h2>

   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categoryServices.map((svc) => (
        <div
          key={svc.service}
          className={`relative border rounded-lg p-4 cursor-pointer hover:shadow-md transition ${
            selectedService?.service === svc.service
              ? "border-green-600 bg-green-50"
              : "border-gray-300 bg-white"
          }`}
          onClick={() => {
            setSelectedService(svc);
            reset();
            setCalculatedPrice(0);
          }}
        >
          {svc.discountApplied && (
            <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md z-10">
              {svc.discountApplied}% OFF
            </div>
          )}

          <h4 className="font-bold text-gray-800">ID: {svc.service}</h4>
          <ul className="text-sm mb-1 text-gray-700">
            {svc.desc.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>

          <p className="text-sm text-gray-700">Rate: ₹{svc.rate} / 1K</p>
          <p className="text-xs text-gray-500">
            Min: {svc.min} | Max: {svc.max}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{selectedService && (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-4 rounded-lg shadow">
      {/* Quantity Input */}
      <div>
        <label className="block mb-1 font-semibold text-gray-800">Quantity</label>
        <input
          type="number"
          placeholder={`Min: ${selectedService.min}, Max: ${selectedService.max}`}
          className="
            w-full
            px-4 py-2
            border border-gray-300
            rounded-md
            bg-white
            text-gray-800
            placeholder-gray-500
            focus:outline-none
            focus:border-indigo-500
            focus:ring-2 focus:ring-indigo-200
            transition
            disabled:bg-gray-100
            disabled:cursor-not-allowed
          "
          {...register("quantity", {
            required: "Quantity is required",
            min: {
              value: selectedService.min,
              message: `Minimum is ${selectedService.min}`,
            },
            max: {
              value: selectedService.max,
              message: `Maximum is ${selectedService.max}`,
            },
          })}
        />
        {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
      </div>

      {/* Link input if applicable */}
      {linkType && (
        <div>
          <label className="block mb-1 font-semibold text-gray-800">
            {linkType === "post" ? "Post/Reel URL" : "Profile URL"}
          </label>
          <input
            type="url"
            placeholder={linkType === "post" ? "Enter link to post/reel" : "Enter profile URL"}
            className="
              w-full
              px-4 py-2
              border border-gray-300
              rounded-md
              bg-white
              text-gray-800
              placeholder-gray-500
              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-200
              transition
              disabled:bg-gray-100
              disabled:cursor-not-allowed
            "
            {...register("link", {
              required: "Link is required",
              pattern: {
                value: /^(https?:\/\/)/,
                message: "Enter a valid URL",
              },
            })}
          />
          {errors.link && <p className="text-red-600 text-sm mt-1">{errors.link.message}</p>}
        </div>
      )}

{quantity && (
  <div className="font-semibold text-gray-800 flex justify-between items-center space-x-4">
    <div className="flex-1">
      <p>
        Original Price:{" "}
        <span className={` ${selectedService.discountApplied ? "line-through" : null } text-gray-500`}>
          ₹{((selectedService.rate / 1000) * quantity).toFixed(2)}
        </span>
      </p>
      {selectedService.discountApplied && (
        <p className="text-green-600">
          Discount: {selectedService.discountApplied}% off
        </p>
      )}
    </div>

    <div className="flex-1 text-right">
      {selectedService.discountApplied ? (
        <>
          <p>
            Estimated Price:{" "}
            <span className="text-blue-600">
              ₹
              {(
                (selectedService.rate / 1000) *
                quantity *
                (1 - selectedService.discountApplied / 100)
              ).toFixed(2)}
            </span>
          </p>
          <p className="text-sm text-green-700 font-medium">🎉 Discount applied!</p>
        </>
      ) : (
        <p>
          {/* Estimated Price:{" "}
          <span className="text-blue-600">
            ₹{((selectedService.rate / 1000) * quantity).toFixed(2)}
          </span> */}
        </p>
      )}
    </div>
  </div>
)}

      <button
        type="submit"
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
      >
        Submit Order
      </button>
    </form>
  )}
      </div>
    </div>
  );
};

export default PlatformServicePage;
