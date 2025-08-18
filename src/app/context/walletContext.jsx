"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getBalanceFromApi } from "@/app/admin/dashboard/actions"; // adjust path

// 1️⃣ Create context
const WalletContext = createContext();

// 2️⃣ Create provider
export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  // Fetch wallet on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const walletData = await getBalanceFromApi();
        console.log("Fetched wallet data:", walletData);
        setWallet(walletData);
      } catch (err) {
        console.error("Error fetching wallet:", err);
      }
    };
    fetchWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// 3️⃣ Custom hook for easy access
export const useWallet = () => useContext(WalletContext);
