import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getUserFromToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const token =  cookieStore.get("token")?.value;
  if (!token) return null;

  const user = await getUserFromToken(token);
  return user;
}
