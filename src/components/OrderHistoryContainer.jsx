"use client";
import { useEffect, useState } from "react";
import OrdersHistory from "@/components/OrdersHistory";

export default function OrdersHistoryContainer({ userId }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!userId) return;
    try {
      setIsLoading(true); 
      const res = await fetch(`/api/orders?userId=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) return;
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [userId]);

  const handleRefresh = async (actualOrderIdFromApi, createdOrderId) => {
    try {
      const res = await fetch(`/api/orders/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualOrderIdFromApi, createdOrderId, userId }),
      });
      if (!res.ok) return;
      await fetchAllOrders();
    } catch (err) {
      console.error("Failed to refresh order:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 w-full">
      <OrdersHistory
        title="Orders History"
        orders={orders}
        loading={isLoading}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
