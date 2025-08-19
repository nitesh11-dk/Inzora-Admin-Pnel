"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getWalletByUserId, updateWalletBalance } from "./actions";
import { toast } from "react-toastify";

export default function WalletPage() {
  const { userId } = useParams();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const result = await getWalletByUserId(userId);
        if (result.success) {
          setWallet(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchWallet();
  }, [userId]);

  const handleAddFunds = async () => {
    try {
      const addAmount = parseFloat(amount);
      if (isNaN(addAmount) || addAmount <= 0) {
        toast("Please enter a valid amount");
        return;
      }

      const result = await updateWalletBalance(userId, addAmount);

      if (result.success) {
        setWallet(result.data);
        setAmount("");
        setShowForm(false);
        toast("Funds added successfully!");
      }
    } catch (err) {
      console.error("Failed to add funds:", err);
      toast("Error adding funds");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Wallet not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        User Wallet
      </h2>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4">
        <div className="space-y-2 text-sm sm:text-base">
          <p>
            <span className="font-semibold">User ID:</span>{" "}
            <span className="break-all">{wallet.userId}</span>
          </p>
          <p>
            <span className="font-semibold">Current Balance:</span> ₹
            {wallet.balance.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Last Updated:</span>{" "}
            {new Date(wallet.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Add Funds Section */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add Funds
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Enter Amount to Add
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddFunds}
                className="w-full sm:w-auto px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setAmount("");
                }}
                className="w-full sm:w-auto px-5 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
