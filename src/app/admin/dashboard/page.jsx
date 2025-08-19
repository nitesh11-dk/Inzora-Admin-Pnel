"use client";

import React, { useEffect, useState } from "react";
import { getDashboardEarnings, getPaymentEarnings } from "./actions";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Dashboard Earnings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-8">
        {/** Orders Cards */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
            Total Earnings (Orders)
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{dashboardEarnings.totalEarnings.toFixed(4)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
            Total API Charges
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{dashboardEarnings.totalApiCharges.toFixed(4)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
            Actual Earnings (Orders)
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            ₹{dashboardEarnings.actualEarnings.toFixed(4)}
          </p>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Payment Earnings (Razorpay)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl">
        {/** Payment Cards */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
            Total Collected
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            ₹{paymentEarnings.totalCollected.toFixed(4)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center">
            Actual Earnings (After 2% Fee)
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            ₹{paymentEarnings.actualEarnings.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
