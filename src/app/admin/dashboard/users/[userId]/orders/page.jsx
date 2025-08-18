"use client";
import { useParams } from "next/navigation";
import OrdersHistoryContainer from "@/components/OrderHistoryContainer";

export default function OrdersPage() {
  const { userId } = useParams();

  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Invalid user.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 w-full">
      <OrdersHistoryContainer userId={userId} />
    </div>
  );
}
