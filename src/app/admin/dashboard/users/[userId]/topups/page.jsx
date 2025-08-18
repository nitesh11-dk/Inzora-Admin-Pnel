"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TopupHistory from "@/components/TopupHistory";
import { getUserTopUpOrders } from "./actions"; // adjust path if needed

export default function TopupHistoryPage() {
  const { userId } = useParams();
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopups = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const result = await getUserTopUpOrders(userId);
        if (result.success) {
          setTopups(result.orders || []);
        }
      } catch (err) {
        console.error("Failed to fetch topups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopups();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-50 w-full">
      <TopupHistory title="Topup History" orders={topups} loading={loading} />
    </div>
  );
}
