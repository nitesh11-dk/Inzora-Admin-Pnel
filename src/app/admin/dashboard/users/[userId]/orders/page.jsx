"use client";
import { useParams } from "next/navigation";
import OrdersHistoryContainer from "@/components/OrderHistoryContainer";

export default function OrdersPage() {
  const { userId } = useParams();

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <p className="text-gray-500 text-center">⚠️ Invalid user.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
        Orders History
      </h2>
      <OrdersHistoryContainer userId={userId} />
    </div>
  );
}
