"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserDiscount from "@/components/UserDiscount";
import { getUserById } from "../../actions";

export default function DiscountsPage() {
  const { userId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserById(userId);
        if (result.success) {
          setUser(result.data);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Something went wrong while fetching user.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        <span className="sr-only">Loading user data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 w-full">
      <UserDiscount
        user={user}
        onAddDiscount={() =>
          router.push(`/admin/dashboard/discount?userId=${user._id}`)
        }
      />
    </div>
  );
}
