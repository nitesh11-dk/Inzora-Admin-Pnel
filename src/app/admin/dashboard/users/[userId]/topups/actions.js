"use server"

import Payment from "@/lib/models/Payment";
import connect from "@/lib/mongo";

export async function getUserTopUpOrders(userId) {
  try {
    await connect();
    
    // Use the same logic as the coins history page
    const orders = await Payment.find({ userId: userId }).sort({ createdAt: -1 });

    return {
      success: true,
      orders: orders,
      count: orders.length
    };
  } catch (error) {
    console.error('Error fetching user topup orders:', error);
    return {
      success: false,
      error: 'Failed to fetch topup orders',
      message: error.message
    };
  }
}


