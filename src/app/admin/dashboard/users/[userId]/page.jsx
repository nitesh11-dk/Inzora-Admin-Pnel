// app/admin/dashboard/users/[userId]/page.jsx
import UserInfoCard from "@/components/UserInfoCard";
import { getUserById } from "../actions";

export default async function UserOverviewPage({ params }) {
  const { userId } = params;
  const result = await getUserById(userId);

  if (!result.success) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-red-600 font-medium">User not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <UserInfoCard user={result.data} />
      </div>
    </div>
  );
}
