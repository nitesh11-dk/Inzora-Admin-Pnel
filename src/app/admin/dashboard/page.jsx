"use client";

import React, { useEffect, useState } from "react";
import { getDashboardEarnings } from "./actions";
import { getPaymentEarnings } from "./actions"; // import the new function
import LoadingState from "@/components/LodingState";

const Dashboard = () => {
  const [dashboardEarnings, setDashboardEarnings] = useState({
    totalEarnings: 0,
    totalApiCharges: 0,
    actualEarnings: 0,
  });

  const [paymentEarnings, setPaymentEarnings] = useState({
    totalCollected: 0,
    actualEarnings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        setLoading(true);

        // Fetch both earnings
        const [dashboardData, paymentData] = await Promise.all([
          getDashboardEarnings(),
          getPaymentEarnings(),
        ]);

        setDashboardEarnings(dashboardData);
        setPaymentEarnings(paymentData);
      } catch (err) {
        setError(err.message || "Failed to fetch earnings");
      } finally {
        setLoading(false);
      }
    }

    fetchEarnings();
  }, []);

  if (loading) return <LoadingState text="Loading Dashboard..." />;

  if (error)
    return (
      <p className="text-center py-10 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
        Dashboard Earnings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
        {/* Total Earnings */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Earnings (Orders)
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            ₹{dashboardEarnings.totalEarnings.toFixed(4)}
          </p>
        </div>

        {/* Total API Charges */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total API Charges
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            ₹{dashboardEarnings.totalApiCharges.toFixed(4)}
          </p>
        </div>

        {/* Actual Earnings */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Actual Earnings (Orders)
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{dashboardEarnings.actualEarnings.toFixed(4)}
          </p>
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
        Payment Earnings (Razorpay)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Total Collected */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Collected
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            ₹{paymentEarnings.totalCollected.toFixed(4)}
          </p>
        </div>

        {/* Actual Earnings after Fees */}
        <div className="bg-white shadow-lg rounded-xl p-6 text-center flex flex-col items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Actual Earnings (After 2% Fee)
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{paymentEarnings.actualEarnings.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
