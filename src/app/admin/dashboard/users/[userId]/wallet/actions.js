"use server";

import Wallet from "@/lib/models/Wallet";
import connect from "@/lib/mongo";
import Payment from "@/lib/models/Payment";
// Fetch wallet by userId (or create if not exists)
export async function getWalletByUserId(userId) {
  try {
    await connect();
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (err) {
    console.error("Error fetching wallet:", err);
    return { success: false, error: "Failed to fetch wallet" };
  }
}


export async function updateWalletBalance(userId, amount) {
    try {
      await connect();
  
      // Ensure amount is numeric
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Invalid amount");
      }
  
      // Increment balance instead of replacing it
      const wallet = await Wallet.findOneAndUpdate(
        { userId },
        {
          $inc: { balance: numericAmount },
          $set: { lastUpdated: new Date() },
        },
        { new: true, upsert: true }
      );
  
      return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
    } catch (err) {
      console.error("Error updating wallet:", err);
      return { success: false, error: "Failed to update wallet", message: err.message };
    }
  }