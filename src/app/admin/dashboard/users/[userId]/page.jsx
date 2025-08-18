// app/admin/dashboard/users/[userId]/page.jsx
import UserInfoCard from "@/components/UserInfoCard";
import { getUserById } from "../actions";

export default async function UserOverviewPage({ params }) {
  const { userId } = params;
  const result = await getUserById(userId);

  if (!result.success) {
    return <p>User not found.</p>;
  }

  return (
    <div>
      <UserInfoCard user={result.data} />
    </div>
  );
}
