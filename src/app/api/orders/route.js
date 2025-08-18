import Order from '@/lib/models/Order';
import connect from '@/lib/mongo';
import { getUserFromCookies } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");

    const currUser = await getUserFromCookies();

    // If admin is fetching for another user
    let userId = queryUserId || (currUser?.id ?? null);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ userId })
      .select(
        "_id price quantity startCount status remains actualOrderIdFromApi link platformService createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { message: "Orders fetched successfully", orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
